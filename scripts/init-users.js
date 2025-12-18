const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://vivek:raikar2003@cluster0.nus3wqv.mongodb.net'

// User schema (simplified)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
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

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', UserSchema)

async function initUsers() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Check and create admin user
    const adminExists = await User.findOne({ email: 'admin@greenify.com' })
    if (!adminExists) {
      const admin = new User({
        name: 'System Administrator',
        email: 'admin@greenify.com',
        password: 'GreenifyAdmin2024!',
        role: 'admin'
      })
      await admin.save()
      console.log('✅ Admin user created: admin@greenify.com / GreenifyAdmin2024!')
    } else {
      console.log('✅ Admin user already exists')
    }

    // Check and create test user
    const userExists = await User.findOne({ email: 'user@test.com' })
    if (!userExists) {
      const testUser = new User({
        name: 'Test User',
        email: 'user@test.com',
        password: 'password123',
        role: 'user'
      })
      await testUser.save()
      console.log('✅ Test user created: user@test.com / password123')
    } else {
      console.log('✅ Test user already exists')
    }

    // List all users
    const allUsers = await User.find({}, 'name email role')
    console.log('\n📋 All users in database:')
    allUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`)
    })

    console.log('\n✅ User initialization complete!')
    process.exit(0)

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

initUsers()
