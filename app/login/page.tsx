'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/lib/AuthProvider'
import { Leaf, Mail, Lock, AlertCircle, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react'
import ThemeToggle from '@/app/components/ThemeToggle'
import { useToast } from '@/app/hooks/useToast'
import { ToastContainer } from '@/app/components/Toast'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { toasts, success, error: showError, removeToast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success && result.user) {
        // Show success toast and redirect
        success('Login Successful! 🎉', `Welcome back, ${result.user?.name}!`)
        setTimeout(() => {
          if (result.user?.role === 'admin') {
            router.push('/admin/dashboard')
          } else {
            router.push('/dashboard')
          }
        }, 1000)
      } else {
        setError('Invalid email or password')
        showError('Login Failed', 'Invalid email or password')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred. Please try again.')
      showError('Login Error', 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full space-y-8 relative">
        {/* Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-primary-400/20 to-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
        
        {/* Header */}
        <div className="text-center relative">
          <Link href="/" className="inline-flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-green-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <Leaf className="relative h-12 w-12 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="ml-3 text-3xl font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
              Greenify
            </span>
          </Link>
          
          <div className="mt-8">
            <div className="inline-flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg px-4 py-2 rounded-full mb-4 shadow-lg border border-white/20 dark:border-gray-700/50">
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Welcome Back!</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Continue your eco-journey and make an impact
            </p>
          </div>
        </div>

        {/* Modern Login Form */}
        <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center mb-6">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
            </div>
          )}
          

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-gray-700/60 backdrop-blur-lg border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg transition-all duration-300"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="block w-full pl-12 pr-12 py-4 bg-white/60 dark:bg-gray-700/60 backdrop-blur-lg border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg transition-all duration-300"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-4 px-6 bg-gradient-to-r from-primary-500 to-green-500 hover:from-primary-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-2xl hover:shadow-3xl disabled:shadow-lg font-semibold text-lg disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-opacity"></div>
                <span className="relative flex items-center">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In <ArrowRight className="ml-3 h-5 w-5" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                Create one here
              </Link>
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-500">
              <Link href="/" className="hover:text-primary-600 transition-colors">← Back to Home</Link>
              <span>•</span>
              <Link href="/admin" className="hover:text-red-600 transition-colors">Admin Login</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}
