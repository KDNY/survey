import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import supabase from './lib/supabase'

function App() {
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newSurvey, setNewSurvey] = useState({ question: '', answer: '' })

  useEffect(() => {
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        throw error
      }

      console.log('Surveys loaded:', data)
      setSurveys(data || [])
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('surveys')
        .insert([newSurvey])
        .select()

      if (error) throw error

      setSurveys([...surveys, data[0]])
      setNewSurvey({ question: '', answer: '' })
    } catch (error) {
      console.error('Error:', error)
      alert(error.message)
    }
  }

  if (loading) return <div>Loading surveys...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <h1 className="text-2xl font-bold mb-5">Survey Responses</h1>
      
      {/* Add Survey Form */}
      <form onSubmit={handleSubmit} className="mb-8 w-full max-w-md">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Question"
            value={newSurvey.question}
            onChange={(e) => setNewSurvey({ ...newSurvey, question: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Answer"
            value={newSurvey.answer}
            onChange={(e) => setNewSurvey({ ...newSurvey, answer: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Survey
        </button>
      </form>

      {/* Survey List */}
      <ul className="bg-white p-5 rounded-lg shadow-md w-full max-w-md">
        {surveys.length === 0 ? (
          <li className="text-center text-gray-500">No surveys yet</li>
        ) : (
          surveys.map((survey) => (
            <li key={survey.id} className="border-b p-2 last:border-b-0">
              <strong>Q:</strong> {survey.question} <br />
              <strong>A:</strong> {survey.answer}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default App