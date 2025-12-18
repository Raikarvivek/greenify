'use client'

import { useState } from 'react'
import { useAuth } from '@/app/lib/AuthProvider'

export default function TestLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  
  const { login, user } = useAuth()

  const testLogin = async () => {
    setLoading(true)
    setResult(null)
    
    console.log('Testing login with:', { email, password })
    
    try {
      const loginResult = await login(email, password)
      setResult(loginResult)
      console.log('Login test result:', loginResult)
    } catch (error) {
      console.error('Login test error:', error)
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  const testCredentials = [
    { email: 'admin@greenify.com', password: 'GreenifyAdmin2024!', role: 'admin' },
    { email: 'user@test.com', password: 'password123', role: 'user' }
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Login Test Page</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Test Credentials:</h2>
          {testCredentials.map((cred, index) => (
            <div key={index} className="mb-2 p-3 bg-gray-50 rounded">
              <strong>{cred.role.toUpperCase()}:</strong> {cred.email} / {cred.password}
              <button
                onClick={() => {
                  setEmail(cred.email)
                  setPassword(cred.password)
                }}
                className="ml-3 px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Use These
              </button>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter email"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter password"
          />
        </div>

        <button
          onClick={testLogin}
          disabled={loading || !email || !password}
          className="w-full bg-green-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
        >
          {loading ? 'Testing Login...' : 'Test Login'}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Login Result:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {user && (
          <div className="mt-6 p-4 bg-green-50 rounded">
            <h3 className="font-semibold mb-2">Current User (from AuthProvider):</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Note:</strong> Check the browser console for detailed logs.</p>
          <p>This page helps debug the authentication flow.</p>
        </div>
      </div>
    </div>
  )
}
