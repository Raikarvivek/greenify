'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/AuthProvider'
import { 
  Leaf, ArrowLeft, Award, Lock, CheckCircle, Crown, Star, Trophy, 
  Target, Zap, Shield, Medal, Sparkles, TrendingUp, Users, Heart,
  Recycle, TreePine, Droplets, Gift, Calendar, Activity
} from 'lucide-react'
import ThemeToggle from '@/app/components/ThemeToggle'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  requirement: string
}

export default function BadgesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userBadges, setUserBadges] = useState<Badge[]>([])
  const [allBadges, setAllBadges] = useState<Record<string, Badge>>({})
  const [earnedCount, setEarnedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [loadingBadges, setLoadingBadges] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      fetchBadges()
    }
  }, [user, loading, router])

  const fetchBadges = async () => {
    try {
      setLoadingBadges(true)
      const response = await fetch('/api/badges', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUserBadges(data.userBadges || [])
        setAllBadges(data.allBadges || {})
        setEarnedCount(data.earnedCount || 0)
        setTotalCount(data.totalCount || 0)
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoadingBadges(false)
    }
  }

  const isBadgeEarned = (badgeId: string) => {
    return userBadges.some(badge => badge.id === badgeId)
  }

  const getBadgeColorClass = (color: string, earned: boolean) => {
    if (!earned) return 'bg-gray-100 text-gray-400 border-gray-200'
    
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'orange':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      {/* Modern Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="group flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Dashboard</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-green-400 rounded-full blur opacity-75 animate-pulse"></div>
                  <Leaf className="relative h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                    Greenify
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Achievements</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-75"></div>
                <div className="relative flex items-center space-x-3 bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-3 rounded-2xl text-white shadow-xl">
                  <Trophy className="h-6 w-6" />
                  <div>
                    <div className="text-lg font-bold">{earnedCount}/{totalCount}</div>
                    <div className="text-xs opacity-90">Badges</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Hero Header */}
          <div className="relative mb-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-3xl"></div>
            <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur opacity-75 animate-pulse"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Achievement Center
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                      Unlock badges and showcase your eco-achievements! 🏆
                    </p>
                  </div>
                </div>
                
                {/* Achievement Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <Medal className="h-8 w-8 text-yellow-500" />
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{earnedCount}</div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</div>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <Target className="h-8 w-8 text-blue-500" />
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalCount - earnedCount}</div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">To Unlock</div>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <TrendingUp className="h-8 w-8 text-green-500" />
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0}%
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Completion</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="max-w-2xl mx-auto">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="font-medium">Achievement Progress</span>
                    <span className="font-bold">{earnedCount}/{totalCount} Badges</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-500">
                    <span>Beginner</span>
                    <span>Expert</span>
                    <span>Master</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges Grid */}
          {loadingBadges ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(allBadges).map((badge) => {
                const earned = isBadgeEarned(badge.id)
                return (
                  <div
                    key={badge.id}
                    className={`relative bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border-2 ${
                      earned ? 'border-primary-200' : 'border-gray-200'
                    }`}
                  >
                    {/* Earned Badge Indicator */}
                    {earned && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                    )}

                    <div className="p-6 text-center">
                      {/* Badge Icon */}
                      <div
                        className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl border-4 mb-4 ${getBadgeColorClass(
                          badge.color,
                          earned
                        )}`}
                      >
                        {earned ? badge.icon : <Lock className="h-8 w-8" />}
                      </div>

                      {/* Badge Info */}
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          earned ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {badge.name}
                      </h3>
                      <p
                        className={`text-sm mb-3 ${
                          earned ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        {badge.description}
                      </p>
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          earned
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {badge.requirement}
                      </div>

                      {earned && (
                        <div className="mt-3">
                          <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                            ✓ Earned
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {!loadingBadges && Object.keys(allBadges).length === 0 && (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No badges available</h3>
              <p className="text-gray-600 mb-4">Check back later for new achievements!</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-primary"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
