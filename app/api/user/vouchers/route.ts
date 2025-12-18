import { NextRequest, NextResponse } from 'next/server'
import dbConnectSimple from '@/app/lib/mongodb-simple'
import UserReward from '@/app/lib/models/UserReward'
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
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build query
    const query: any = { userId: currentUser.userId }
    if (status !== 'all') {
      query.status = status
    }

    // Get user rewards with pagination
    const skip = (page - 1) * limit
    const vouchers = await UserReward.find(query)
      .populate('rewardId', 'title brand description category imageUrl')
      .sort({ redeemedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await UserReward.countDocuments(query)
    const pages = Math.ceil(total / limit)

    // Transform vouchers for response
    const transformedVouchers = vouchers.map((voucher: any) => ({
      id: voucher._id.toString(),
      voucherCode: voucher.voucherCode,
      pointsSpent: voucher.pointsSpent,
      status: voucher.status,
      redeemedAt: voucher.redeemedAt,
      expiresAt: voucher.expiresAt,
      usedAt: voucher.usedAt,
      reward: voucher.rewardId,
    }))

    return NextResponse.json({
      vouchers: transformedVouchers,
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
    console.error('Get vouchers error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
