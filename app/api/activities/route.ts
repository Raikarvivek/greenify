import { NextRequest, NextResponse } from 'next/server'
import dbConnectSimple from '@/app/lib/mongodb-simple'
import Activity from '@/app/lib/models/Activity'
import User from '@/app/lib/models/User'
import { requireAuth } from '@/app/lib/jwt'

// Predefined point values for different activities
const ACTIVITY_POINTS = {
  recycling: 10,
  water_saving: 15,
  energy_saving: 20,
  transportation: 25,
  tree_planting: 50,
  waste_reduction: 12,
}

// Calculate level based on total points
function calculateLevel(totalPoints: number): number {
  return Math.floor(totalPoints / 100) + 1
}

// Calculate carbon saved based on activity type and quantity
function calculateCarbonSaved(activityType: string, quantity: number): number {
  const carbonSavings = {
    recycling: 2.5, // kg CO2 per item
    water_saving: 1.8, // kg CO2 per day
    energy_saving: 3.2, // kg CO2 per day
    transportation: 4.5, // kg CO2 per trip
    tree_planting: 22.0, // kg CO2 per tree per year
    waste_reduction: 1.5, // kg CO2 per day
  }
  
  return (carbonSavings[activityType as keyof typeof carbonSavings] || 1.0) * quantity
}

export async function POST(request: NextRequest) {
  try {
    await dbConnectSimple()
    
    const currentUser = requireAuth(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, title, description, quantity, unit, verificationMedia, location } = body

    // Validate required fields
    if (!type || !title || !description) {
      return NextResponse.json(
        { error: 'Type, title, and description are required' },
        { status: 400 }
      )
    }

    // Validate activity type
    if (!ACTIVITY_POINTS[type as keyof typeof ACTIVITY_POINTS]) {
      return NextResponse.json(
        { error: 'Invalid activity type' },
        { status: 400 }
      )
    }

    // Validate media uploads for verification
    if (!verificationMedia || verificationMedia.length === 0) {
      return NextResponse.json(
        { error: 'At least one photo or video is required for verification' },
        { status: 400 }
      )
    }

    if (verificationMedia.length > 3) {
      return NextResponse.json(
        { error: 'Maximum 3 files allowed for verification' },
        { status: 400 }
      )
    }

    // Validate location data for verification
    if (!location || !location.latitude || !location.longitude || !location.address) {
      return NextResponse.json(
        { error: 'Complete location data is required for verification' },
        { status: 400 }
      )
    }

    // Calculate points based on activity type and quantity (will be awarded after approval)
    let pointsEarned = ACTIVITY_POINTS[type as keyof typeof ACTIVITY_POINTS]
    if (quantity && quantity > 1) {
      pointsEarned = Math.min(pointsEarned * quantity, pointsEarned * 5) // Cap at 5x base points
    }

    // Calculate carbon saved
    const carbonSaved = calculateCarbonSaved(type, quantity || 1)

    // Create the activity in database (pending status)
    const activity = await Activity.create({
      userId: currentUser.userId,
      type,
      title,
      description,
      quantity,
      unit,
      pointsEarned, // Points to be awarded after approval
      verificationMedia,
      location,
      carbonSaved,
      status: 'pending', // All activities start as pending
      submittedAt: new Date(),
    })

    return NextResponse.json({
      message: 'Activity submitted successfully! It will be reviewed by our admin team.',
      activity: {
        id: activity._id.toString(),
        type: activity.type,
        title: activity.title,
        status: activity.status,
        pointsEarned: activity.pointsEarned,
        carbonSaved: activity.carbonSaved,
        submittedAt: activity.submittedAt,
      },
      notice: 'Your activity is pending verification. Points will be awarded once approved by admin.'
    })

  } catch (error) {
    console.error('Log activity error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') // pending, approved, rejected
    const type = searchParams.get('type') // activity type filter

    // Build query
    const query: any = { userId: currentUser.userId }
    if (status) query.status = status
    if (type) query.type = type

    // Get activities with pagination
    const skip = (page - 1) * limit
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
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
    })

  } catch (error) {
    console.error('Get activities error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
