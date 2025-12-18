import mongoose from 'mongoose'

export interface IActivity extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  type: 'recycling' | 'water_saving' | 'energy_saving' | 'transportation' | 'tree_planting' | 'waste_reduction'
  title: string
  description: string
  pointsEarned: number
  quantity?: number
  unit?: string
  verificationMedia: Array<{
    type: 'image' | 'video'
    url: string
    filename: string
    fileId?: string // ImageKit file ID
  }>
  location: {
    latitude: number
    longitude: number
    accuracy: number
    address: string
    timestamp: number
  }
  status: 'pending' | 'approved' | 'rejected'
  verifiedBy?: mongoose.Types.ObjectId
  verifiedAt?: Date
  rejectionReason?: string
  carbonSaved?: number
  submittedAt: Date
  createdAt: Date
  updatedAt: Date
}

const ActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['recycling', 'water_saving', 'energy_saving', 'transportation', 'tree_planting', 'waste_reduction'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  pointsEarned: {
    type: Number,
    default: 0,
    min: 0,
  },
  quantity: {
    type: Number,
    min: 0,
  },
  unit: {
    type: String,
    maxlength: 20,
  },
  verificationMedia: [{
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    fileId: {
      type: String, // ImageKit file ID
    },
  }],
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending', // All activities start as pending for verification
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  verifiedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
    maxlength: 500,
  },
  carbonSaved: {
    type: Number,
    min: 0,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

// Index for efficient queries
ActivitySchema.index({ userId: 1, createdAt: -1 })
ActivitySchema.index({ type: 1 })
ActivitySchema.index({ status: 1 })

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema)
