'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/lib/AuthProvider'
import { 
  Leaf, User, Mail, Lock, AlertCircle, Sparkles, ArrowRight, Eye, EyeOff,
  CheckCircle, Shield, Users, Globe, Heart, Award
} from 'lucide-react'
import ThemeToggle from '@/app/components/ThemeToggle'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { register } = useAuth()
  const router = useRouter()

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

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const success = await register(formData.name, formData.email, formData.password)
      if (success) {
        router.push('/dashboard')
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch (error: any) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Join the Movement!</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Start your eco-journey with 50,000+ green warriors
                </p>
              </div>
            </div>

            {/* Modern Registration Form */}
            <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="block w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-gray-700/60 backdrop-blur-lg border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg transition-all duration-300"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

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
                        required
                        className="block w-full pl-12 pr-12 py-4 bg-white/60 dark:bg-gray-700/60 backdrop-blur-lg border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg transition-all duration-300"
                        placeholder="Create a strong password"
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

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="block w-full pl-12 pr-12 py-4 bg-white/60 dark:bg-gray-700/60 backdrop-blur-lg border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg transition-all duration-300"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>

                <div className="mt-8">
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
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account <ArrowRight className="ml-3 h-5 w-5" />
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                    Sign in here
                  </Link>
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-500">
                  <Link href="/" className="hover:text-primary-600 transition-colors">← Back to Home</Link>
                  <span>•</span>
                  <Link href="/login" className="hover:text-primary-600 transition-colors">Sign In</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Benefits */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 via-green-500 to-emerald-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col justify-center px-12 py-16 text-white">
            <div className="mb-12">
              <h3 className="text-4xl font-bold mb-6">Join the Green Revolution</h3>
              <p className="text-xl opacity-90 leading-relaxed">
                Connect with eco-warriors worldwide and make a real impact on our planet's future.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Global Community</h4>
                  <p className="opacity-90">Join 50,000+ eco-conscious individuals making a difference</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Earn Rewards</h4>
                  <p className="opacity-90">Get points and badges for every sustainable action you take</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Real Impact</h4>
                  <p className="opacity-90">Track your carbon footprint reduction and environmental impact</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Secure & Private</h4>
                  <p className="opacity-90">Your data is protected with enterprise-grade security</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">2.5M+ Tons</div>
                <div className="text-sm opacity-75">CO₂ Saved by Our Community</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  )
}
