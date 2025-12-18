import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/app/lib/mongodb'
import Activity from '@/app/lib/models/Activity'
import User from '@/app/lib/models/User'
import Reward from '@/app/lib/models/Reward'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Get platform statistics
    const [
      totalUsers,
      totalActivities,
      approvedActivities,
      totalCarbonSaved,
      totalPointsAwarded,
      totalRewards,
      activeUsers,
      recentActivities
    ] = await Promise.all([
      User.countDocuments(),
      Activity.countDocuments(),
      Activity.countDocuments({ status: 'approved' }),
      Activity.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$carbonSaved' } } }
      ]),
      Activity.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$pointsEarned' } } }
      ]),
      Reward.countDocuments({ isActive: true }),
      User.countDocuments({ 
        updatedAt: { 
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        } 
      }),
      Activity.find({ status: 'approved' })
        .sort({ verifiedAt: -1 })
        .limit(10)
        .populate('userId', 'name')
        .select('type title pointsEarned carbonSaved verifiedAt userId')
        .lean()
    ])

    // Calculate activity type breakdown
    const activityTypeStats = await Activity.aggregate([
      { $match: { status: 'approved' } },
      { 
        $group: { 
          _id: '$type', 
          count: { $sum: 1 },
          totalPoints: { $sum: '$pointsEarned' },
          totalCarbon: { $sum: '$carbonSaved' }
        } 
      },
      { $sort: { count: -1 } }
    ])

    // Calculate monthly growth (last 12 months)
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const monthlyGrowth = await Promise.all([
      // User growth
      User.aggregate([
        { 
          $match: { 
            createdAt: { $gte: twelveMonthsAgo }
          } 
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            newUsers: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      // Activity growth
      Activity.aggregate([
        { 
          $match: { 
            status: 'approved',
            verifiedAt: { $gte: twelveMonthsAgo }
          } 
        },
        {
          $group: {
            _id: {
              year: { $year: '$verifiedAt' },
              month: { $month: '$verifiedAt' }
            },
            activities: { $sum: 1 },
            carbonSaved: { $sum: '$carbonSaved' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ])

    // Calculate top performers (users with most points this month)
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)

    const topPerformers = await Activity.aggregate([
      { 
        $match: { 
          status: 'approved',
          verifiedAt: { $gte: thisMonth }
        } 
      },
      {
        $group: {
          _id: '$userId',
          monthlyPoints: { $sum: '$pointsEarned' },
          monthlyActivities: { $sum: 1 },
          monthlyCarbon: { $sum: '$carbonSaved' }
        }
      },
      { $sort: { monthlyPoints: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          monthlyPoints: 1,
          monthlyActivities: 1,
          monthlyCarbon: 1,
          totalPoints: '$user.totalPointsEarned',
          level: '$user.level'
        }
      }
    ])

    return NextResponse.json({
      overview: {
        totalUsers,
        totalActivities,
        approvedActivities,
        totalCarbonSaved: totalCarbonSaved[0]?.total || 0,
        totalPointsAwarded: totalPointsAwarded[0]?.total || 0,
        totalRewards,
        activeUsers,
        approvalRate: totalActivities > 0 ? Math.round((approvedActivities / totalActivities) * 100) : 0
      },
      activityTypeStats,
      monthlyGrowth: {
        users: monthlyGrowth[0],
        activities: monthlyGrowth[1]
      },
      topPerformers,
      recentActivities: recentActivities.map(activity => ({
        id: activity._id.toString(),
        type: activity.type,
        title: activity.title,
        pointsEarned: activity.pointsEarned,
        carbonSaved: activity.carbonSaved,
        verifiedAt: activity.verifiedAt,
        user: activity.userId?.name || 'Unknown User'
      }))
    })

  } catch (error) {
    console.error('Get platform stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
