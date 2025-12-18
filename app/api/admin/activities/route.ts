import { NextRequest, NextResponse } from 'next/server'
import dbConnectSimple from '@/app/lib/mongodb-simple'
import Activity from '@/app/lib/models/Activity'
import User from '@/app/lib/models/User'
import { verifyAccessToken } from '@/app/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    await dbConnectSimple()
    
    // Get access token from cookies
    const accessToken = request.cookies.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token found' },
        { status: 401 }
      )
    }

    // Verify the token
    const currentUser = verifyAccessToken(accessToken)
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')

    // Build query
    const query: any = {}
    if (status !== 'all') query.status = status
    if (type) query.type = type

    // Get activities with pagination
    const skip = (page - 1) * limit
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .populate('verifiedBy', 'name email')

    const total = await Activity.countDocuments(query)
    const pages = Math.ceil(total / limit)

    // Transform activities for response
    const transformedActivities = activities.map(activity => ({
      id: activity._id.toString(),
      type: activity.type,
      title: activity.title,
      description: activity.description,
      pointsEarned: activity.pointsEarned,
      quantity: activity.quantity,
      unit: activity.unit,
      verificationMedia: activity.verificationMedia,
      location: activity.location,
      status: activity.status,
      carbonSaved: activity.carbonSaved,
      submittedAt: activity.submittedAt,
      verifiedAt: activity.verifiedAt,
      verifiedBy: activity.verifiedBy,
      rejectionReason: activity.rejectionReason,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      user: activity.userId, // Populated user data
    }))

    return NextResponse.json({
      activities: transformedActivities,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
      stats: {
        pending: await Activity.countDocuments({ status: 'pending' }),
        approved: await Activity.countDocuments({ status: 'approved' }),
        rejected: await Activity.countDocuments({ status: 'rejected' }),
      }
    })

  } catch (error) {
    console.error('Get admin activities error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
