'use client'

import { useState } from 'react'

export default function DebugLoginPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testDirectAPI = async (email: string, password: string) => {
    setLoading(true)
    setResult(null)
    
    console.log('Testing direct API call...')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const data = await response.json()
        console.log('Success response:', data)
        setResult({ success: true, data })
      } else {
        const errorData = await response.json()
        console.log('Error response:', errorData)
        setResult({ success: false, error: errorData, status: response.status })
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setResult({ success: false, error: error.message, type: 'fetch_error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Direct API Login Test</h1>
        
        <div className="space-y-4">
          <button
            onClick={() => testDirectAPI('admin@greenify.com', 'GreenifyAdmin2024!')}
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test Admin Login'}
          </button>
          
          <button
            onClick={() => testDirectAPI('user@test.com', 'password123')}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test User Login'}
          </button>
          
          <button
            onClick={() => testDirectAPI('wrong@email.com', 'wrongpassword')}
            disabled={loading}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test Invalid Credentials'}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">API Test Result:</h3>
            <pre className="text-sm overflow-auto whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open browser developer tools (F12)</li>
            <li>Go to Console tab</li>
            <li>Click one of the test buttons above</li>
            <li>Watch both the console logs and the result below</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
