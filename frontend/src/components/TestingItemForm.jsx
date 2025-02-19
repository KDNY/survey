import { useState } from 'react'
import supabase from '../lib/supabase'
// import { seedTestingItems } from '../utils/seedData'

function TestingItemForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    nameEn: '',
    nameSecondary: '',
    referenceRange: '',
    measurementUnit: '',
    riskLevelLow: '',
    riskLevelHigh: '',
    interpretation: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('testing_items')
        .insert([{
          name_en: formData.nameEn,
          name_secondary: formData.nameSecondary,
          reference_range: formData.referenceRange,
          measurement_unit: formData.measurementUnit,
          risk_level_low: formData.riskLevelLow,
          risk_level_high: formData.riskLevelHigh,
          interpretation: formData.interpretation,
          notes: formData.notes
        }])
        .select()

      if (error) throw error

      setFormData({
        nameEn: '',
        nameSecondary: '',
        referenceRange: '',
        measurementUnit: '',
        riskLevelLow: '',
        riskLevelHigh: '',
        interpretation: '',
        notes: ''
      })

      if (onSubmit) onSubmit(data[0])
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSeedData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await seedTestingItems(supabase)
      console.log('Seeded data:', data)
      
      // Notify parent component
      if (onSubmit) onSubmit(data)
    } catch (error) {
      console.error('Error seeding data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="w-full">
          <table className="w-full">
            <colgroup>
              <col className="w-1/5" />
              <col className="w-4/5" />
            </colgroup>
            <tbody>
              {/* Name Fields */}
              <tr>
                <td className="py-2 pr-12">
                  <label className="block text-sm font-medium text-gray-700">
                    Testing Item Name (English)
                  </label>
                </td>
                <td className="py-2">
                  <div className="max-w-3xl">
                    <input
                      type="text"
                      name="nameEn"
                      value={formData.nameEn}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                      required
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <td className="py-2 pr-12">
                  <label className="block text-sm font-medium text-gray-700">
                    Testing Item Name (Second Language)
                  </label>
                </td>
                <td className="py-2">
                  <div className="max-w-3xl">
                    <input
                      type="text"
                      name="nameSecondary"
                      value={formData.nameSecondary}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                    />
                  </div>
                </td>
              </tr>

              {/* Range and Unit Fields */}
              <tr>
                <td className="py-2 pr-12">
                  <label className="block text-sm font-medium text-gray-700">
                    Reference Range
                  </label>
                </td>
                <td className="py-2">
                  <div className="max-w-3xl">
                    <input
                      type="text"
                      name="referenceRange"
                      value={formData.referenceRange}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                      required
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <td className="py-2 pr-12">
                  <label className="block text-sm font-medium text-gray-700">
                    Measurement Unit
                  </label>
                </td>
                <td className="py-2">
                  <div className="max-w-3xl">
                    <input
                      type="text"
                      name="measurementUnit"
                      value={formData.measurementUnit}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                      required
                    />
                  </div>
                </td>
              </tr>

              {/* Risk Level Fields */}
              <tr>
                <td className="py-2 pr-12">
                  <label className="block text-sm font-medium text-gray-700">
                    Risk Level Low Threshold
                  </label>
                </td>
                <td className="py-2">
                  <div className="max-w-3xl">
                    <input
                      type="number"
                      name="riskLevelLow"
                      value={formData.riskLevelLow}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                      required
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <td className="py-2 pr-12">
                  <label className="block text-sm font-medium text-gray-700">
                    Risk Level High Threshold
                  </label>
                </td>
                <td className="py-2">
                  <div className="max-w-3xl">
                    <input
                      type="number"
                      name="riskLevelHigh"
                      value={formData.riskLevelHigh}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                      required
                    />
                  </div>
                </td>
              </tr>

              {/* Text Area Fields */}
              <tr>
                <td className="py-2 pr-12">
                  <label className="block text-sm font-medium text-gray-700">
                    Interpretation Guidelines
                  </label>
                </td>
                <td className="py-2">
                  <div className="max-w-3xl">
                    <textarea
                      name="interpretation"
                      value={formData.interpretation}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                      required
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <td className="py-2 pr-12">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                </td>
                <td className="py-2">
                  <div className="max-w-3xl">
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                    />
                  </div>
                </td>
              </tr>

              {/* Add Submit Button as last table row */}
              <tr>
                <td className="py-2 pr-12">
                  {/* Empty label cell */}
                </td>
                <td className="py-6">
                  <div className="max-w-3xl"> {/* Same container as inputs */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-500 text-white px-12 py-3 rounded-lg text-lg font-medium hover:bg-blue-600 disabled:bg-blue-300"
                    >
                      {loading ? 'Saving...' : 'Save Testing Item'}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
    </div>
  )
}

export default TestingItemForm 