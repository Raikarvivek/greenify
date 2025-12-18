const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb+srv://vivek:raikar2003@cluster0.nus3wqv.mongodb.net'

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...')
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
    
    console.log('✅ Connected to MongoDB successfully')
    
    // Test finding users
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String
    }))
    
    console.log('Searching for users...')
    const users = await User.find({}, 'name email role')
    console.log(`Found ${users.length} users:`)
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`)
    })
    
    // Test specific user lookup
    console.log('\nTesting admin user lookup...')
    const admin = await User.findOne({ email: 'admin@greenify.com' }).select('+password')
    console.log('Admin found:', admin ? 'Yes' : 'No')
    if (admin) {
      console.log('Admin has password:', !!admin.password)
    }
    
    console.log('\nTesting regular user lookup...')
    const testUser = await User.findOne({ email: 'user@test.com' }).select('+password')
    console.log('Test user found:', testUser ? 'Yes' : 'No')
    if (testUser) {
      console.log('Test user has password:', !!testUser.password)
    }
    
    await mongoose.disconnect()
    console.log('\n✅ Database test completed successfully')
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
  }
  
  process.exit(0)
}

testConnection()
