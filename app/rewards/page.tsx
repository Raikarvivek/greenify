'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/AuthProvider'
import { 
  Leaf, Star, Gift, ArrowLeft, ShoppingCart, Clock, Check, Crown, 
  Zap, Trophy, Target, Sparkles, ChevronRight, Heart, Users,
  TrendingUp, Award, Ticket, Coffee, Smartphone, Plane, Shirt
} from 'lucide-react'
import ThemeToggle from '@/app/components/ThemeToggle'
import { useToast } from '@/app/hooks/useToast'
import { ToastContainer } from '@/app/components/Toast'

interface Reward {
  _id: string
  title: string
  description: string
  brand: string
  discountPercentage?: number
  discountAmount?: number
  pointsCost: number
  category: string
  imageUrl: string
  termsAndConditions: string
  validUntil: string
  maxRedemptions: number
  currentRedemptions: number
}

export default function RewardsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toasts, success, error, removeToast } = useToast()
  const [rewards, setRewards] = useState<Reward[]>([])
  const [userPoints, setUserPoints] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loadingRewards, setLoadingRewards] = useState(true)
  const [redeeming, setRedeeming] = useState<string | null>(null)

  const categories = [
    { id: 'all', name: 'All Categories', icon: Gift, color: 'gray' },
    { id: 'food', name: 'Food & Dining', icon: Coffee, color: 'orange' },
    { id: 'fashion', name: 'Fashion', icon: Shirt, color: 'pink' },
    { id: 'electronics', name: 'Electronics', icon: Smartphone, color: 'blue' },
    { id: 'travel', name: 'Travel', icon: Plane, color: 'purple' },
    { id: 'health', name: 'Health & Beauty', icon: Heart, color: 'red' },
    { id: 'entertainment', name: 'Entertainment', icon: Ticket, color: 'green' },
  ]

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      fetchUserPoints()
      fetchRewards()
    }
  }, [user, loading, router, selectedCategory])

  const fetchUserPoints = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      if (response.ok) {
        const userData = await response.json()
        setUserPoints(userData.points || 0)
      }
    } catch (error) {
      console.error('Error fetching user points:', error)
    }
  }

  const fetchRewards = async () => {
    try {
      setLoadingRewards(true)
      const response = await fetch(`/api/rewards?category=${selectedCategory}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setRewards(data.rewards || [])
      } else {
        console.error('Failed to fetch rewards:', response.status)
      }
    } catch (error) {
      console.error('Error fetching rewards:', error)
    } finally {
      setLoadingRewards(false)
    }
  }

  const redeemReward = async (rewardId: string) => {
    try {
      setRedeeming(rewardId)
      const response = await fetch('/api/rewards/redeem', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rewardId }),
      })

      if (response.ok) {
        const result = await response.json()
        success(
          'Reward Redeemed Successfully! 🎉',
          `Your voucher code: ${result.voucher.voucherCode}`
        )
        setUserPoints(result.userPoints)
        fetchRewards() // Refresh rewards to update redemption counts
      } else {
        const errorData = await response.json()
        error('Redemption Failed', errorData.error || 'Failed to redeem reward')
      }
    } catch (err) {
      console.error('Error redeeming reward:', err)
      error('Redemption Failed', 'Something went wrong. Please try again.')
    } finally {
      setRedeeming(null)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
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
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rewards</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-75"></div>
                <div className="relative flex items-center space-x-3 bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-3 rounded-2xl text-white shadow-xl">
                  <Crown className="h-6 w-6" />
                  <div>
                    <div className="text-lg font-bold">{userPoints}</div>
                    <div className="text-xs opacity-90">Eco Points</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Hero Header */}
          <div className="relative mb-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-green-600/10 rounded-3xl"></div>
            <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="flex-1 mb-6 lg:mb-0">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur opacity-75 animate-pulse"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                        <Gift className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Rewards Marketplace
                      </h1>
                      <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                        Turn your eco-impact into amazing rewards! 🎁
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
                      <Trophy className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">Premium Brands</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Instant Redemption</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Best Value</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20">
                      <div className="text-2xl font-bold text-primary-600">50+</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Brands</div>
                    </div>
                    <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20">
                      <div className="text-2xl font-bold text-green-600">200+</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Rewards</div>
                    </div>
                    <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20">
                      <div className="text-2xl font-bold text-orange-600">24/7</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Available</div>
                    </div>
                    <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20">
                      <div className="text-2xl font-bold text-purple-600">90%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Savings</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Category Filter */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Browse by Category</h2>
              <p className="text-gray-600 dark:text-gray-300">Find the perfect rewards for your lifestyle</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon
                const isSelected = selectedCategory === category.id
                const colorClasses = {
                  gray: isSelected ? 'from-gray-500 to-gray-600' : 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
                  orange: isSelected ? 'from-orange-500 to-red-500' : 'from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30',
                  pink: isSelected ? 'from-pink-500 to-purple-500' : 'from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30',
                  blue: isSelected ? 'from-blue-500 to-cyan-500' : 'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30',
                  purple: isSelected ? 'from-purple-500 to-indigo-500' : 'from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30',
                  red: isSelected ? 'from-red-500 to-pink-500' : 'from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30',
                  green: isSelected ? 'from-green-500 to-emerald-500' : 'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30',
                }
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`group relative p-6 bg-gradient-to-br ${colorClasses[category.color as keyof typeof colorClasses]} rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                      isSelected ? 'shadow-2xl scale-105' : 'shadow-lg hover:shadow-2xl'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-white/20' : 'bg-white/60 dark:bg-gray-800/60'
                      }`}>
                        <IconComponent className={`h-6 w-6 ${
                          isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                        }`} />
                      </div>
                      <div className={`text-sm font-semibold ${
                        isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {category.name}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Rewards Grid */}
          {loadingRewards ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div key={reward._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={reward.imageUrl}
                    alt={reward.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {reward.brand}
                      </span>
                      <span className="text-sm text-gray-500 capitalize">
                        {reward.category.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{reward.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-lg font-bold text-gray-900">{reward.pointsCost} Points</span>
                      </div>
                      <div className="text-right">
                        {reward.discountPercentage && (
                          <span className="text-green-600 font-semibold">{reward.discountPercentage}% OFF</span>
                        )}
                        {reward.discountAmount && (
                          <span className="text-green-600 font-semibold">₹{reward.discountAmount} OFF</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Valid until {new Date(reward.validUntil).toLocaleDateString()}</span>
                      </div>
                      <span>{reward.maxRedemptions - reward.currentRedemptions} left</span>
                    </div>

                    <button
                      onClick={() => redeemReward(reward._id)}
                      disabled={userPoints < reward.pointsCost || redeeming === reward._id || reward.currentRedemptions >= reward.maxRedemptions}
                      className={`w-full py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center ${
                        userPoints >= reward.pointsCost && reward.currentRedemptions < reward.maxRedemptions
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {redeeming === reward._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : userPoints < reward.pointsCost ? (
                        `Need ${reward.pointsCost - userPoints} more points`
                      ) : reward.currentRedemptions >= reward.maxRedemptions ? (
                        'Sold Out'
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Redeem Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingRewards && rewards.length === 0 && (
            <div className="text-center py-12">
              <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rewards available</h3>
              <p className="text-gray-600">Check back later for new rewards in this category.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}
