import { NextRequest, NextResponse } from 'next/server'
import dbConnectSimple from '@/app/lib/mongodb-simple'
import Activity from '@/app/lib/models/Activity'
import { verifyAccessToken } from '@/app/lib/jwt'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json()
    const { reason } = body

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      )
    }

    const activityId = params.id

    // Find the activity
    const activity = await Activity.findById(activityId)
    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      )
    }

    if (activity.status !== 'pending') {
      return NextResponse.json(
        { error: 'Activity has already been processed' },
        { status: 400 }
      )
    }

    // Update activity status
    activity.status = 'rejected'
    activity.verifiedBy = currentUser.userId
    activity.verifiedAt = new Date()
    activity.rejectionReason = reason.trim()
    await activity.save()

    return NextResponse.json({
      message: 'Activity rejected successfully',
      activity: {
        id: activity._id.toString(),
        status: activity.status,
        rejectionReason: activity.rejectionReason,
        verifiedAt: activity.verifiedAt,
      }
    })

  } catch (error) {
    console.error('Reject activity error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
