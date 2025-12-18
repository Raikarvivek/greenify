const mongoose = require('mongoose')

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://vivek:raikar2003@cluster0.nus3wqv.mongodb.net'

// Activity schema (simplified for this script)
const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  title: String,
  description: String,
  quantity: Number,
  unit: String,
  pointsEarned: Number,
  carbonSaved: Number,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verificationMedia: [{
    type: { type: String, enum: ['image', 'video'] },
    url: String,
    filename: String
  }],
  location: {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    address: String,
    timestamp: Number
  },
  submittedAt: { type: Date, default: Date.now },
  verifiedAt: Date,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: String
}, { timestamps: true })

const Activity = mongoose.model('Activity', ActivitySchema)

// User schema (simplified)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String
})

const User = mongoose.model('User', UserSchema)

async function checkActivities() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Get all activities
    const activities = await Activity.find({})
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(10)

    console.log(`\nFound ${activities.length} activities:`)
    
    if (activities.length === 0) {
      console.log('No activities found in the database!')
      
      // Let's also check users
      const users = await User.find({}, 'name email role')
      console.log(`\nFound ${users.length} users:`)
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`)
      })
    } else {
      activities.forEach((activity, index) => {
        console.log(`\n${index + 1}. ${activity.title}`)
        console.log(`   Status: ${activity.status}`)
        console.log(`   User: ${activity.userId?.name || 'Unknown'} (${activity.userId?.email || 'Unknown'})`)
        console.log(`   Points: ${activity.pointsEarned}`)
        console.log(`   Submitted: ${activity.submittedAt}`)
        console.log(`   Media files: ${activity.verificationMedia?.length || 0}`)
        if (activity.location) {
          console.log(`   Location: ${activity.location.latitude}, ${activity.location.longitude}`)
        }
      })
    }

    // Count by status
    const statusCounts = await Activity.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])
    
    console.log('\nActivity counts by status:')
    statusCounts.forEach(item => {
      console.log(`- ${item._id}: ${item.count}`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\nDisconnected from MongoDB')
  }
}

checkActivities()
