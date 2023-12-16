import Team from '../models/Team.js';
import User from '../models/User.js';


export async function getTeams(req, res) {
    try {
        const teams = await Team.find();
        res.json(teams);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function postTeams(req, res) {
    const { name, members } = req.body;

    try {
        const newTeam = await Team.create({ name, members });
        console.log('newTeam');
        res.status(201).json(newTeam);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
}
export async function putTeams(req, res) {
    const teamId = req.params.id;
  const { name, members } = req.body;

  try {
    const updatedTeam = await Team.findByIdAndUpdate(
       teamId,
       { name, members },
       { new: true }
    ).populate('members');

     if (updatedTeam) {
       res.json(updatedTeam);
     } else {
       res.status(404).json({ error: 'Team not found' });
    }
    console.log('updatedTeam');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function deleteTeams(req, res) {
    const teamId = req.params.id;

  try {
    const deletedTeam = await Team.findByIdAndDelete(teamId).populate('members');

    if (deletedTeam) {
      res.json({ message: 'Team deleted successfully', deletedTeam });
    } else {
      res.status(404).json({ error: 'Team not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}