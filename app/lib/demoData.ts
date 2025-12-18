// Activity points configuration
const ACTIVITY_POINTS = {
  recycling: 10,
  water_saving: 15,
  energy_saving: 20,
  transportation: 25,
  tree_planting: 50,
  waste_reduction: 12,
}

// Calculate carbon saved based on activity type and quantity
function calculateCarbonSaved(activityType: string, quantity: number): number {
  const carbonSavings = {
    recycling: 2.5, // kg CO2 per item
    water_saving: 1.8, // kg CO2 per day
    energy_saving: 3.2, // kg CO2 per day
    transportation: 4.5, // kg CO2 per trip
    tree_planting: 22.0, // kg CO2 per tree per year
    waste_reduction: 1.5, // kg CO2 per day
  }
  
  return (carbonSavings[activityType as keyof typeof carbonSavings] || 1.0) * quantity
}

// Demo data store for testing without database
let demoUsers = [
  {
    id: 'demo-user-1',
    name: 'John Eco',
    email: 'user@demo.com',
    password: 'password123', // In real app, this would be hashed
    role: 'user',
    points: 250,
    totalPointsEarned: 450,
    level: 5,
    activitiesCompleted: 12,
    streak: 7, // Current streak of consecutive days with activities
    longestStreak: 15,
    badges: ['first_activity', 'recycling_hero', 'week_warrior'],
    carbonSaved: 45.5, // kg of CO2 saved
    treesPlanted: 3,
    rank: 2,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'demo-admin-1',
    name: 'Admin Green',
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'admin',
    points: 1000,
    totalPointsEarned: 2000,
    level: 20,
    activitiesCompleted: 50,
    streak: 25,
    longestStreak: 30,
    badges: ['first_activity', 'recycling_hero', 'week_warrior', 'eco_champion', 'tree_planter', 'water_saver'],
    carbonSaved: 125.8,
    treesPlanted: 8,
    rank: 1,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'demo-user-2',
    name: 'Sarah Green',
    email: 'sarah@demo.com',
    password: 'demo123',
    role: 'user',
    points: 180,
    totalPointsEarned: 320,
    level: 4,
    activitiesCompleted: 8,
    streak: 3,
    longestStreak: 8,
    badges: ['first_activity', 'recycling_hero'],
    carbonSaved: 28.2,
    treesPlanted: 1,
    rank: 3,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'demo-user-3',
    name: 'Mike Earth',
    email: 'mike@demo.com',
    password: 'demo123',
    role: 'user',
    points: 95,
    totalPointsEarned: 150,
    level: 2,
    activitiesCompleted: 5,
    streak: 1,
    longestStreak: 4,
    badges: ['first_activity'],
    carbonSaved: 12.1,
    treesPlanted: 0,
    rank: 4,
    createdAt: new Date('2024-01-25'),
  }
]

// Badge definitions
const badgeDefinitions = {
  first_activity: {
    id: 'first_activity',
    name: 'First Steps',
    description: 'Complete your first eco-friendly activity',
    icon: '🌱',
    color: 'green',
    requirement: 'Complete 1 activity'
  },
  recycling_hero: {
    id: 'recycling_hero',
    name: 'Recycling Hero',
    description: 'Complete 5 recycling activities',
    icon: '♻️',
    color: 'blue',
    requirement: 'Complete 5 recycling activities'
  },
  week_warrior: {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day activity streak',
    icon: '🔥',
    color: 'orange',
    requirement: '7-day streak'
  },
  eco_champion: {
    id: 'eco_champion',
    name: 'Eco Champion',
    description: 'Earn 1000+ total points',
    icon: '🏆',
    color: 'gold',
    requirement: '1000+ total points'
  },
  tree_planter: {
    id: 'tree_planter',
    name: 'Tree Planter',
    description: 'Plant 5 trees',
    icon: '🌳',
    color: 'green',
    requirement: 'Plant 5 trees'
  },
  water_saver: {
    id: 'water_saver',
    name: 'Water Saver',
    description: 'Complete 10 water saving activities',
    icon: '💧',
    color: 'blue',
    requirement: '10 water saving activities'
  },
  carbon_crusher: {
    id: 'carbon_crusher',
    name: 'Carbon Crusher',
    description: 'Save 50kg of CO2',
    icon: '🌍',
    color: 'green',
    requirement: 'Save 50kg CO2'
  },
  streak_master: {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Achieve a 30-day streak',
    icon: '⚡',
    color: 'yellow',
    requirement: '30-day streak'
  }
}

