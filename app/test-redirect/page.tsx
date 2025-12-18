'use client'

import { useAuth } from '@/app/lib/AuthProvider'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function TestRedirectPage() {
  const { user, login, loading } = useAuth()
  const router = useRouter()
  const [testResult, setTestResult] = useState('')

  const testAdminLogin = async () => {
    setTestResult('Testing admin login...')
    try {
      const result = await login('admin@greenify.com', 'GreenifyAdmin2024!')
      console.log('Test: Admin login result:', result)
      
      if (result.success && result.user) {
        setTestResult(`Admin login successful! User: ${result.user.name}, Role: ${result.user.role}`)
        
        // Test redirect
        setTimeout(() => {
          setTestResult(prev => prev + '\nRedirecting to admin dashboard...')
          router.push('/admin/dashboard')
        }, 1000)
      } else {
        setTestResult('Admin login failed!')
      }
    } catch (error) {
      setTestResult('Admin login error: ' + error.message)
    }
  }

  const testUserLogin = async () => {
    setTestResult('Testing user login...')
    try {
      const result = await login('user@test.com', 'password123')
      console.log('Test: User login result:', result)
      
      if (result.success && result.user) {
        setTestResult(`User login successful! User: ${result.user.name}, Role: ${result.user.role}`)
        
        // Test redirect
        setTimeout(() => {
          setTestResult(prev => prev + '\nRedirecting to user dashboard...')
          router.push('/dashboard')
        }, 1000)
      } else {
        setTestResult('User login failed!')
      }
    } catch (error) {
      setTestResult('User login error: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Login & Redirect Test</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Current User State:</h2>
          <div className="p-4 bg-gray-50 rounded">
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? `${user.name} (${user.role})` : 'None'}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <button
            onClick={testAdminLogin}
            className="w-full bg-red-600 text-white py-2 px-4 rounded"
          >
            Test Admin Login & Redirect
          </button>
          
          <button
            onClick={testUserLogin}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded"
          >
            Test User Login & Redirect
          </button>
        </div>

        {testResult && (
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Test Result:</h3>
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open browser developer tools (F12)</li>
            <li>Go to Console tab</li>
            <li>Click one of the test buttons</li>
            <li>Watch the console logs and redirect behavior</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
