const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://vivek:raikar2003@cluster0.nus3wqv.mongodb.net'

// User schema (simplified for this script)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  points: { type: Number, default: 0 },
  totalPointsEarned: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  activitiesCompleted: { type: Number, default: 0 },
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

async function checkAndFixAdmin() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@greenify.com' })
    
    if (adminUser) {
      console.log('Admin user found:', {
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        hasPassword: !!adminUser.password
      })

      // Test password comparison
      const testPassword = 'GreenifyAdmin2024!'
      const isMatch = await bcrypt.compare(testPassword, adminUser.password)
      console.log('Password test result:', isMatch)

      if (!isMatch) {
        console.log('Password mismatch! Updating admin password...')
        const hashedPassword = await bcrypt.hash(testPassword, 12)
        await User.updateOne(
          { email: 'admin@greenify.com' },
          { password: hashedPassword }
        )
        console.log('Admin password updated successfully!')
      }
    } else {
      console.log('Admin user not found! Creating admin user...')
      const hashedPassword = await bcrypt.hash('GreenifyAdmin2024!', 12)
      
      const newAdmin = new User({
        name: 'Admin User',
        email: 'admin@greenify.com',
        password: hashedPassword,
        role: 'admin',
        points: 0,
        totalPointsEarned: 0,
        level: 1,
        activitiesCompleted: 0
      })

      await newAdmin.save()
      console.log('Admin user created successfully!')
    }

    // List all users for verification
    const allUsers = await User.find({}, 'name email role')
    console.log('\nAll users in database:')
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

checkAndFixAdmin()
