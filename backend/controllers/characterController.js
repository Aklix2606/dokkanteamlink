import { pool } from '../utils/connectDB.js';

export async function getPersonatgeStatsByNom(req, res) {
  const { nom } = req.params;

  try {
    const query = 'SELECT * FROM practica.personatge WHERE nom = $1';
    const { rows } = await pool.query(query, [nom]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Personaje not found' });
    }

    const personaje = rows[0];
    res.json(personaje);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
/*import Character from '../models/Character.js';

export async function getCharacter(req, res) {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getCharacterById(req, res) {
  const { characterId } = req.params;

  
  if (!mongoose.Types.ObjectId.isValid(characterId)) {
    return res.status(400).json({ error: 'Invalid character ID' });
  }

  try {
    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    res.json(character);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
*/