let demoActivities = [
  {
    id: 'activity-1',
    userId: 'demo-user-1',
    type: 'recycling',
    title: 'Recycled plastic bottles',
    description: 'Collected and recycled 5 plastic bottles from home',
    pointsEarned: 50,
    quantity: 5,
    unit: 'bottles',
    status: 'approved',
    verificationMedia: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop',
        filename: 'recycling_bottles.jpg'
      }
    ],
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      accuracy: 15,
      address: 'New Delhi, Delhi, India',
      timestamp: new Date('2024-01-20T09:00:00').getTime()
    },
    verifiedBy: 'demo-admin-1',
    verifiedAt: new Date('2024-01-20T10:30:00'),
    submittedAt: new Date('2024-01-20T09:00:00'),
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'activity-2',
    userId: 'demo-user-1',
    type: 'water_saving',
    title: 'Shorter showers',
    description: 'Took 5-minute showers instead of 15-minute ones',
    pointsEarned: 30,
    quantity: 2,
    unit: 'days',
    status: 'approved',
    verificationMedia: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
        filename: 'water_saving.jpg'
      }
    ],
    location: {
      latitude: 28.5355,
      longitude: 77.3910,
      accuracy: 22,
      address: 'Noida, Uttar Pradesh, India',
      timestamp: new Date('2024-01-19T12:00:00').getTime()
    },
    verifiedBy: 'demo-admin-1',
    verifiedAt: new Date('2024-01-19T14:20:00'),
    submittedAt: new Date('2024-01-19T12:00:00'),
    createdAt: new Date('2024-01-19'),
  },
  {
    id: 'activity-3',
    userId: 'demo-user-1',
    type: 'tree_planting',
    title: 'Planted tree in local park',
    description: 'Participated in community tree planting event',
    pointsEarned: 50,
    quantity: 1,
    unit: 'tree',
    status: 'approved',
    verificationMedia: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
        filename: 'tree_planting.jpg'
      }
    ],
    location: {
      latitude: 28.4595,
      longitude: 77.0266,
      accuracy: 8,
      address: 'Gurgaon, Haryana, India',
      timestamp: new Date('2024-01-18T15:00:00').getTime()
    },
    verifiedBy: 'demo-admin-1',
    verifiedAt: new Date('2024-01-18T16:45:00'),
    submittedAt: new Date('2024-01-18T15:00:00'),
    createdAt: new Date('2024-01-18'),
  },
  {
    id: 'activity-4',
    userId: 'demo-user-2',
    type: 'energy_saving',
    title: 'LED bulb replacement',
    description: 'Replaced 10 incandescent bulbs with LED bulbs',
    pointsEarned: 0, // Not yet approved
    quantity: 10,
    unit: 'bulbs',
    status: 'pending',
    verificationMedia: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        filename: 'led_bulbs.jpg'
      }
    ],
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      accuracy: 18,
      address: 'Mumbai, Maharashtra, India',
      timestamp: new Date('2024-01-22T11:30:00').getTime()
    },
    submittedAt: new Date('2024-01-22T11:30:00'),
    createdAt: new Date('2024-01-22'),
  },
  {
    id: 'activity-5',
    userId: 'demo-user-3',
    type: 'waste_reduction',
    title: 'Composting kitchen waste',
    description: 'Started composting organic kitchen waste',
    pointsEarned: 0, // Not yet approved
    quantity: 1,
    unit: 'week',
    status: 'pending',
    verificationMedia: [
      {
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4',
        filename: 'composting_demo.mp4'
      }
    ],
    location: {
      latitude: 13.0827,
      longitude: 80.2707,
      accuracy: 25,
      address: 'Chennai, Tamil Nadu, India',
      timestamp: new Date('2024-01-23T09:15:00').getTime()
    },
    submittedAt: new Date('2024-01-23T09:15:00'),
    createdAt: new Date('2024-01-23'),
  },
  {
    id: 'activity-6',
    userId: 'demo-user-3',
    type: 'recycling',
    title: 'Plastic bag recycling',
    description: 'Collected plastic bags for recycling',
    pointsEarned: 0,
    quantity: 5,
    unit: 'bags',
    status: 'rejected',
    verificationMedia: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop',
        filename: 'plastic_bags.jpg'
      }
    ],
    rejectionReason: 'Image quality too poor to verify the activity',
    verifiedBy: 'demo-admin-1',
    verifiedAt: new Date('2024-01-21T14:00:00'),
    location: {
      latitude: 22.5726,
      longitude: 88.3639,
      accuracy: 35,
      address: 'Kolkata, West Bengal, India',
      timestamp: new Date('2024-01-21T10:00:00').getTime()
    },
    submittedAt: new Date('2024-01-21T10:00:00'),
    createdAt: new Date('2024-01-21'),
  }
]

