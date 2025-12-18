import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/app/lib/mongodb'
import Reward from '@/app/lib/models/Reward'
import { getCurrentUser } from '@/app/lib/auth'

const sampleRewards = [
  {
    title: "Swiggy 20% Off",
    description: "Get 20% off on your next food order",
    brand: "Swiggy",
    discountPercentage: 20,
    pointsCost: 100,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
    termsAndConditions: "Valid for orders above ₹200. Cannot be combined with other offers.",
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    maxRedemptions: 1000,
  },
  {
    title: "Lenskart 40% Off",
    description: "Get 40% off on eyewear and sunglasses",
    brand: "Lenskart",
    discountPercentage: 40,
    pointsCost: 200,
    category: "fashion",
    imageUrl: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&h=200&fit=crop",
    termsAndConditions: "Valid on all products. Minimum purchase ₹1000.",
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    maxRedemptions: 500,
  },
  {
    title: "Amazon ₹500 Off",
    description: "Get ₹500 off on electronics",
    brand: "Amazon",
    discountAmount: 500,
    pointsCost: 300,
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop",
    termsAndConditions: "Valid on electronics above ₹2000. One time use only.",
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
    maxRedemptions: 300,
  },
  {
    title: "Zomato 25% Off",
    description: "Get 25% off on food delivery",
    brand: "Zomato",
    discountPercentage: 25,
    pointsCost: 120,
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop",
    termsAndConditions: "Valid for orders above ₹300. Maximum discount ₹150.",
    validUntil: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000), // 75 days
    maxRedemptions: 800,
  },
  {
    title: "BookMyShow ₹200 Off",
    description: "Get ₹200 off on movie tickets",
    brand: "BookMyShow",
    discountAmount: 200,
    pointsCost: 150,
    category: "entertainment",
    imageUrl: "https://images.unsplash.com/photo-1489599735734-79b4169f2a78?w=300&h=200&fit=crop",
    termsAndConditions: "Valid on movie tickets. Minimum booking of 2 tickets.",
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    maxRedemptions: 400,
  },
  {
    title: "Myntra 30% Off",
    description: "Get 30% off on fashion and lifestyle",
    brand: "Myntra",
    discountPercentage: 30,
    pointsCost: 180,
    category: "fashion",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop",
    termsAndConditions: "Valid on all fashion items. Minimum purchase ₹1500.",
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    maxRedemptions: 600,
  },
  {
    title: "Uber ₹100 Off",
    description: "Get ₹100 off on your next ride",
    brand: "Uber",
    discountAmount: 100,
    pointsCost: 80,
    category: "travel",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
    termsAndConditions: "Valid for rides above ₹200. One time use only.",
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    maxRedemptions: 1000,
  },
  {
    title: "Nykaa 35% Off",
    description: "Get 35% off on beauty and wellness products",
    brand: "Nykaa",
    discountPercentage: 35,
    pointsCost: 160,
    category: "health",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop",
    termsAndConditions: "Valid on all beauty products. Minimum purchase ₹800.",
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
    maxRedemptions: 500,
  },
]

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you might want to implement this check)
    // For now, we'll allow anyone to seed data for testing

    // Clear existing rewards (optional - remove in production)
    await Reward.deleteMany({})

    // Insert sample rewards
    const rewards = await Reward.insertMany(sampleRewards)

    return NextResponse.json({
      message: 'Sample rewards seeded successfully!',
      count: rewards.length,
      rewards: rewards.map(r => ({
        id: r._id,
        title: r.title,
        brand: r.brand,
        pointsCost: r.pointsCost,
      }))
    })

  } catch (error) {
    console.error('Seed rewards error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
