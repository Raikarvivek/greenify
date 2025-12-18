import { NextRequest, NextResponse } from 'next/server'
import dbConnectSimple from '@/app/lib/mongodb-simple'
import Activity from '@/app/lib/models/Activity'
import User from '@/app/lib/models/User'
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

    const activityId = params.id

    // Find the activity
    const activity = await Activity.findById(activityId).populate('userId', 'name email points totalPointsEarned level activitiesCompleted')
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
    activity.status = 'approved'
    activity.verifiedBy = currentUser.userId
    activity.verifiedAt = new Date()
    await activity.save()

    // Award points to user
    const user = await User.findById(activity.userId)
    if (user) {
      user.points += activity.pointsEarned
      user.totalPointsEarned += activity.pointsEarned
      user.activitiesCompleted += 1
      
      // Calculate new level
      user.level = Math.floor(user.totalPointsEarned / 100) + 1
      
      await user.save()
    }

    return NextResponse.json({
      message: 'Activity approved successfully',
      activity: {
        id: activity._id.toString(),
        status: activity.status,
        pointsEarned: activity.pointsEarned,
        verifiedAt: activity.verifiedAt,
      },
      pointsAwarded: activity.pointsEarned,
      userStats: {
        totalPoints: user?.points,
        level: user?.level,
        activitiesCompleted: user?.activitiesCompleted,
      }
    })

  } catch (error) {
    console.error('Approve activity error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
