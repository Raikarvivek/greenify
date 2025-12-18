import mongoose from 'mongoose'

export interface IUserReward extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  rewardId: mongoose.Types.ObjectId
  pointsSpent: number
  voucherCode: string
  status: 'active' | 'used' | 'expired'
  redeemedAt: Date
  usedAt?: Date
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

const UserRewardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rewardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reward',
    required: true,
  },
  pointsSpent: {
    type: Number,
    required: true,
    min: 1,
  },
  voucherCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  status: {
    type: String,
    enum: ['active', 'used', 'expired'],
    default: 'active',
  },
  redeemedAt: {
    type: Date,
    default: Date.now,
  },
  usedAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
})

// Index for efficient queries
UserRewardSchema.index({ userId: 1, status: 1 })
UserRewardSchema.index({ voucherCode: 1 })
UserRewardSchema.index({ expiresAt: 1 })

// Generate unique voucher code
UserRewardSchema.pre('save', function(next) {
  if (!this.voucherCode) {
    this.voucherCode = 'GREEN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase()
  }
  next()
})

export default mongoose.models.UserReward || mongoose.model<IUserReward>('UserReward', UserRewardSchema)
