const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
     userId: {
          type: String,
          required: true,
          unique: true
     },
     username: {
          type: String,
          required: true,
          unique: true,
          minlength: 3,
          maxlength: 30,
          trim: true,
     },
     email: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
          trim: true,
          match: /.+\@.+\..+/
     },
     password: {
          type: String,
          required: true,
          minlength: 6,
          select: false,
     },
     createdAt: {
          type: Date,
          default: Date.now
     }
});

userSchema.pre('save', async function (next) {
     if (!this.isModified('password')) return next();
     const salt = await bcrypt.genSalt(10);
     this.password = await bcrypt.hash(this.password, salt);
     next();
});

userSchema.methods.comparePassword = function (enteredPassword) {
     return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);