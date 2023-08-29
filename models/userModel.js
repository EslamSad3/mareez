const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,
    password: {
      type: String,
      required: [true, 'password is required'],
      minlenght: [6, 'Too Short password'],
    },
    role: {
      typeof: String,
      enum: ['admin', 'user', 'seller'],
      default: 'user',
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('user', userSchema);
