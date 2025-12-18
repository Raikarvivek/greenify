'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/AuthProvider'
import { 
  Leaf, ArrowLeft, CheckCircle, XCircle, Clock, Eye, 
  User, Calendar, Image, Video, MessageSquare, MapPin 
} from 'lucide-react'
import ThemeToggle from '@/app/components/ThemeToggle'
import { useToast } from '@/app/hooks/useToast'
import { ToastContainer } from '@/app/components/Toast'

interface Activity {
  id: string
  userId: string
  title: string
  description: string
  quantity: number
  unit: string
  status: 'pending' | 'approved' | 'rejected'
  pointsEarned: number
  carbonSaved: number
  rejectionReason?: string
  verificationMedia: Array<{
    type: 'image' | 'video'
    url: string
    filename: string
  }>
  location?: {
    latitude: number
    longitude: number
    accuracy: number
    address?: string
    timestamp: number
  }
  submittedAt: string
  user: {
    id: string
    name: string
    email: string
  }
}

export default function AdminActivitiesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toasts, success, error, warning, removeToast } = useToast()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loadingActivities, setLoadingActivities] = useState(true)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [selectedStatus, setSelectedStatus] = useState('pending')
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const statusOptions = [
    { id: 'pending', name: 'Pending Review', color: 'yellow', icon: Clock },
    { id: 'approved', name: 'Approved', color: 'green', icon: CheckCircle },
    { id: 'rejected', name: 'Rejected', color: 'red', icon: XCircle },
    { id: 'all', name: 'All Activities', color: 'gray', icon: Eye },
  ]

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user && user.role !== 'admin') {
      router.push('/dashboard')
    } else if (user) {
      fetchActivities()
    }
  }, [user, loading, router, selectedStatus])

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true)
      const response = await fetch(`/api/admin/activities?status=${selectedStatus}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || [])
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoadingActivities(false)
    }
  }

  const handleApprove = async (activityId: string) => {
    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/activities/${activityId}/approve`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        success(
          'Activity Approved! ✅',
          `${data.pointsAwarded} points awarded to user.`
        )
        fetchActivities()
        setSelectedActivity(null)
      } else {
        const errorData = await response.json()
        error('Approval Failed', errorData.error || 'Failed to approve activity')
      }
    } catch (err) {
      console.error('Error approving activity:', err)
      error('Approval Failed', 'Something went wrong. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (activityId: string) => {
    if (!rejectionReason.trim()) {
      warning('Rejection Reason Required', 'Please provide a reason for rejection')
      return
    }

    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/activities/${activityId}/reject`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      })

      if (response.ok) {
        success('Activity Rejected ❌', 'Activity has been rejected successfully')
        fetchActivities()
        setSelectedActivity(null)
        setRejectionReason('')
      } else {
        const errorData = await response.json()
        error('Rejection Failed', errorData.error || 'Failed to reject activity')
      }
    } catch (err) {
      console.error('Error rejecting activity:', err)
      error('Rejection Failed', 'Something went wrong. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const config = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    }
    return config[status as keyof typeof config] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
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
              <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-gray-700 dark:text-gray-300">Welcome, {user.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity Verification</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Review and verify user-submitted eco-friendly activities
            </p>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => {
                const Icon = status.icon
                return (
                  <button
                    key={status.id}
                    onClick={() => setSelectedStatus(status.id)}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedStatus === status.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {status.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Activities List */}
          {loadingActivities ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {activity.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(activity.status)}`}>
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {activity.user.name} ({activity.user.email})
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(activity.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-4">{activity.description}</p>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <strong>Quantity:</strong> {activity.quantity} {activity.unit}
                        </div>

                        {/* Location Information */}
                        {activity.location && (
                          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Location Verified</p>
                                {activity.location.address && (
                                  <p className="text-sm text-blue-700 dark:text-blue-300">{activity.location.address}</p>
                                )}
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                  {activity.location.latitude.toFixed(6)}, {activity.location.longitude.toFixed(6)}
                                  {' • '}Accuracy: {activity.location.accuracy.toFixed(0)}m
                                  {' • '}Captured: {new Date(activity.location.timestamp).toLocaleString()}
                                </p>
                                <button
                                  onClick={() => window.open(`https://www.google.com/maps?q=${activity.location!.latitude},${activity.location!.longitude}`, '_blank')}
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                                >
                                  View on Google Maps →
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Media Preview */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Verification Media ({activity.verificationMedia.length})
                          </h4>
                          <div className="flex space-x-2">
                            {activity.verificationMedia.map((media, index) => (
                              <div key={index} className="relative">
                                {media.type === 'image' ? (
                                  <img
                                    src={media.url}
                                    alt={media.filename}
                                    className="h-20 w-20 object-cover rounded cursor-pointer"
                                    onClick={() => window.open(media.url, '_blank')}
                                  />
                                ) : (
                                  <div 
                                    className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center cursor-pointer"
                                    onClick={() => window.open(media.url, '_blank')}
                                  >
                                    <Video className="h-8 w-8 text-gray-500" />
                                  </div>
                                )}
                                <div className="absolute top-1 right-1">
                                  {media.type === 'image' ? (
                                    <Image className="h-3 w-3 text-white bg-black bg-opacity-50 rounded" />
                                  ) : (
                                    <Video className="h-3 w-3 text-white bg-black bg-opacity-50 rounded" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {activity.rejectionReason && (
                          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <MessageSquare className="h-4 w-4 text-red-500 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-red-800 dark:text-red-300">Rejection Reason:</p>
                                <p className="text-sm text-red-700 dark:text-red-300">{activity.rejectionReason}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {activity.status === 'pending' && (
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={() => handleApprove(activity.id)}
                          disabled={actionLoading}
                          className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => setSelectedActivity(activity)}
                          disabled={actionLoading}
                          className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingActivities && activities.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No activities found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedStatus === 'pending' 
                  ? "No activities are currently pending review."
                  : `No ${selectedStatus} activities found.`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reject Activity: {selectedActivity.title}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for rejection
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Please provide a clear reason for rejecting this activity..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleReject(selectedActivity.id)}
                disabled={actionLoading || !rejectionReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Reject Activity'}
              </button>
              <button
                onClick={() => {
                  setSelectedActivity(null)
                  setRejectionReason('')
                }}
                className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}
