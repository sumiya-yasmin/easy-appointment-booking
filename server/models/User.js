const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must be less than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Invalid Email Format',
      },
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      index: true,
      trim: true,
      validate: {
        validator: (value) => /^\+[1-9]\d{1,14\$/.test(value),
        message:
          'Mobile number must be in international format (e.g., +8801234567)',
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      unique: true,
      validate: {
        validator: (value) => {
          const hasUppercase = /[A-Z]/.test(value);
          const hasLowercase = /[a-z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          const hasSpecial = /[^A-Za-z0-9]/.test(value);
          return hasUppercase && hasLowercase && hasNumber && hasSpecial;
        },
        message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
      },
    profileImage: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password before saving

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})

// Method to compare password

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.comparePassword(candidatePassword, this.password)
};
const User = mongoose.model('User', UserSchema);
module.exports = User;
