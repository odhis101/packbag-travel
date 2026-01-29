import mongoose, { Document, Schema } from 'mongoose';

export interface IPackage extends Document {
  title: string;
  destination: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  included: string[];
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
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
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
    image: {
      type: String,
      default: '/placeholder.jpg',
    },
    included: {
      type: [String],
      default: [],
    },
    itinerary: [
      {
        day: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
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