let demoRewards = [
  // Food & Dining
  {
    id: 'reward-1',
    title: 'Swiggy 20% Off',
    description: 'Get 20% off on your next food order',
    brand: 'Swiggy',
    discountPercentage: 20,
    pointsCost: 100,
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid for orders above ₹200. Cannot be combined with other offers.',
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    maxRedemptions: 1000,
    currentRedemptions: 45,
    isActive: true,
  },
  {
    id: 'reward-4',
    title: 'Zomato 25% Off',
    description: 'Get 25% off on food delivery',
    brand: 'Zomato',
    discountPercentage: 25,
    pointsCost: 120,
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid for orders above ₹300. Maximum discount ₹150.',
    validUntil: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
    maxRedemptions: 800,
    currentRedemptions: 67,
    isActive: true,
  },
  {
    id: 'reward-7',
    title: 'Domino\'s ₹300 Off',
    description: 'Get ₹300 off on pizza orders',
    brand: 'Domino\'s Pizza',
    discountAmount: 300,
    pointsCost: 150,
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid on orders above ₹800. Valid for 30 days.',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    maxRedemptions: 500,
    currentRedemptions: 78,
    isActive: true,
  },
  {
    id: 'reward-8',
    title: 'Starbucks ₹200 Voucher',
    description: 'Get ₹200 voucher for Starbucks',
    brand: 'Starbucks',
    discountAmount: 200,
    pointsCost: 180,
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid at all Starbucks outlets. Cannot be combined with other offers.',
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    maxRedemptions: 300,
    currentRedemptions: 45,
    isActive: true,
  },

  // Fashion
  {
    id: 'reward-2',
    title: 'Lenskart 40% Off',
    description: 'Get 40% off on eyewear and sunglasses',
    brand: 'Lenskart',
    discountPercentage: 40,
    pointsCost: 200,
    category: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid on all products. Minimum purchase ₹1000.',
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    maxRedemptions: 500,
    currentRedemptions: 23,
    isActive: true,
  },
  {
    id: 'reward-6',
    title: 'Myntra 30% Off',
    description: 'Get 30% off on fashion and lifestyle',
    brand: 'Myntra',
    discountPercentage: 30,
    pointsCost: 180,
    category: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid on all fashion items. Minimum purchase ₹1500.',
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    maxRedemptions: 600,
    currentRedemptions: 34,
    isActive: true,
  },
  {
    id: 'reward-9',
    title: 'H&M ₹500 Off',
    description: 'Get ₹500 off on fashion collection',
    brand: 'H&M',
    discountAmount: 500,
    pointsCost: 250,
    category: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid on purchases above ₹2000. Valid for 45 days.',
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    maxRedemptions: 400,
    currentRedemptions: 56,
    isActive: true,
  },
  {
    id: 'reward-10',
    title: 'Nike 25% Off',
    description: 'Get 25% off on Nike sportswear',
    brand: 'Nike',
    discountPercentage: 25,
    pointsCost: 300,
    category: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid on all Nike products. Minimum purchase ₹2500.',
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    maxRedemptions: 200,
    currentRedemptions: 12,
    isActive: true,
  },

  // Electronics
  {
    id: 'reward-3',
    title: 'Amazon ₹500 Off',
    description: 'Get ₹500 off on electronics',
    brand: 'Amazon',
    discountAmount: 500,
    pointsCost: 300,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid on electronics above ₹2000. One time use only.',
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    maxRedemptions: 300,
    currentRedemptions: 12,
    isActive: true,
  },
  {
    id: 'reward-11',
    title: 'Flipkart ₹1000 Off',
    description: 'Get ₹1000 off on electronics & gadgets',
    brand: 'Flipkart',
    discountAmount: 1000,
    pointsCost: 400,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid on electronics above ₹5000. Valid for 60 days.',
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    maxRedemptions: 150,
    currentRedemptions: 8,
    isActive: true,
  },
  {
    id: 'reward-12',
    title: 'Croma 20% Off',
    description: 'Get 20% off on electronics at Croma',
    brand: 'Croma',
    discountPercentage: 20,
    pointsCost: 350,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid on all electronics. Maximum discount ₹2000.',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    maxRedemptions: 250,
    currentRedemptions: 34,
    isActive: true,
  },

  // Travel
  {
    id: 'reward-13',
    title: 'MakeMyTrip ₹2000 Off',
    description: 'Get ₹2000 off on flight bookings',
    brand: 'MakeMyTrip',
    discountAmount: 2000,
    pointsCost: 500,
    category: 'travel',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid on domestic flights above ₹8000. Valid for 90 days.',
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    maxRedemptions: 100,
    currentRedemptions: 15,
    isActive: true,
  },
  {
    id: 'reward-14',
    title: 'Goibibo 30% Off',
    description: 'Get 30% off on hotel bookings',
    brand: 'Goibibo',
    discountPercentage: 30,
    pointsCost: 400,
    category: 'travel',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid on hotel bookings above ₹3000. Maximum discount ₹1500.',
    validUntil: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
    maxRedemptions: 200,
    currentRedemptions: 27,
    isActive: true,
  },
  {
    id: 'reward-15',
    title: 'Ola ₹500 Off',
    description: 'Get ₹500 off on Ola rides',
    brand: 'Ola',
    discountAmount: 500,
    pointsCost: 200,
    category: 'travel',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid on rides above ₹200. Can be used in multiple trips.',
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    maxRedemptions: 500,
    currentRedemptions: 89,
    isActive: true,
  },

  // Health & Beauty
  {
    id: 'reward-16',
    title: 'Nykaa 35% Off',
    description: 'Get 35% off on beauty products',
    brand: 'Nykaa',
    discountPercentage: 35,
    pointsCost: 220,
    category: 'health',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid on all beauty products. Minimum purchase ₹1200.',
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    maxRedemptions: 400,
    currentRedemptions: 67,
    isActive: true,
  },
  {
    id: 'reward-17',
    title: 'Pharmeasy ₹300 Off',
    description: 'Get ₹300 off on medicines & health products',
    brand: 'PharmEasy',
    discountAmount: 300,
    pointsCost: 150,
    category: 'health',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid on orders above ₹800. Valid for 30 days.',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    maxRedemptions: 300,
    currentRedemptions: 45,
    isActive: true,
  },
  {
    id: 'reward-18',
    title: 'Cult.fit 50% Off',
    description: 'Get 50% off on fitness memberships',
    brand: 'Cult.fit',
    discountPercentage: 50,
    pointsCost: 350,
    category: 'health',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid on 3-month and 6-month memberships only.',
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    maxRedemptions: 150,
    currentRedemptions: 23,
    isActive: true,
  },

  // Entertainment
  {
    id: 'reward-5',
    title: 'BookMyShow ₹200 Off',
    description: 'Get ₹200 off on movie tickets',
    brand: 'BookMyShow',
    discountAmount: 200,
    pointsCost: 150,
    category: 'entertainment',
    imageUrl: 'https://images.unsplash.com/photo-1489599735734-79b4169f2a78?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid on movie tickets. Minimum booking of 2 tickets.',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    maxRedemptions: 400,
    currentRedemptions: 89,
    isActive: true,
  },
  {
    id: 'reward-19',
    title: 'Netflix 1 Month Free',
    description: 'Get 1 month free Netflix subscription',
    brand: 'Netflix',
    discountAmount: 649,
    pointsCost: 400,
    category: 'entertainment',
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid for new subscribers only. Auto-renewal can be cancelled.',
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    maxRedemptions: 100,
    currentRedemptions: 34,
    isActive: true,
  },
  {
    id: 'reward-20',
    title: 'Spotify Premium 3 Months',
    description: 'Get 3 months of Spotify Premium',
    brand: 'Spotify',
    discountAmount: 357,
    pointsCost: 300,
    category: 'entertainment',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid for new Premium subscribers. No ads, offline listening.',
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    maxRedemptions: 200,
    currentRedemptions: 56,
    isActive: true,
  },
  {
    id: 'reward-21',
    title: 'Gaming Zone ₹1000 Credits',
    description: 'Get ₹1000 gaming credits',
    brand: 'Smaaash',
    discountAmount: 1000,
    pointsCost: 450,
    category: 'entertainment',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop',
    termsAndConditions: 'Valid at all Smaaash outlets. Valid for 60 days.',
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    maxRedemptions: 150,
    currentRedemptions: 12,
    isActive: true,
  }
]

let demoUserRewards = [
  {
    id: 'user-reward-1',
    userId: 'demo-user-1',
    rewardId: 'reward-1',
    pointsSpent: 100,
    voucherCode: 'GREEN2024SWIGGY',
    status: 'active',
    redeemedAt: new Date('2024-01-21'),
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    createdAt: new Date('2024-01-21'),
  },
  {
    id: 'user-reward-2',
    userId: 'demo-user-1',
    rewardId: 'reward-4',
    pointsSpent: 120,
    voucherCode: 'GREEN2024ZOMATO',
    status: 'used',
    redeemedAt: new Date('2024-01-15'),
    usedAt: new Date('2024-01-16'),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    createdAt: new Date('2024-01-15'),
  }
]

// Helper functions to manage demo data
export const demoData = {
  // Users
  findUserByEmail: (email: string) => {
    return demoUsers.find(user => user.email === email)
  },
  
  findUserById: (id: string) => {
    return demoUsers.find(user => user.id === id)
  },
  
  updateUser: (id: string, updates: any) => {
    const userIndex = demoUsers.findIndex(user => user.id === id)
    if (userIndex !== -1) {
      demoUsers[userIndex] = { ...demoUsers[userIndex], ...updates }
      return demoUsers[userIndex]
    }
    return null
  },
  
  // Activities
  getUserActivities: (userId: string, limit = 10) => {
    return demoActivities
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  },
  
  addActivity: (activityData: any) => {
    const newActivity = {
      id: `activity-${Date.now()}`,
      ...activityData,
      status: 'pending', // All new activities start as pending
      submittedAt: new Date(),
      createdAt: new Date(),
      pointsEarned: 0, // Points awarded only after approval
    }
    demoActivities.push(newActivity)
    return newActivity
  },
  
  // Admin verification functions
  getPendingActivities: () => {
    return demoActivities
      .filter(activity => activity.status === 'pending')
      .sort((a, b) => new Date(b.submittedAt || b.createdAt).getTime() - new Date(a.submittedAt || a.createdAt).getTime())
  },
  
  approveActivity: (activityId: string, adminId: string) => {
    const activityIndex = demoActivities.findIndex(activity => activity.id === activityId)
    if (activityIndex === -1) return null
    
    const activity = demoActivities[activityIndex]
    const pointsToAward = ACTIVITY_POINTS[activity.type as keyof typeof ACTIVITY_POINTS] || 10
    const finalPoints = activity.quantity ? Math.min(pointsToAward * activity.quantity, pointsToAward * 5) : pointsToAward
    
    // Update activity
    demoActivities[activityIndex] = {
      ...activity,
      status: 'approved',
      pointsEarned: finalPoints,
      verifiedBy: adminId,
      verifiedAt: new Date(),
    }
    
    // Update user points
    const user = demoUsers.find(u => u.id === activity.userId)
    if (user) {
      user.points += finalPoints
      user.totalPointsEarned += finalPoints
      user.activitiesCompleted += 1
      user.level = Math.floor(user.totalPointsEarned / 100) + 1
      user.carbonSaved += calculateCarbonSaved(activity.type, activity.quantity || 1)
      if (activity.type === 'tree_planting') {
        user.treesPlanted += activity.quantity || 1
      }
    }
    
    return demoActivities[activityIndex]
  },
  
  rejectActivity: (activityId: string, adminId: string, reason: string) => {
    const activityIndex = demoActivities.findIndex(activity => activity.id === activityId)
    if (activityIndex === -1) return null
    
    demoActivities[activityIndex] = {
      ...demoActivities[activityIndex],
      status: 'rejected',
      rejectionReason: reason,
      verifiedBy: adminId,
      verifiedAt: new Date(),
    }
    
    return demoActivities[activityIndex]
  },
  
  // Rewards
  getRewards: (category?: string) => {
    let filteredRewards = demoRewards.filter(reward => 
      reward.isActive && 
      reward.validUntil > new Date() &&
      reward.currentRedemptions < reward.maxRedemptions
    )
    
    if (category && category !== 'all') {
      filteredRewards = filteredRewards.filter(reward => reward.category === category)
    }
    
    return filteredRewards.sort((a, b) => a.pointsCost - b.pointsCost)
  },
  
  findRewardById: (id: string) => {
    return demoRewards.find(reward => reward.id === id)
  },
  
  updateReward: (id: string, updates: any) => {
    const rewardIndex = demoRewards.findIndex(reward => reward.id === id)
    if (rewardIndex !== -1) {
      demoRewards[rewardIndex] = { ...demoRewards[rewardIndex], ...updates }
      return demoRewards[rewardIndex]
    }
    return null
  },
  
  // User Rewards (Vouchers)
  addUserReward: (userRewardData: any) => {
    const newUserReward = {
      id: `user-reward-${Date.now()}`,
      voucherCode: `GREEN${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      ...userRewardData,
      redeemedAt: new Date(),
      createdAt: new Date(),
    }
    demoUserRewards.push(newUserReward)
    return newUserReward
  },
  
  getUserRewards: (userId: string, status?: string) => {
    let userRewards = demoUserRewards.filter(reward => reward.userId === userId)
    
    if (status && status !== 'all') {
      userRewards = userRewards.filter(reward => reward.status === status)
    }
    
    return userRewards
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(userReward => ({
        ...userReward,
        rewardId: demoRewards.find(reward => reward.id === userReward.rewardId)
      }))
  },
  
  // Leaderboard
  getLeaderboard: (limit = 10) => {
    return demoUsers
      .filter(user => user.role === 'user')
      .sort((a, b) => b.totalPointsEarned - a.totalPointsEarned)
      .slice(0, limit)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }))
  },
  
  // Badges
  getBadgeDefinitions: () => badgeDefinitions,
  
  getUserBadges: (userId: string) => {
    const user = demoUsers.find(u => u.id === userId)
    if (!user) return []
    
    return user.badges.map(badgeId => badgeDefinitions[badgeId as keyof typeof badgeDefinitions])
  },
  
  checkAndAwardBadges: (userId: string) => {
    const user = demoUsers.find(u => u.id === userId)
    if (!user) return []
    
    const newBadges = []
    
    // Check for new badges based on user stats
    if (user.activitiesCompleted >= 1 && !user.badges.includes('first_activity')) {
      user.badges.push('first_activity')
      newBadges.push('first_activity')
    }
    
    if (user.streak >= 7 && !user.badges.includes('week_warrior')) {
      user.badges.push('week_warrior')
      newBadges.push('week_warrior')
    }
    
    if (user.totalPointsEarned >= 1000 && !user.badges.includes('eco_champion')) {
      user.badges.push('eco_champion')
      newBadges.push('eco_champion')
    }
    
    if (user.carbonSaved >= 50 && !user.badges.includes('carbon_crusher')) {
      user.badges.push('carbon_crusher')
      newBadges.push('carbon_crusher')
    }
    
    if (user.longestStreak >= 30 && !user.badges.includes('streak_master')) {
      user.badges.push('streak_master')
      newBadges.push('streak_master')
    }
    
    return newBadges
  },
  
  // Demo accounts info
  getDemoAccounts: () => ({
    user: {
      email: 'user@demo.com',
      password: 'password123',
      name: 'John Eco',
      role: 'user'
    },
    admin: {
      email: 'admin@demo.com', 
      password: 'admin123',
      name: 'Admin Green',
      role: 'admin'
    }
  })
}
