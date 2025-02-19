import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'

function TestingItemsList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) return <div>Loading testing items...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name (EN/Secondary)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference Range
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Risk Levels
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Interpretation
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{item.name_en}</div>
                <div className="text-sm text-gray-500">{item.name_secondary}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {item.reference_range}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {item.measurement_unit}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div>Low: {item.risk_level_low || 'N/A'}</div>
                <div>High: {item.risk_level_high || 'N/A'}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {item.interpretation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {items.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No testing items found
        </div>
      )}
    </div>
  )
}

export default TestingItemsList 