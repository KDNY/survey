import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'

function AdminTestResults() {
  const [testResults, setTestResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchEmail, setSearchEmail] = useState('')
  const [selectedEmail, setSelectedEmail] = useState(null)

  useEffect(() => {
    fetchTestResults()
  }, [])

  const fetchTestResults = async () => {
    try {
      setLoading(true)
      const { data: results, error } = await supabase
        .from('user_test_results_with_users')
        .select('*')
        .order('test_date', { ascending: false })

      if (error) throw error
      setTestResults(results)
    } catch (error) {
      console.error('Error fetching test results:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Group results by email
  const emailGroups = testResults.reduce((groups, result) => {
    if (!groups[result.email]) {
      groups[result.email] = {
        email: result.email,
        name: result.raw_user_meta_data?.name,
        results: []
      }
    }
    groups[result.email].results.push(result)
    return groups
  }, {})

  // Filter emails based on search
  const filteredEmails = Object.values(emailGroups)
    .filter(group => 
      searchEmail === '' || 
      group.email?.toLowerCase().includes(searchEmail.toLowerCase())
    )
    .sort((a, b) => a.email.localeCompare(b.email))

  if (loading) return <div>Loading test results...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">User Test Results</h2>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
          {/* Email List */}
          <div className="md:col-span-1 border-r border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Users</h3>
            <div className="space-y-2">
              {filteredEmails.map(group => (
                <button
                  key={group.email}
                  onClick={() => setSelectedEmail(group.email === selectedEmail ? null : group.email)}
                  className={`w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 ${
                    selectedEmail === group.email ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                >
                  <div className="font-medium text-gray-900">{group.email}</div>
                  {group.name && (
                    <div className="text-sm text-gray-500">{group.name}</div>
                  )}
                  <div className="text-sm text-gray-500">
                    {group.results.length} test{group.results.length !== 1 ? 's' : ''}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Test Results */}
          <div className="md:col-span-3">
            {selectedEmail ? (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Test Results for {selectedEmail}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test Name
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan="2">
                          Test Results
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reference Range
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                      <tr className="bg-gray-100">
                        <th colSpan="2"></th>
                        <th className="px-6 py-2 text-center text-xs font-medium text-gray-500">
                          Before
                        </th>
                        <th className="px-6 py-2 text-center text-xs font-medium text-gray-500">
                          After
                        </th>
                        <th colSpan="2"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {emailGroups[selectedEmail].results.map((result) => (
                        <tr key={result.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {result.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {result.raw_user_meta_data?.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {result.name_en}
                            </div>
                            <div className="text-sm text-gray-500">
                              {result.name_secondary}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {result.before_value} <span className="text-gray-500">{result.measurement_unit}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {result.after_value} <span className="text-gray-500">{result.measurement_unit}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.reference_range}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(result.test_date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Select a user to views their test results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminTestResults 