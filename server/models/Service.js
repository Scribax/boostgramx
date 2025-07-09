const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Instagram Followers',
      'Instagram Likes',
      'Instagram Views',
      'Instagram Comments',
      'Instagram Stories',
      'TikTok Followers',
      'TikTok Likes',
      'TikTok Views',
      'YouTube Subscribers',
      'YouTube Views',
      'YouTube Likes',
      'Facebook Likes',
      'Facebook Followers',
      'Twitter Followers',
      'Twitter Likes'
    ]
  },
  platform: {
    type: String,
    required: true,
    enum: ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter']
  },
  type: {
    type: String,
    required: true,
    enum: ['followers', 'likes', 'views', 'comments', 'subscribers', 'stories']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  minOrder: {
    type: Number,
    required: true,
    min: 1
  },
  maxOrder: {
    type: Number,
    required: true,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  quality: {
    type: String,
    enum: ['Premium', 'High', 'Medium', 'Standard'],
    default: 'Standard'
  },
  speed: {
    type: String,
    enum: ['Instant', 'Fast', 'Medium', 'Slow'],
    default: 'Medium'
  },
  guarantee: {
    type: String,
    enum: ['Lifetime', '365 Days', '180 Days', '90 Days', '30 Days', 'No Guarantee'],
    default: '30 Days'
  },
  features: [{
    type: String,
    trim: true
  }],
  apiServiceId: {
    type: String,
    required: true
  },
  popularityScore: {
    type: Number,
    default: 0,
    min: 0
  },
  totalOrders: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento
serviceSchema.index({ category: 1, platform: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ popularityScore: -1 });
serviceSchema.index({ price: 1 });

module.exports = mongoose.model('Service', serviceSchema);
