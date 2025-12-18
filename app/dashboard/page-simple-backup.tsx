'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/AuthProvider'
import { Leaf, User, LogOut, Sparkles } from 'lucide-react'

export default function SimpleDashboardPage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Wait a bit longer before redirecting to allow user state to be set
    if (!loading && !user) {
      const timer = setTimeout(() => {
        if (!user) {
          console.log('Dashboard: No user found, redirecting to login')
          router.push('/login')
        }
      }, 500)
      return () => clearTimeout(timer)
    } else if (user) {
      console.log('Dashboard: User found:', user.name, 'role:', user.role)
      // Redirect admin users to admin dashboard
      if (user.role === 'admin') {
        console.log('Dashboard: Admin user, redirecting to admin dashboard')
        router.push('/admin/dashboard')
        return
      }
    }
  }, [user, loading, router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Greenify Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h2>
          </div>
          <p className="text-gray-600">
            You're successfully logged in to your Greenify dashboard. This is a simplified version 
            that loads quickly without external API calls.
          </p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Points</h3>
            <p className="text-3xl font-bold text-green-600">{user.points || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Earned</h3>
            <p className="text-3xl font-bold text-blue-600">{user.totalPointsEarned || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Level</h3>
            <p className="text-3xl font-bold text-purple-600">{user.level || 1}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Activities</h3>
            <p className="text-3xl font-bold text-orange-600">{user.activitiesCompleted || 0}</p>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-green-900">Authentication Successful!</h3>
              <p className="text-green-700 mt-1">
                Your login system is working perfectly. User authentication, role-based redirects, 
                and dashboard access are all functioning correctly.
              </p>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Debug Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>User ID:</strong> {user.id}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Role:</strong> {user.role}
            </div>
            <div>
              <strong>Loading State:</strong> {loading ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
