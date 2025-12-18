import User from './models/User'
import dbConnect from './mongodb'

// Built-in admin credentials
const ADMIN_EMAIL = 'admin@greenify.com'
const ADMIN_PASSWORD = 'GreenifyAdmin2024!'

export async function initializeAdmin() {
  try {
    await dbConnect()
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL })
    
    if (!existingAdmin) {
      // Create built-in admin user
      const adminUser = new User({
        name: 'System Administrator',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        points: 0,
        totalPointsEarned: 0,
        level: 1,
        activitiesCompleted: 0
      })
      
      await adminUser.save()
      console.log('✅ Built-in admin user created successfully')
    }
  } catch (error) {
    console.error('❌ Error initializing admin user:', error)
  }
}

// Export admin credentials for reference
export const ADMIN_CREDENTIALS = {
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD
}
