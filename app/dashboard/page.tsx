'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/AuthProvider'
import { 
  Leaf, User, BarChart3, Settings, LogOut, Recycle, TreePine, Droplets, Gift, Star, 
  Ticket, Trophy, Award, CheckCircle, Plus, Zap, Target, TrendingUp, Calendar,
  Camera, MapPin, Clock, Sparkles, ChevronRight, Medal, Crown, Activity
} from 'lucide-react'
import ThemeToggle from '@/app/components/ThemeToggle'
import MediaUpload from '@/app/components/MediaUpload'
import LocationTracker from '@/app/components/LocationTracker'
import { api } from '@/app/lib/api'
import { useToast } from '@/app/hooks/useToast'
import { ToastContainer } from '@/app/components/Toast'

export default function DashboardPage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const { toasts, success, error, warning, removeToast } = useToast()
  const [userStats, setUserStats] = useState({
    points: 0,
    totalPointsEarned: 0,
    level: 1,
    activitiesCompleted: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [activityType, setActivityType] = useState('')
  const [mediaFiles, setMediaFiles] = useState<any[]>([])
  const [locationData, setLocationData] = useState<any>(null)

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
      fetchUserStats()
      fetchRecentActivities()
    }
  }, [user, loading, router])

  const fetchUserStats = async () => {
    try {
      console.log('Dashboard: Fetching user stats...')
      
      // Use user data from AuthProvider instead of API call
      if (user) {
        setUserStats({
          points: user.points || 0,
          totalPointsEarned: user.totalPointsEarned || 0,
          level: user.level || 1,
          activitiesCompleted: user.activitiesCompleted || 0
        })
        console.log('Dashboard: User stats set from AuthProvider')
        return
      }
      
      // Fallback to API call with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await api.get('/api/auth/me')
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const userData = await response.json()
        setUserStats({
          points: userData.points || 0,
          totalPointsEarned: userData.totalPointsEarned || 0,
          level: userData.level || 1,
          activitiesCompleted: userData.activitiesCompleted || 0
        })
        console.log('Dashboard: User stats fetched from API')
      }
    } catch (error) {
      console.error('Dashboard: Error fetching user stats:', error)
      // Set default stats so dashboard doesn't hang
      setUserStats({
        points: 0,
        totalPointsEarned: 0,
        level: 1,
        activitiesCompleted: 0
      })
    }
  }

  const fetchRecentActivities = async () => {
    try {
      console.log('Dashboard: Fetching recent activities...')
      
      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await api.get('/api/activities?limit=5')
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        setRecentActivities(data.activities || [])
        console.log('Dashboard: Recent activities fetched')
      }
    } catch (error) {
      console.error('Dashboard: Error fetching recent activities:', error)
      // Set empty activities so dashboard doesn't hang
      setRecentActivities([])
    }
  }

  const handleQuickAction = (type: string) => {
    setActivityType(type)
    setShowActivityModal(true)
  }

  const logActivity = async (activityData: any) => {
    try {
      // Convert media files to a format suitable for demo
      const verificationMedia = mediaFiles.map(mediaFile => ({
        type: mediaFile.type,
        url: mediaFile.preview, // In real app, this would be uploaded to cloud storage
        filename: mediaFile.file.name
      }))

      console.log("verificationMedia=",verificationMedia);
      

      const response = await api.post('/api/activities', {
        ...activityData,
        verificationMedia,
        location: locationData
      })

      console.log("response=",response)

      if (response.ok) {
        const data = await response.json()
        success(
          'Activity Logged Successfully! 🌱',
          data.notice || 'Your activity has been submitted for review.'
        )
        setShowActivityModal(false)
        setMediaFiles([])
        setLocationData(null)
        fetchUserStats()
        fetchRecentActivities()
      } else {
        const errorData = await response.json()
        error('Activity Submission Failed', errorData.error || 'Failed to log activity')
      }
    } catch (err) {
      console.error('Error logging activity:', err)
      error('Activity Submission Failed', 'Something went wrong. Please try again.')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-gray-700/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-green-400 rounded-full blur opacity-75 animate-pulse"></div>
                <Leaf className="relative h-10 w-10 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                  Greenify
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Eco Dashboard</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => router.push('/rewards')}
                  className="group relative px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Gift className="h-4 w-4 mr-2 inline" />
                  <span className="font-medium">Rewards</span>
                  <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                <button
                  onClick={() => router.push('/leaderboard')}
                  className="group relative px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Trophy className="h-4 w-4 mr-2 inline" />
                  <span className="font-medium">Leaderboard</span>
                </button>
                <button
                  onClick={() => router.push('/badges')}
                  className="group relative px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-full hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Award className="h-4 w-4 mr-2 inline" />
                  <span className="font-medium">Badges</span>
                </button>
              </div>
              
              <ThemeToggle />
              
              {user.role === 'admin' && (
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full hover:from-red-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <CheckCircle className="h-4 w-4 mr-2 inline" />
                  <span className="font-medium">Admin</span>
                </button>
              )}
              
              <div className="flex items-center space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-full px-4 py-2 backdrop-blur-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-green-400 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Hero Welcome Section */}
          <div className="relative mb-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-green-600/10 rounded-3xl"></div>
            <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="flex-1 mb-6 lg:mb-0">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur opacity-75 animate-pulse"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Welcome back, {user.name}!
                      </h1>
                      <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                        Ready to make a positive impact today? 🌱
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">Level {userStats.level}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{userStats.activitiesCompleted} Activities</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Growing Strong!</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-green-400 rounded-2xl blur opacity-75"></div>
                    <div className="relative bg-gradient-to-r from-primary-500 to-green-500 rounded-2xl p-6 text-white text-center min-w-[200px]">
                      <div className="flex items-center justify-center mb-2">
                        <Crown className="h-8 w-8 text-yellow-300 mr-2" />
                        <span className="text-3xl font-bold">{userStats.points}</span>
                      </div>
                      <p className="text-sm opacity-90">Eco Points</p>
                      <div className="mt-3 text-xs opacity-75">
                        Total Earned: {userStats.totalPointsEarned}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.level}</div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">+2 this month</div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Current Level</h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.points}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Available now</div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Eco Points</h3>
                <p className="text-xs text-gray-500 dark:text-gray-500">Ready to redeem!</p>
              </div>
            </div>

            <div className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.totalPointsEarned}</div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Lifetime</div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Total Earned</h3>
                <p className="text-xs text-gray-500 dark:text-gray-500">Keep growing! 🚀</p>
              </div>
            </div>

            <div className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.activitiesCompleted}</div>
                    <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">This month</div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Activities Done</h3>
                <p className="text-xs text-gray-500 dark:text-gray-500">Amazing progress! ⭐</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <Recycle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Recycled plastic bottles</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <Droplets className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Saved water by taking shorter shower</p>
                    <p className="text-sm text-gray-600">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                  <TreePine className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Planted a tree in local park</p>
                    <p className="text-sm text-gray-600">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Quick Actions */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Camera className="h-4 w-4" />
                  <span>Photo & Location Required</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => handleQuickAction('recycling')}
                  className="group relative bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 rounded-2xl p-6 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <Recycle className="h-10 w-10" />
                      <div className="text-right">
                        <div className="text-2xl font-bold">+10</div>
                        <div className="text-xs opacity-75">points</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-1">Recycling</h3>
                    <p className="text-sm opacity-90">Log your recycling activity</p>
                    <div className="flex items-center mt-3 text-xs opacity-75">
                      <Plus className="h-3 w-3 mr-1" />
                      <span>Add photos & location</span>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => handleQuickAction('water_saving')}
                  className="group relative bg-gradient-to-br from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 rounded-2xl p-6 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <Droplets className="h-10 w-10" />
                      <div className="text-right">
                        <div className="text-2xl font-bold">+15</div>
                        <div className="text-xs opacity-75">points</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-1">Water Saving</h3>
                    <p className="text-sm opacity-90">Track water conservation</p>
                    <div className="flex items-center mt-3 text-xs opacity-75">
                      <Plus className="h-3 w-3 mr-1" />
                      <span>Add photos & location</span>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => handleQuickAction('tree_planting')}
                  className="group relative bg-gradient-to-br from-primary-400 to-green-500 hover:from-primary-500 hover:to-green-600 rounded-2xl p-6 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <TreePine className="h-10 w-10" />
                      <div className="text-right">
                        <div className="text-2xl font-bold">+50</div>
                        <div className="text-xs opacity-75">points</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-1">Tree Planting</h3>
                    <p className="text-sm opacity-90">Plant trees for the future</p>
                    <div className="flex items-center mt-3 text-xs opacity-75">
                      <Plus className="h-3 w-3 mr-1" />
                      <span>Add photos & location</span>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => router.push('/rewards')}
                  className="group relative bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-2xl p-6 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <Gift className="h-10 w-10" />
                      <ChevronRight className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">Rewards Store</h3>
                    <p className="text-sm opacity-90">Redeem your eco points</p>
                    <div className="flex items-center mt-3 text-xs opacity-75">
                      <Star className="h-3 w-3 mr-1" />
                      <span>Browse rewards</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Environmental Impact Showcase */}
          <div className="mt-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
            <div className="relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-primary-400/20 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-4">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Environmental Impact</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Eco Footprint</h2>
                  <p className="text-gray-600 dark:text-gray-300">Making a real difference, one action at a time</p>
                </div>

                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-green-400 rounded-2xl blur opacity-75"></div>
                    <div className="relative bg-gradient-to-r from-primary-500 to-green-500 rounded-2xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-1">Carbon Footprint Reduced</h3>
                      <p className="text-4xl font-bold mb-1">2.3 tons CO₂</p>
                      <p className="text-sm opacity-90">This month vs. average household</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">↓ 15%</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Energy Usage</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs. last month</p>
                  </div>
                  
                  <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Droplets className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">↓ 22%</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Water Usage</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs. last month</p>
                  </div>
                  
                  <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-200 dark:border-primary-800">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Recycle className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">↑ 85%</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Recycling Rate</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs. last month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-green-400 rounded-2xl flex items-center justify-center">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Log New Activity</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Add photos and location for verification</p>
              </div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault()
              if (mediaFiles.length === 0) {
                warning('Media Required', 'Please upload at least one photo or video for verification')
                return
              }
              if (!locationData) {
                warning('Location Required', 'Please capture your location for verification')
                return
              }
              const formData = new FormData(e.target as HTMLFormElement)
              const activityData = {
                type: activityType,
                title: formData.get('title'),
                description: formData.get('description'),
                quantity: parseInt(formData.get('quantity') as string) || 1,
                unit: formData.get('unit') || 'items'
              }
              logActivity(activityData)
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Activity Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Recycled plastic bottles"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe your eco-friendly activity..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    defaultValue="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    defaultValue="items"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              {/* Media Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Media (Required)
                </label>
                <MediaUpload 
                  onFilesChange={setMediaFiles}
                  maxFiles={3}
                />
              </div>

              {/* Location Tracking */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location Verification (Required)
                </label>
                <LocationTracker 
                  onLocationUpdate={setLocationData}
                  required={true}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowActivityModal(false)
                    setMediaFiles([])
                    setLocationData(null)
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mediaFiles.length === 0 || !locationData}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}
