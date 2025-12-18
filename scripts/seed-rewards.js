const mongoose = require('mongoose')

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://vivek:raikar2003@cluster0.nus3wqv.mongodb.net'

// Reward schema (simplified for this script)
const RewardSchema = new mongoose.Schema({
  title: String,
  description: String,
  brand: String,
  discountPercentage: Number,
  discountAmount: Number,
  pointsCost: Number,
  category: String,
  imageUrl: String,
  termsAndConditions: String,
  validUntil: Date,
  maxRedemptions: Number,
  currentRedemptions: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const Reward = mongoose.model('Reward', RewardSchema)

const sampleRewards = [
  {
    title: "₹100 Off on Organic Food",
    description: "Get ₹100 discount on organic groceries and fresh produce",
    brand: "GreenMart",
    discountAmount: 100,
    pointsCost: 500,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    termsAndConditions: "Valid on orders above ₹500. Cannot be combined with other offers.",
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    maxRedemptions: 100
  },
  {
    title: "20% Off Eco-Friendly Products",
    description: "Save 20% on sustainable and eco-friendly household items",
    brand: "EcoStore",
    discountPercentage: 20,
    pointsCost: 300,
    category: "other",
    imageUrl: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400",
    termsAndConditions: "Valid on all eco-friendly products. Minimum purchase ₹200.",
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    maxRedemptions: 200
  },
  {
    title: "Free Coffee at Green Café",
    description: "Enjoy a complimentary coffee at any Green Café location",
    brand: "Green Café",
    discountAmount: 150,
    pointsCost: 200,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    termsAndConditions: "Valid for one regular coffee. Cannot be redeemed for specialty drinks.",
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    maxRedemptions: 500
  },
  {
    title: "₹250 Off Sustainable Fashion",
    description: "Get ₹250 discount on sustainable clothing and accessories",
    brand: "EcoFashion",
    discountAmount: 250,
    pointsCost: 800,
    category: "fashion",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    termsAndConditions: "Valid on orders above ₹1000. Excludes sale items.",
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
    maxRedemptions: 50
  },
  {
    title: "15% Off Plant-Based Meals",
    description: "Save 15% on delicious plant-based meal delivery",
    brand: "PlantEats",
    discountPercentage: 15,
    pointsCost: 400,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    termsAndConditions: "Valid for first-time customers. Minimum order ₹300.",
    validUntil: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000), // 75 days
    maxRedemptions: 150
  }
]

async function seedRewards() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Check if rewards already exist
    const existingRewards = await Reward.countDocuments()
    console.log(`Found ${existingRewards} existing rewards`)

    if (existingRewards === 0) {
      console.log('Seeding sample rewards...')
      
      for (const rewardData of sampleRewards) {
        const reward = new Reward(rewardData)
        await reward.save()
        console.log(`✅ Created reward: ${reward.title} (${reward.pointsCost} points)`)
      }
      
      console.log(`\n🎉 Successfully seeded ${sampleRewards.length} rewards!`)
    } else {
      console.log('Rewards already exist. Displaying current rewards:')
      
      const rewards = await Reward.find({}, 'title brand pointsCost category isActive')
      rewards.forEach((reward, index) => {
        console.log(`${index + 1}. ${reward.title} - ${reward.brand} (${reward.pointsCost} points) [${reward.category}] ${reward.isActive ? '✅' : '❌'}`)
      })
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\nDisconnected from MongoDB')
  }
}

seedRewards()
