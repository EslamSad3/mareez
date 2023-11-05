const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    phone: {
      type: String,
      required: [true, 'Phone Number is required'],
      unique: true,
    },
    profileImg: String,
    password: {
      type: String,
      required: [true, 'password is required'],
      minlenght: [6, 'Too Short password'],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ['user', 'admin', 'seller'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
    // child referance (one to many) // one user to many products
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'product',
      }],

    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);



userSchema.pre('save', async function (next) {
  // Hashing Password
  if (!this.isModified('password')) return next(); // no need to hash password if it was NOT modified
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
module.exports = mongoose.model('user', userSchema);
