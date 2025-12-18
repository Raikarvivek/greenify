const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

// Reward Schema
const RewardSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 500 },
  brand: { type: String, required: true, maxlength: 50 },
  discountPercentage: { type: Number, min: 0, max: 100 },
  discountAmount: { type: Number, min: 0 },
  pointsCost: { type: Number, required: true, min: 1 },
  category: { 
    type: String, 
    enum: ['food', 'fashion', 'electronics', 'travel', 'health', 'entertainment', 'other'],
    required: true 
  },
  imageUrl: { type: String, required: true },
  termsAndConditions: { type: String, required: true },
  validUntil: { type: Date, required: true },
  maxRedemptions: { type: Number, required: true, min: 1 },
  currentRedemptions: { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const Reward = mongoose.models.Reward || mongoose.model('Reward', RewardSchema)

// Rewards data from memory
const rewards = [
  // Food & Dining
  {
    title: 'Swiggy 20% Off',
    description: 'Get 20% off on your next Swiggy order. Valid on all restaurants.',
    brand: 'Swiggy',
    discountPercentage: 20,
    pointsCost: 100,
    category: 'food',
    imageUrl: 'https://placehold.co/300x200/FF6B35/FFFFFF?text=Swiggy',
    termsAndConditions: 'Valid for 30 days from redemption. Minimum order value ₹200. Cannot be combined with other offers.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    maxRedemptions: 1000,
    isActive: true
  },
  {
    title: 'Zomato 25% Off',
    description: 'Get 25% off on your next Zomato order. Valid on all restaurants.',
    brand: 'Zomato',
    discountPercentage: 25,
    pointsCost: 120,
    category: 'food',
    imageUrl: 'https://placehold.co/300x200/E23744/FFFFFF?text=Zomato',
    termsAndConditions: 'Valid for 30 days from redemption. Minimum order value ₹250. Cannot be combined with other offers.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 1000,
    isActive: true
  },
  {
    title: 'Domino\'s ₹300 Off',
    description: 'Get ₹300 off on your next Domino\'s pizza order.',
    brand: 'Domino\'s',
    discountAmount: 300,
    pointsCost: 150,
    category: 'food',
    imageUrl: 'https://placehold.co/300x200/0078AD/FFFFFF?text=Dominos',
    termsAndConditions: 'Valid for 30 days from redemption. Minimum order value ₹500. Valid on medium and large pizzas only.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 500,
    isActive: true
  },
  {
    title: 'Starbucks ₹200 Voucher',
    description: 'Get ₹200 voucher for Starbucks coffee and beverages.',
    brand: 'Starbucks',
    discountAmount: 200,
    pointsCost: 180,
    category: 'food',
    imageUrl: 'https://placehold.co/300x200/00704A/FFFFFF?text=Starbucks',
    termsAndConditions: 'Valid for 60 days from redemption. Valid at all Starbucks outlets. Cannot be used for merchandise.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 300,
    isActive: true
  },

  // Fashion
  {
    title: 'Lenskart 40% Off',
    description: 'Get 40% off on eyewear at Lenskart. Valid on frames and sunglasses.',
    brand: 'Lenskart',
    discountPercentage: 40,
    pointsCost: 200,
    category: 'fashion',
    imageUrl: 'https://placehold.co/300x200/7B68EE/FFFFFF?text=Lenskart',
    termsAndConditions: 'Valid for 45 days from redemption. Valid on frames above ₹1000. Eye test charges extra.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 200,
    isActive: true
  },
  {
    title: 'Myntra 30% Off',
    description: 'Get 30% off on fashion and lifestyle products at Myntra.',
    brand: 'Myntra',
    discountPercentage: 30,
    pointsCost: 180,
    category: 'fashion',
    imageUrl: 'https://placehold.co/300x200/FF3F6C/FFFFFF?text=Myntra',
    termsAndConditions: 'Valid for 30 days from redemption. Minimum purchase ₹1500. Valid on select brands only.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 500,
    isActive: true
  },
  {
    title: 'H&M ₹500 Off',
    description: 'Get ₹500 off on your H&M fashion purchase.',
    brand: 'H&M',
    discountAmount: 500,
    pointsCost: 250,
    category: 'fashion',
    imageUrl: 'https://placehold.co/300x200/000000/FFFFFF?text=H%26M',
    termsAndConditions: 'Valid for 30 days from redemption. Minimum purchase ₹2000. Valid at all H&M stores and online.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 150,
    isActive: true
  },
  {
    title: 'Nike 25% Off',
    description: 'Get 25% off on Nike sportswear and footwear.',
    brand: 'Nike',
    discountPercentage: 25,
    pointsCost: 300,
    category: 'fashion',
    imageUrl: 'https://placehold.co/300x200/000000/FFFFFF?text=Nike',
    termsAndConditions: 'Valid for 45 days from redemption. Valid on regular priced items only. Cannot be combined with other offers.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 100,
    isActive: true
  },

  // Electronics
  {
    title: 'Amazon ₹500 Off',
    description: 'Get ₹500 off on electronics and gadgets at Amazon.',
    brand: 'Amazon',
    discountAmount: 500,
    pointsCost: 300,
    category: 'electronics',
    imageUrl: 'https://placehold.co/300x200/FF9900/FFFFFF?text=Amazon',
    termsAndConditions: 'Valid for 30 days from redemption. Minimum purchase ₹2500. Valid on electronics category only.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 1000,
    isActive: true
  },
  {
    title: 'Flipkart ₹1000 Off',
    description: 'Get ₹1000 off on electronics and appliances at Flipkart.',
    brand: 'Flipkart',
    discountAmount: 1000,
    pointsCost: 400,
    category: 'electronics',
    imageUrl: 'https://placehold.co/300x200/047BD2/FFFFFF?text=Flipkart',
    termsAndConditions: 'Valid for 30 days from redemption. Minimum purchase ₹5000. Valid on electronics and large appliances.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 500,
    isActive: true
  },
  {
    title: 'Croma 20% Off',
    description: 'Get 20% off on electronics and gadgets at Croma stores.',
    brand: 'Croma',
    discountPercentage: 20,
    pointsCost: 350,
    category: 'electronics',
    imageUrl: 'https://placehold.co/300x200/7ED321/FFFFFF?text=Croma',
    termsAndConditions: 'Valid for 45 days from redemption. Valid at all Croma stores. Maximum discount ₹2000.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 200,
    isActive: true
  },

  // Travel
  {
    title: 'MakeMyTrip ₹2000 Off',
    description: 'Get ₹2000 off on domestic and international flight bookings.',
    brand: 'MakeMyTrip',
    discountAmount: 2000,
    pointsCost: 500,
    category: 'travel',
    imageUrl: 'https://placehold.co/300x200/D32F2F/FFFFFF?text=MakeMyTrip',
    termsAndConditions: 'Valid for 60 days from redemption. Minimum booking value ₹10000. Valid on flights only.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 100,
    isActive: true
  },
  {
    title: 'Goibibo 30% Off',
    description: 'Get 30% off on hotel bookings through Goibibo.',
    brand: 'Goibibo',
    discountPercentage: 30,
    pointsCost: 400,
    category: 'travel',
    imageUrl: 'https://placehold.co/300x200/FF6900/FFFFFF?text=Goibibo',
    termsAndConditions: 'Valid for 45 days from redemption. Minimum booking value ₹3000. Valid on hotel bookings only.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 200,
    isActive: true
  },
  {
    title: 'Ola ₹500 Off',
    description: 'Get ₹500 off on Ola cab rides and rentals.',
    brand: 'Ola',
    discountAmount: 500,
    pointsCost: 200,
    category: 'travel',
    imageUrl: 'https://placehold.co/300x200/00C853/FFFFFF?text=Ola',
    termsAndConditions: 'Valid for 30 days from redemption. Valid on rides above ₹200. Can be used in multiple rides.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 500,
    isActive: true
  },

  // Health & Beauty
  {
    title: 'Nykaa 35% Off',
    description: 'Get 35% off on beauty and cosmetics at Nykaa.',
    brand: 'Nykaa',
    discountPercentage: 35,
    pointsCost: 220,
    category: 'health',
    imageUrl: 'https://placehold.co/300x200/FC2779/FFFFFF?text=Nykaa',
    termsAndConditions: 'Valid for 30 days from redemption. Minimum purchase ₹1000. Valid on select brands.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 300,
    isActive: true
  },
  {
    title: 'PharmEasy ₹300 Off',
    description: 'Get ₹300 off on medicines and healthcare products.',
    brand: 'PharmEasy',
    discountAmount: 300,
    pointsCost: 150,
    category: 'health',
    imageUrl: 'https://placehold.co/300x200/1976D2/FFFFFF?text=PharmEasy',
    termsAndConditions: 'Valid for 45 days from redemption. Minimum order value ₹800. Valid on medicines and health products.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 400,
    isActive: true
  },
  {
    title: 'Cult.fit 50% Off',
    description: 'Get 50% off on Cult.fit gym and fitness memberships.',
    brand: 'Cult.fit',
    discountPercentage: 50,
    pointsCost: 350,
    category: 'health',
    imageUrl: 'https://placehold.co/300x200/FF6B35/FFFFFF?text=Cult.fit',
    termsAndConditions: 'Valid for 60 days from redemption. Valid on 3-month and 6-month memberships only.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 100,
    isActive: true
  },

  // Entertainment
  {
    title: 'BookMyShow ₹200 Off',
    description: 'Get ₹200 off on movie tickets and events booking.',
    brand: 'BookMyShow',
    discountAmount: 200,
    pointsCost: 150,
    category: 'entertainment',
    imageUrl: 'https://placehold.co/300x200/C2185B/FFFFFF?text=BookMyShow',
    termsAndConditions: 'Valid for 30 days from redemption. Minimum booking value ₹400. Valid on movies and events.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 500,
    isActive: true
  },
  {
    title: 'Netflix 1 Month Free',
    description: 'Get 1 month free Netflix premium subscription.',
    brand: 'Netflix',
    discountAmount: 649,
    pointsCost: 400,
    category: 'entertainment',
    imageUrl: 'https://placehold.co/300x200/E50914/FFFFFF?text=Netflix',
    termsAndConditions: 'Valid for 90 days from redemption. For new users only. Auto-renewal can be cancelled anytime.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 200,
    isActive: true
  },
  {
    title: 'Spotify Premium 3 Months',
    description: 'Get 3 months free Spotify Premium subscription.',
    brand: 'Spotify',
    discountAmount: 357,
    pointsCost: 300,
    category: 'entertainment',
    imageUrl: 'https://placehold.co/300x200/1DB954/FFFFFF?text=Spotify',
    termsAndConditions: 'Valid for 60 days from redemption. For new premium users only. Auto-renewal can be cancelled.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 150,
    isActive: true
  },
  {
    title: 'Gaming Zone ₹1000 Credits',
    description: 'Get ₹1000 credits for gaming and entertainment zones.',
    brand: 'Gaming Zone',
    discountAmount: 1000,
    pointsCost: 450,
    category: 'entertainment',
    imageUrl: 'https://placehold.co/300x200/9013FE/FFFFFF?text=Gaming+Zone',
    termsAndConditions: 'Valid for 90 days from redemption. Valid at participating gaming zones. Cannot be converted to cash.',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxRedemptions: 100,
    isActive: true
  }
]

async function seedRewards() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing rewards
    await Reward.deleteMany({})
    console.log('Cleared existing rewards')

    // Insert new rewards
    const createdRewards = await Reward.insertMany(rewards)
    console.log(`✅ Successfully seeded ${createdRewards.length} rewards`)

    // Log summary by category
    const summary = {}
    createdRewards.forEach(reward => {
      summary[reward.category] = (summary[reward.category] || 0) + 1
    })
    
    console.log('\n📊 Rewards by category:')
    Object.entries(summary).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} rewards`)
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding rewards:', error)
    process.exit(1)
  }
}

seedRewards()
