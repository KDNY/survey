import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'

function UserTestForm({ user }) {
  const [testingItems, setTestingItems] = useState([])
  const [formData, setFormData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  useEffect(() => {
    fetchTestingItems()
  }, [])

  const fetchTestingItems = async () => {
    try {
      const { data, error } = await supabase
        .from('testing_items')
        .select('*')
        .order('name_en')

      if (error) throw error

      setTestingItems(data)
      // Initialize form data with empty values for each test
      setFormData(data.map(item => ({
        testing_item_id: item.id,
        before_value: '',
        after_value: ''
      })))
    } catch (error) {
      console.error('Error fetching testing items:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (index, field, value) => {
    const newFormData = [...formData]
    newFormData[index][field] = value
    setFormData(newFormData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // Get current session
      const { data: { user }, error: sessionError } = await supabase.auth.getUser()
      
      if (sessionError || !user) {
        throw new Error('Please login to submit test results')
      }

      console.log('Submitting test results...')
      const testResults = formData.map(item => ({
        ...item,
        user_id: user.id,  // Use the user ID from the current session
        test_date: new Date().toISOString()
      }))

      console.log('Test results formatted:', testResults)

      const { data, error } = await supabase
        .from('user_test_results')
        .insert(testResults)
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error('Failed to submit test results')
      }

      console.log('Supabase response:', data)  // Debug log

      // Store submitted data for confirmation display
      const submissionData = {
        testDate: new Date().toISOString(),
        results: formData.map((result, index) => ({
          ...result,
          testName: testingItems[index].name_en,
          testNameSecondary: testingItems[index].name_secondary,
          unit: testingItems[index].measurement_unit,
          referenceRange: testingItems[index].reference_range
        }))
      }

      console.log('Setting submitted data:', submissionData)  // Debug log
      setSubmittedData(submissionData)
      
      console.log('Showing confirmation...')  // Debug log
      setShowConfirmation(true)

    } catch (error) {
      console.error('Error submitting results:', error)
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownloadResults = () => {
    if (!submittedData) return

    const resultsText = `
Health Test Results
Date: ${new Date(submittedData.testDate).toLocaleDateString()}

${submittedData.results.map(result => `
Test: ${result.testName} / ${result.testNameSecondary}
Before Treatment: ${result.before_value} ${result.unit}
After Treatment: ${result.after_value} ${result.unit}
Reference Range: ${result.referenceRange}
`).join('\n')}

This document is confidential and for your personal records.
    `.trim()

    const blob = new Blob([resultsText], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `health_test_results_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (showConfirmation) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Results Submitted Successfully!</h2>
            <p className="text-gray-600">
              Your test results have been securely stored in our database. We take your privacy seriously 
              and ensure all your medical information remains confidential.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Test Summary</h3>
            <div className="space-y-4">
              {submittedData.results.map((result, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <div className="font-medium">{result.testName}</div>
                  <div className="text-sm text-gray-500">{result.testNameSecondary}</div>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Before Treatment:</span>
                      <span className="ml-2">{result.before_value} {result.unit}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">After Treatment:</span>
                      <span className="ml-2">{result.after_value} {result.unit}</span>
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Reference Range: {result.referenceRange}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleDownloadResults}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Results
            </button>
            <button
              onClick={() => {
                setShowConfirmation(false)
                setFormData(testingItems.map(item => ({
                  testing_item_id: item.id,
                  before_value: '',
                  after_value: ''
                })))
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Another Test
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) return <div>Loading test form...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header Section */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900">Health Test Results</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your test results before and after treatments
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 my-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Table Section */}
          <div className="p-6">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Test Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                      Before Test
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                      After Test
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Reference Range
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                      Unit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                      Interpretation
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {testingItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.name_en}</div>
                        <div className="text-sm text-gray-500">{item.name_secondary}</div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          step="any"
                          value={formData[index]?.before_value}
                          onChange={(e) => handleChange(index, 'before_value', e.target.value)}
                          className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          step="any"
                          value={formData[index]?.after_value}
                          onChange={(e) => handleChange(index, 'after_value', e.target.value)}
                          className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{item.reference_range}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{item.measurement_unit}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs">{item.interpretation}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                All fields are required. Please ensure accuracy in your measurements.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Test Results'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserTestForm 