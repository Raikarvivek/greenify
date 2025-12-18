import { NextRequest, NextResponse } from 'next/server'
import dbConnectSimple from '@/app/lib/mongodb-simple'
import User from '@/app/lib/models/User'
import Reward from '@/app/lib/models/Reward'
import UserReward from '@/app/lib/models/UserReward'
import { verifyAccessToken } from '@/app/lib/jwt'

export async function POST(request: NextRequest) {
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
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { rewardId } = body

    if (!rewardId) {
      return NextResponse.json(
        { error: 'Reward ID is required' },
        { status: 400 }
      )
    }

    // Get user and reward from database
    const user = await User.findById(currentUser.userId)
    const reward = await Reward.findById(rewardId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!reward) {
      return NextResponse.json(
        { error: 'Reward not found' },
        { status: 404 }
      )
    }

    // Check if reward is still available
    if (!reward.isActive || reward.validUntil < new Date()) {
      return NextResponse.json(
        { error: 'This reward is no longer available' },
        { status: 400 }
      )
    }

    if (reward.currentRedemptions >= reward.maxRedemptions) {
      return NextResponse.json(
        { error: 'This reward has reached its redemption limit' },
        { status: 400 }
      )
    }

    // Check if user has enough points
    if (user.points < reward.pointsCost) {
      return NextResponse.json(
        { error: `Insufficient points. You need ${reward.pointsCost} points but have ${user.points}` },
        { status: 400 }
      )
    }

    // Generate unique voucher code
    const voucherCode = 'GREEN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase()
    
    // Create user reward (voucher) in database
    const userReward = new UserReward({
      userId: user._id,
      rewardId: reward._id,
      pointsSpent: reward.pointsCost,
      voucherCode: voucherCode,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'active',
    })
    
    await userReward.save()
    console.log('Created user reward:', userReward.voucherCode)

    // Update user points
    user.points -= reward.pointsCost
    await user.save()

    // Update reward redemption count
    reward.currentRedemptions += 1
    await reward.save()

    return NextResponse.json({
      message: 'Reward redeemed successfully!',
      voucher: {
        id: userReward._id.toString(),
        voucherCode: userReward.voucherCode,
        reward: {
          title: reward.title,
          brand: reward.brand,
          description: reward.description,
        },
        pointsSpent: userReward.pointsSpent,
        expiresAt: userReward.expiresAt,
        status: userReward.status,
      },
      userPoints: user.points,
    })

  } catch (error) {
    console.error('Redeem reward error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
