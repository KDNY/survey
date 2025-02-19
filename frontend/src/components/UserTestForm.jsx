import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'

function UserTestForm({ user }) {
  const [testingItems, setTestingItems] = useState([])
  const [formData, setFormData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

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
      const { data, error } = await supabase
        .from('user_test_results')
        .insert(formData.map(item => ({
          ...item,
          user_id: user.id,
          test_date: new Date().toISOString()
        })))
        .select()

      if (error) throw error

      // Reset form after successful submission
      setFormData(testingItems.map(item => ({
        testing_item_id: item.id,
        before_value: '',
        after_value: ''
      })))

      alert('Test results submitted successfully!')
    } catch (error) {
      console.error('Error submitting results:', error)
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div>Loading test form...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header Section */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900">Health Test Results</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your test results before and after treatment
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