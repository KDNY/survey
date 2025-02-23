import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'

function TestingItemsList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchTestingItems()
  }, [])

  const fetchTestingItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('testing_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setItems(data)
    } catch (error) {
      console.error('Error fetching testing items:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this test item?')) {
      return
    }

    try {
      setDeleting(itemId)
      const { error } = await supabase
        .from('testing_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      setItems(items.filter(item => item.id !== itemId))
    } catch (error) {
      console.error('Error deleting test item:', error)
      setError(error.message)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <div>Loading testing items...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Testing Items</h3>
        <p className="mt-1 text-sm text-gray-500">List of all available testing items</p>
      </div>

      {error && (
        <div className="mx-4 my-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference Range
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interpretation
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name_en}</div>
                  <div className="text-sm text-gray-500">{item.name_secondary}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.reference_range}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.measurement_unit}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 max-w-xs">{item.interpretation}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className={`text-red-600 hover:text-red-900 ${
                      deleting === item.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {deleting === item.id ? (
                      <span className="inline-flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Deleting...
                      </span>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TestingItemsList 