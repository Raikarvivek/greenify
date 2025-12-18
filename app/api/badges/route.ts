import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/app/lib/auth'
import { demoData } from '@/app/lib/demoData'

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userBadges = demoData.getUserBadges(currentUser.userId)
    const allBadges = demoData.getBadgeDefinitions()

    return NextResponse.json({
      userBadges,
      allBadges,
      earnedCount: userBadges.length,
      totalCount: Object.keys(allBadges).length
    })

  } catch (error) {
    console.error('Get badges error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
