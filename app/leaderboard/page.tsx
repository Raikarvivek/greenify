'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/AuthProvider'
import { Leaf, ArrowLeft, Trophy, Medal, Award, Crown, Star, TrendingUp } from 'lucide-react'
import ThemeToggle from '@/app/components/ThemeToggle'

interface LeaderboardUser {
  id: string
  name: string
  totalPointsEarned: number
  level: number
  activitiesCompleted: number
  carbonSaved: number
  treesPlanted: number
  streak: number
  rank: number
  badges: string[]
}

export default function LeaderboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      fetchLeaderboard()
    }
  }, [user, loading, router])

  const fetchLeaderboard = async () => {
    try {
      setLoadingLeaderboard(true)
      const response = await fetch('/api/leaderboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data.leaderboard || [])
        setUserRank(data.userRank)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoadingLeaderboard(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
      default:
        return 'bg-gray-100 text-gray-700'
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
              <Leaf className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">Greenify</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {userRank && (
                <div className="flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full">
                  <TrendingUp className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Your Rank: #{userRank}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
              <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
              Eco Leaderboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">See how you rank among fellow eco-warriors</p>
          </div>

          {/* Leaderboard Table */}
          {loadingLeaderboard ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Table Header */}
                  <thead className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Total Points
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Activities
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                        CO₂ Saved
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Streak
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Badges
                      </th>
                    </tr>
                  </thead>
                  
                  {/* Table Body */}
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {leaderboard.map((leaderUser, index) => (
                      <tr
                        key={leaderUser.id}
                        className={`transition-all duration-200 hover:bg-gray-50 ${
                          leaderUser.id === user.id 
                            ? 'bg-gradient-to-r from-primary-50 to-primary-100 border-l-4 border-primary-500' 
                            : ''
                        }`}
                      >
                        {/* Rank Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankBadge(leaderUser.rank)}`}>
                              {leaderUser.rank <= 3 ? (
                                getRankIcon(leaderUser.rank)
                              ) : (
                                <span className="text-sm font-bold">#{leaderUser.rank}</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* User Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                                {leaderUser.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 flex items-center">
                                {leaderUser.name}
                                {leaderUser.id === user.id && (
                                  <span className="ml-2 px-2 py-1 text-xs bg-primary-500 text-white rounded-full">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                Eco Warrior
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Level Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <Star className="h-4 w-4 mr-1" />
                            {leaderUser.level}
                          </div>
                        </td>

                        {/* Total Points Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-lg font-bold text-primary-600">
                            {leaderUser.totalPointsEarned.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">points</div>
                        </td>

                        {/* Activities Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-lg font-bold text-green-600">
                            {leaderUser.activitiesCompleted}
                          </div>
                          <div className="text-xs text-gray-500">completed</div>
                        </td>

                        {/* CO₂ Saved Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {leaderUser.carbonSaved}
                          </div>
                          <div className="text-xs text-gray-500">kg CO₂</div>
                        </td>

                        {/* Streak Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <div className="text-lg font-bold text-orange-600">
                              {leaderUser.streak}
                            </div>
                            <div className="ml-1 text-orange-500">
                              🔥
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">days</div>
                        </td>

                        {/* Badges Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-1">
                            {leaderUser.badges.slice(0, 3).map((badge, badgeIndex) => (
                              <span
                                key={badgeIndex}
                                className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-sm"
                                title={`Badge ${badgeIndex + 1}`}
                              >
                                🏆
                              </span>
                            ))}
                            {leaderUser.badges.length > 3 && (
                              <span className="text-xs text-gray-500 font-medium">
                                +{leaderUser.badges.length - 3}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {leaderUser.badges.length} badge{leaderUser.badges.length !== 1 ? 's' : ''}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with Summary Stats */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    Showing {leaderboard.length} eco-warriors
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>🌱 Total Impact: {leaderboard.reduce((sum, user) => sum + user.carbonSaved, 0).toFixed(1)}kg CO₂ saved</span>
                    <span>🌳 {leaderboard.reduce((sum, user) => sum + user.treesPlanted, 0)} trees planted</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loadingLeaderboard && leaderboard.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leaderboard data</h3>
              <p className="text-gray-600 mb-4">Start completing activities to appear on the leaderboard!</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-primary"
              >
                Start Your Eco Journey
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
