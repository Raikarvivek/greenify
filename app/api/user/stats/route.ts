import { NextRequest, NextResponse } from 'next/server'
import dbConnectSimple from '@/app/lib/mongodb-simple'
import Activity from '@/app/lib/models/Activity'
import User from '@/app/lib/models/User'
import { requireAuth } from '@/app/lib/jwt'
import mongoose from 'mongoose'

export async function GET(request: NextRequest) {
  try {
    await dbConnectSimple()
    
    const currentUser = requireAuth(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Convert userId string to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(currentUser.userId)

    // Get user data
    const user = await User.findById(userObjectId).lean()
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get activity statistics
    const [
      totalActivities,
      approvedActivities,
      pendingActivities,
      rejectedActivities,
      totalCarbonSaved,
      recentActivities
    ] = await Promise.all([
      Activity.countDocuments({ userId: userObjectId }),
      Activity.countDocuments({ userId: userObjectId, status: 'approved' }),
      Activity.countDocuments({ userId: userObjectId, status: 'pending' }),
      Activity.countDocuments({ userId: userObjectId, status: 'rejected' }),
      Activity.aggregate([
        { $match: { userId: userObjectId, status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$carbonSaved' } } }
      ]),
      Activity.find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('type title status pointsEarned carbonSaved createdAt')
        .lean()
    ])

    // Calculate activity type breakdown
    const activityBreakdown = await Activity.aggregate([
      { $match: { userId: userObjectId, status: 'approved' } },
      { 
        $group: { 
          _id: '$type', 
          count: { $sum: 1 },
          points: { $sum: '$pointsEarned' },
          carbon: { $sum: '$carbonSaved' }
        } 
      }
    ])

    // Calculate monthly progress (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyProgress = await Activity.aggregate([
      { 
        $match: { 
          userId: userObjectId, 
          status: 'approved',
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          activities: { $sum: 1 },
          points: { $sum: '$pointsEarned' },
          carbon: { $sum: '$carbonSaved' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    return NextResponse.json({
      user: {
        id: (user as any)._id.toString(),
        name: (user as any).name,
        email: (user as any).email,
        points: (user as any).points || 0,
        totalPointsEarned: (user as any).totalPointsEarned || 0,
        level: (user as any).level || 1,
        activitiesCompleted: (user as any).activitiesCompleted || 0,
        joinedAt: (user as any).createdAt
      },
      stats: {
        totalActivities,
        approvedActivities,
        pendingActivities,
        rejectedActivities,
        totalCarbonSaved: totalCarbonSaved[0]?.total || 0,
        currentStreak: calculateStreak(recentActivities),
        completionRate: totalActivities > 0 ? Math.round((approvedActivities / totalActivities) * 100) : 0
      },
      activityBreakdown,
      monthlyProgress,
      recentActivities: recentActivities.map((activity: any) => ({
        id: activity._id.toString(),
        type: activity.type,
        title: activity.title,
        status: activity.status,
        pointsEarned: activity.pointsEarned || 0,
        carbonSaved: activity.carbonSaved || 0,
        createdAt: activity.createdAt
      }))
    })

  } catch (error) {
    console.error('Get user stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to calculate activity streak
function calculateStreak(activities: any[]): number {
  if (activities.length === 0) return 0
  
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < activities.length; i++) {
    const activityDate = new Date(activities[i].createdAt)
    activityDate.setHours(0, 0, 0, 0)
    
    const daysDiff = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === streak) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}
