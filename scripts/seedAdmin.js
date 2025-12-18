const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Load environment variables
try {
  require('dotenv').config({ path: '.env.local' })
} catch (e) {
  console.log('dotenv not found, using process.env directly')
}

// User Schema (simplified for seeding)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  points: { type: Number, default: 0 },
  totalPointsEarned: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  activitiesCompleted: { type: Number, default: 0 }
}, { timestamps: true })

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

// Demo users to create (admin is built-in)
const demoUsers = [
  {
    name: 'Demo User',
    email: 'user@demo.com',
    password: 'password123',
    role: 'user',
    points: 250,
    totalPointsEarned: 500,
    level: 3,
    activitiesCompleted: 12
  }
]

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Check if demo users already exist
    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ email: userData.email })
      
      if (existingUser) {
        console.log(`✅ User ${userData.email} already exists`)
      } else {
        const user = new User(userData)
        await user.save()
        console.log(`✅ Created ${userData.role} user: ${userData.email}`)
      }
    }

    console.log('\n🎉 Demo user setup complete!')
    console.log('\n📋 Login Credentials:')
    console.log('👤 Demo User Account:')
    console.log('   Email: user@demo.com')
    console.log('   Password: password123')
    console.log('\n🛡️ Built-in Admin Account:')
    console.log('   Email: admin@greenify.com')
    console.log('   Password: GreenifyAdmin2024!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding users:', error)
    process.exit(1)
  }
}

seedUsers()
