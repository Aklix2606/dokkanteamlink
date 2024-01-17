import {genSalt, hash} from 'bcrypt';
import User from '../models/User.js';
import mongoose from 'mongoose';

const saltRounds = 10;

export async function getUserById(req, res) {
  const { userId } = req.params;

  try {
    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving user' });
  }
}

export async function updateUser(req, res) {
  const { userId } = req.params;
  const { username, password, teamIds } = req.body;

  try {
    const updateData = {};

    if (username) {
      updateData.username = username;
    }

    if (password) {
      const salt = await genSalt(saltRounds);
      updateData.password = await hash(password, salt);
    }

    if (teamIds) {
      updateData.teams = teamIds.map(id => mongoose.Types.ObjectId(id));
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating user' });
  }
}

export async function postUser(req, res) {
  const { username, password } = req.body;

  try {
    const newUser = new User({
      username,
      password, // No need to hash here, as it's handled by the pre-save hook
      teams: [] // Assuming teams is an array of team IDs
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export async function deleteUser(req, res) {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
}
  