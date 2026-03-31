import mongoose, { Document, Schema } from 'mongoose';

export interface IPackage extends Document {
  title: string;
  city: string;
  tier: 'Luxury' | 'Mid-Range' | 'Budget';
  destination: string;
  description: string;
  price: number;
  duration: string;
  images: string[];
  image: string;
  included: string[];
  restaurants: {
    name: string;
    description: string;
    cuisine?: string;
  }[];
  attractions: {
    name: string;
    description: string;
  }[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const packageSchema = new Schema<IPackage>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      minlength: [1, 'City cannot be empty'],
    },
    tier: {
      type: String,
      enum: ['Luxury', 'Mid-Range', 'Budget'],
      required: [true, 'Tier is required'],
    },
    destination: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '',
    },
    included: {
      type: [String],
      default: [],
    },
    restaurants: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        cuisine: { type: String, default: '' },
      },
    ],
    attractions: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Package = mongoose.model<IPackage>('Package', packageSchema);
