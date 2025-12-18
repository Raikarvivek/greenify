'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/AuthProvider'
import { 
  Leaf, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Shield, 
  TrendingUp,
  UserCheck,
  AlertTriangle,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MapPin,
  Image,
  FileText,
  Calendar,
  Award,
  Target,
  Gift,
  Crown,
  Zap,
  Globe,
  Heart,
  Star,
  Trash2,
  Edit,
  Plus,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  TrendingDown,
  Database,
  Server
} from 'lucide-react'
import ThemeToggle from '@/app/components/ThemeToggle'

export default function AdminDashboardPage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    newRegistrations: 45,
    totalRecycled: 15420,
    carbonSaved: 234.5,
    pendingActivities: 23,
    approvedToday: 15,
    rejectedToday: 3,
    totalPointsAwarded: 45670,
    totalRewards: 21,
    activeRewards: 18,
    rewardsRedeemed: 156,
    totalRevenue: 89450,
    avgSessionTime: '12m 34s',
    bounceRate: '23.4%',
    conversionRate: '8.7%',
    systemHealth: 'Excellent'
  })
  const [pendingActivities, setPendingActivities] = useState<any[]>([])
  const [recentVerifications, setRecentVerifications] = useState<any[]>([])
  const [userAnalytics, setUserAnalytics] = useState<any>({
    topUsers: [],
    activityTrends: [],
    locationStats: []
  })

  useEffect(() => {
    // Wait a bit longer before redirecting to allow user state to be set
    if (!loading && (!user || user.role !== 'admin')) {
      const timer = setTimeout(() => {
        if (!user || user.role !== 'admin') {
          console.log('Admin Dashboard: No admin user found, redirecting to admin login')
          router.push('/admin')
        }
      }, 500)
      return () => clearTimeout(timer)
    } else if (user && user.role === 'admin') {
      console.log('Admin Dashboard: Admin user found:', user.name)
      fetchDashboardData()
    }
  }, [user, loading, router])

  const fetchDashboardData = async () => {
    try {
      // Fetch pending activities
      const activitiesResponse = await fetch('/api/admin/activities?status=pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      if (activitiesResponse.ok) {
        const data = await activitiesResponse.json()
        setPendingActivities(data.activities.slice(0, 5)) // Show only first 5
      }

      // Mock recent verifications data
      setRecentVerifications([
        {
          id: '1',
          activityTitle: 'Recycled plastic bottles',
          userName: 'John Eco',
          action: 'approved',
          pointsAwarded: 50,
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          activityTitle: 'LED bulb replacement',
          userName: 'Sarah Green',
          action: 'rejected',
          reason: 'Insufficient proof',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          activityTitle: 'Tree planting',
          userName: 'Mike Chen',
          action: 'approved',
          pointsAwarded: 100,
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        }
      ])

      // Mock user analytics
      setUserAnalytics({
        topUsers: [
          { name: 'John Eco', points: 1250, activities: 25 },
          { name: 'Sarah Green', points: 980, activities: 19 },
          { name: 'Mike Chen', points: 875, activities: 17 }
        ],
        activityTrends: [
          { type: 'recycling', count: 145, growth: '+12%' },
          { type: 'energy_saving', count: 89, growth: '+8%' },
          { type: 'tree_planting', count: 67, growth: '+25%' }
        ],
        locationStats: [
          { city: 'New Delhi', activities: 89 },
          { city: 'Mumbai', activities: 76 },
          { city: 'Bangalore', activities: 54 }
        ]
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      {/* Modern Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-2xl border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-green-400 rounded-full blur opacity-75 animate-pulse"></div>
                  <Leaf className="relative h-10 w-10 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                    Greenify
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Admin Portal</div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-2 bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-full">
                <Shield className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">Administrator</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/activities')}
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Activity Verification</span>
                </span>
              </button>
              
              <ThemeToggle />
              
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Administrator</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="group flex items-center space-x-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Modern Welcome Section */}
          <div className="relative mb-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl"></div>
            <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="flex-1 mb-6 lg:mb-0">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-75 animate-pulse"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Admin Control Center
                      </h1>
                      <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                        Monitor, manage, and optimize the Greenify platform 🛡️
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Real-time Monitoring</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Activity Verification</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">Analytics Dashboard</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-75"></div>
                    <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white text-center min-w-[200px]">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="h-8 w-8 text-white mr-2" />
                        <span className="text-3xl font-bold">{stats.totalUsers}</span>
                      </div>
                      <p className="text-sm opacity-90">Total Users</p>
                      <div className="mt-3 text-xs opacity-75">
                        {stats.activeUsers} Active Today
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Verification Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingActivities}</div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Urgent</div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Pending Verification</h3>
                <p className="text-xs text-gray-500 dark:text-gray-500">Requires immediate attention ⚡</p>
              </div>
            </div>

            <div className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.approvedToday}</div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">Today</div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Approved Activities</h3>
                <p className="text-xs text-gray-500 dark:text-gray-500">Great progress! 🎉</p>
              </div>
            </div>

            <div className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-pink-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <XCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.rejectedToday}</div>
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">Today</div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Rejected Activities</h3>
                <p className="text-xs text-gray-500 dark:text-gray-500">Quality maintained 🛡️</p>
              </div>
            </div>

            <div className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalPointsAwarded.toLocaleString()}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total</div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Points Awarded</h3>
                <p className="text-xs text-gray-500 dark:text-gray-500">Motivating users! 🏆</p>
              </div>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeUsers.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">New This Week</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.newRegistrations}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Items Recycled</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRecycled.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Pending Activities for Quick Review */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pending Verification</h2>
                <button
                  onClick={() => router.push('/admin/activities')}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {pendingActivities.slice(0, 4).map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{activity.title || 'New Activity'}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{activity.user?.name || 'User'}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {activity.verificationMedia?.length > 0 && <Image className="h-3 w-3 text-gray-500" />}
                      {activity.location && <MapPin className="h-3 w-3 text-gray-500" />}
                    </div>
                  </div>
                ))}
                {pendingActivities.length === 0 && (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">All caught up!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Verifications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Verifications</h2>
              <div className="space-y-3">
                {recentVerifications.map((verification: any) => (
                  <div key={verification.id} className={`p-3 rounded-lg border ${
                    verification.action === 'approved' 
                      ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {verification.action === 'approved' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{verification.activityTitle}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{verification.userName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {verification.pointsAwarded && (
                          <p className="text-xs font-medium text-green-600">+{verification.pointsAwarded} pts</p>
                        )}
                        <p className="text-xs text-gray-500">{new Date(verification.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Analytics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Users</h2>
              <div className="space-y-3">
                {userAnalytics.topUsers.map((user: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{user.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{user.activities} activities</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">{user.points}</p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Activity Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Activity Trends</h2>
              <div className="space-y-4">
                {userAnalytics.activityTrends.map((trend: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        trend.type === 'recycling' ? 'bg-green-500' :
                        trend.type === 'energy_saving' ? 'bg-blue-500' : 'bg-primary-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {trend.type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{trend.count} activities</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      trend.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trend.growth}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Analytics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Locations</h2>
              <div className="space-y-4">
                {userAnalytics.locationStats.map((location: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{location.city}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{location.activities} activities</p>
                      </div>
                    </div>
                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(location.activities / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Environmental Impact Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Platform Environmental Impact</h2>
            <div className="bg-gradient-to-r from-green-50 to-primary-50 dark:from-green-900/30 dark:to-primary-900/30 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="text-2xl font-bold text-primary-600">{stats.carbonSaved} tons</h3>
                  <p className="text-gray-600 dark:text-gray-300">CO₂ Saved This Month</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-600">{stats.totalRecycled.toLocaleString()}</h3>
                  <p className="text-gray-600 dark:text-gray-300">Items Recycled</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-600">89%</h3>
                  <p className="text-gray-600 dark:text-gray-300">User Engagement Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Admin Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => router.push('/admin/activities')}
                className="p-4 bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 rounded-lg transition-colors duration-200 border border-yellow-200 dark:border-yellow-800"
              >
                <CheckCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Verify Activities</p>
                <p className="text-xs text-yellow-600">{stats.pendingActivities} pending</p>
              </button>
              <button className="p-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-200 border border-blue-200 dark:border-blue-800">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Manage Users</p>
                <p className="text-xs text-blue-600">{stats.totalUsers} total</p>
              </button>
              <button className="p-4 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors duration-200 border border-green-200 dark:border-green-800">
                <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Analytics</p>
                <p className="text-xs text-green-600">Detailed reports</p>
              </button>
              <button className="p-4 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors duration-200 border border-purple-200 dark:border-purple-800">
                <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Settings</p>
                <p className="text-xs text-purple-600">System config</p>
              </button>
            </div>
          </div>

          {/* Rewards Management Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rewards Management</h2>
              <div className="flex space-x-3">
                <button className="btn-secondary flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Reward</span>
                </button>
                <button className="btn-primary flex items-center space-x-2">
                  <Gift className="h-4 w-4" />
                  <span>Manage Rewards</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center">
                  <Gift className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Rewards</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRewards}</p>
                    <p className="text-xs text-purple-600">{stats.activeRewards} active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Management Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
              <div className="flex space-x-3">
                <button className="btn-secondary flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter Users</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export Data</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Stats */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Analytics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeUsers}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <UserCheck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.newRegistrations}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">New This Week</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgSessionTime}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Session</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900 dark:text-white">View All Users</span>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center space-x-3">
                    <Plus className="h-5 w-5 text-green-600" />
                    <span className="text-gray-900 dark:text-white">Add New User</span>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center space-x-3">
                    <Edit className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-900 dark:text-white">Bulk Edit</span>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center space-x-3">
                    <Trash2 className="h-5 w-5 text-red-600" />
                    <span className="text-gray-900 dark:text-white">Manage Inactive</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* System Health & Analytics */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Health & Analytics</h2>
              <button className="btn-secondary flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh Data</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">System Status</h3>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.systemHealth}</p>
                    <p className="text-xs text-green-600">All systems operational</p>
                  </div>
                  <Server className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Database</h3>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">98.7%</p>
                    <p className="text-xs text-blue-600">Query performance</p>
                  </div>
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Bounce Rate</h3>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.bounceRate}</p>
                    <p className="text-xs text-purple-600">Below average</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Alerts</h3>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">2</p>
                    <p className="text-xs text-red-600">Requires attention</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Platform Activity</h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">New user registered: john.doe@email.com</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">Activity verified: Tree planting in Mumbai</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">Reward redeemed: Swiggy 20% Off voucher</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">8 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">Badge earned: Week Warrior by sarah.green</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">12 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
