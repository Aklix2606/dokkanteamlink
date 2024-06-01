/*import Team from '../models/Team.js';
import User from '../models/User.js';

export async function getTeams(req, res) {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).populate('teams');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function deleteTeam(req, res) {
  const { teamId } = req.params;
  const userId = req.userId;

  console.log(`Attempting to delete team with ID ${teamId} for user ${userId}`);

  try {
    const team = await Team.findOneAndDelete({ _id: teamId, owner: userId });
    if (!team) {
      console.log(`No team found with ID ${teamId} for user ${userId}`);
      return res.status(404).json({ error: 'Team not found or unauthorized' });
    }

    await User.findByIdAndUpdate(userId, { $pull: { teams: teamId } });

    console.log(`Team with ID ${teamId} deleted for user ${userId}`);
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
*/