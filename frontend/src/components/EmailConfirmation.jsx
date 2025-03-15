import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import supabase from '../lib/supabase'

function EmailConfirmation({ onConfirmed }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('confirming')
  const [error, setError] = useState(null)

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get the token from URL parameters
        const token = searchParams.get('token')
        const type = searchParams.get('type')

        if (!token || type !== 'signup') {
          throw new Error('Invalid confirmation link')
        }

        // Verify the token with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        })

        if (error) throw error

        // If successful, update state and redirect
        setStatus('confirmed')
        if (data?.user) {
          onConfirmed(data.user)
          setTimeout(() => {
            navigate('/')
          }, 2000)
        }
      } catch (error) {
        console.error('Confirmation error:', error)
        setError(error.message)
        setStatus('error')
      }
    }

    confirmEmail()
  }, [searchParams, navigate, onConfirmed])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg px-8 py-10">
          <div className="text-center">
            {status === 'confirming' && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Confirming your email...
                </h2>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              </>
            )}

            {status === 'confirmed' && (
              <>
                <svg
                  className="h-12 w-12 text-green-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Email Confirmed!
                </h2>
                <p className="text-gray-600">
                  Redirecting you to the dashboard...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <svg
                  className="h-12 w-12 text-red-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Confirmation Failed
                </h2>
                <p className="text-red-600">
                  {error || 'Unable to confirm your email. Please try again.'}
                </p>
                <button
                  onClick={() => navigate('/auth/login')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Return to Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailConfirmation 