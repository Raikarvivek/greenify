import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/app/lib/mongodb'
import User from '@/app/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    console.log('Test auth endpoint hit')
    
    const startTime = Date.now()
    await dbConnect()
    const dbTime = Date.now() - startTime
    console.log(`DB connection took: ${dbTime}ms`)
    
    const { email, password } = await request.json()
    console.log('Testing login for:', email)
    
    const userStartTime = Date.now()
    const user = await User.findOne({ email }).select('+password')
    const userTime = Date.now() - userStartTime
    console.log(`User lookup took: ${userTime}ms`)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const passwordStartTime = Date.now()
    const isValid = await user.comparePassword(password)
    const passwordTime = Date.now() - passwordStartTime
    console.log(`Password check took: ${passwordTime}ms`)
    
    const totalTime = Date.now() - startTime
    console.log(`Total time: ${totalTime}ms`)
    
    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      },
      timing: {
        db: dbTime,
        user: userTime,
        password: passwordTime,
        total: totalTime
      },
      passwordValid: isValid
    })
    
  } catch (error : any) {
    console.error('Test auth error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
