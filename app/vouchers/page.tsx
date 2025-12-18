'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/AuthProvider'
import { Leaf, ArrowLeft, Ticket, Clock, CheckCircle, XCircle, Copy } from 'lucide-react'

interface Voucher {
  id: string
  voucherCode: string
  pointsSpent: number
  status: 'active' | 'used' | 'expired'
  redeemedAt: string
  usedAt?: string
  expiresAt: string
  rewardId: {
    title: string
    brand: string
    description: string
    discountPercentage?: number
    discountAmount?: number
    termsAndConditions: string
  }
}

export default function VouchersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [loadingVouchers, setLoadingVouchers] = useState(true)

  const statusOptions = [
    { id: 'active', name: 'Active', color: 'green' },
    { id: 'used', name: 'Used', color: 'blue' },
    { id: 'expired', name: 'Expired', color: 'red' },
    { id: 'all', name: 'All', color: 'gray' },
  ]

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      fetchVouchers()
    }
  }, [user, loading, router, selectedStatus])

  const fetchVouchers = async () => {
    try {
      setLoadingVouchers(true)
      const response = await fetch(`/api/user/vouchers?status=${selectedStatus}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        console.log('Vouchers data:', data) // Debug log
        setVouchers(data.vouchers || [])
      } else {
        console.error('Failed to fetch vouchers:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error)
    } finally {
      setLoadingVouchers(false)
    }
  }

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code)
    alert('Voucher code copied to clipboard!')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'used':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'expired':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'used':
        return 'bg-blue-100 text-blue-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
              <Leaf className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Greenify</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/rewards')}
                className="btn-primary"
              >
                Browse Rewards
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Ticket className="h-8 w-8 text-primary-600 mr-3" />
              My Vouchers
            </h1>
            <p className="mt-2 text-gray-600">Manage your redeemed vouchers and discount codes</p>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status.id}
                  onClick={() => setSelectedStatus(status.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedStatus === status.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {status.name}
                </button>
              ))}
            </div>
          </div>

          {/* Vouchers List */}
          {loadingVouchers ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {vouchers.map((voucher) => (
                <div key={voucher.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {voucher.rewardId.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(voucher.status)}`}>
                            {voucher.status.charAt(0).toUpperCase() + voucher.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{voucher.rewardId.brand}</p>
                        <p className="text-gray-700 mb-4">{voucher.rewardId.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Voucher Code</p>
                            <div className="flex items-center space-x-2">
                              <code className="bg-gray-100 px-3 py-1 rounded font-mono text-sm">
                                {voucher.voucherCode}
                              </code>
                              <button
                                onClick={() => copyVoucherCode(voucher.voucherCode)}
                                className="text-primary-600 hover:text-primary-700"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Points Spent</p>
                            <p className="font-semibold">{voucher.pointsSpent} points</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Redeemed</p>
                            <p className="font-medium">
                              {new Date(voucher.redeemedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Expires</p>
                            <p className="font-medium">
                              {new Date(voucher.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                          {voucher.usedAt && (
                            <div>
                              <p className="text-gray-600">Used</p>
                              <p className="font-medium">
                                {new Date(voucher.usedAt).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>

                        {voucher.rewardId.discountPercentage && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <p className="text-green-800 font-semibold">
                              {voucher.rewardId.discountPercentage}% Discount
                            </p>
                          </div>
                        )}

                        {voucher.rewardId.discountAmount && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <p className="text-green-800 font-semibold">
                              ₹{voucher.rewardId.discountAmount} Off
                            </p>
                          </div>
                        )}

                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">
                            <strong>Terms & Conditions:</strong> {voucher.rewardId.termsAndConditions}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4">
                        {getStatusIcon(voucher.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingVouchers && vouchers.length === 0 && (
            <div className="text-center py-12">
              <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vouchers found</h3>
              <p className="text-gray-600 mb-4">
                {selectedStatus === 'active' 
                  ? "You don't have any active vouchers yet."
                  : `No ${selectedStatus} vouchers found.`
                }
              </p>
              <button
                onClick={() => router.push('/rewards')}
                className="btn-primary"
              >
                Browse Rewards
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
