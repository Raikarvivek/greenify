const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb+srv://vivek:raikar2003@cluster0.nus3wqv.mongodb.net'

// User schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', UserSchema)

async function testPasswordComparison() {
  try {
    console.log('Testing password comparison...')
    
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Test admin password
    console.log('\n--- Testing Admin Password ---')
    const admin = await User.findOne({ email: 'admin@greenify.com' }).select('+password')
    if (admin) {
      console.log('Admin found:', admin.name)
      console.log('Stored password hash:', admin.password.substring(0, 20) + '...')
      
      const testPassword = 'GreenifyAdmin2024!'
      console.log('Testing password:', testPassword)
      
      const isValid = await admin.comparePassword(testPassword)
      console.log('Password valid:', isValid)
      
      // Also test with bcrypt directly
      const directCompare = await bcrypt.compare(testPassword, admin.password)
      console.log('Direct bcrypt compare:', directCompare)
    } else {
      console.log('Admin not found')
    }

    // Test user password
    console.log('\n--- Testing User Password ---')
    const user = await User.findOne({ email: 'user@test.com' }).select('+password')
    if (user) {
      console.log('User found:', user.name)
      console.log('Stored password hash:', user.password.substring(0, 20) + '...')
      
      const testPassword = 'password123'
      console.log('Testing password:', testPassword)
      
      const isValid = await user.comparePassword(testPassword)
      console.log('Password valid:', isValid)
      
      // Also test with bcrypt directly
      const directCompare = await bcrypt.compare(testPassword, user.password)
      console.log('Direct bcrypt compare:', directCompare)
    } else {
      console.log('User not found')
    }

    await mongoose.disconnect()
    console.log('\n✅ Password test completed')
    
  } catch (error) {
    console.error('❌ Password test failed:', error)
  }
  
  process.exit(0)
}

testPasswordComparison()
