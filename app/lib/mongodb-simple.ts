import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let isConnected = false

async function dbConnectSimple() {
  if (isConnected) {
    return mongoose
  }

  try {
    console.log('Connecting to MongoDB (simple)...')
    const startTime = Date.now()
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
    
    const endTime = Date.now()
    console.log(`MongoDB connected in ${endTime - startTime}ms`)
    isConnected = true
    
    return mongoose
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    throw error
  }
}

export default dbConnectSimple
