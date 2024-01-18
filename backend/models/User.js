import { Schema as _Schema, model } from 'mongoose';
import bcrypt from 'bcrypt'; 


const Schema = _Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'Team'
  }]
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


const User = model('User', userSchema);

export default User;
