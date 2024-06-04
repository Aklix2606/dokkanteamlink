import { pool } from '../utils/connectDB.js';
export async function invokeRandomCharacter(req, res) {
  const correu = req.userId;

  try {
    // Obtener un personaje aleatorio de la tabla practica.personatge
    const queryRandomCharacter = 'SELECT nom FROM practica.personatge ORDER BY RANDOM() LIMIT 1';
    const { rows: characterRows } = await pool.query(queryRandomCharacter);

    if (characterRows.length === 0) {
      return res.status(404).json({ error: 'No characters available' });
    }

    const randomCharacter = characterRows[0].nom;

    // Asignar el personaje al jugador
    const assignQuery = `
      INSERT INTO practica.personatgeinvocat (correu, nom)
      VALUES ($1, $2)
      ON CONFLICT (correu, nom) DO NOTHING
    `;
    await pool.query(assignQuery, [correu, randomCharacter]);

    res.status(200).json({ message: 'Character invoked successfully', character: randomCharacter });
  } catch (error) {
    console.error('Error invoking character:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
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
export async function assignObjectToCharacter(req, res) {
  const { nom, numobj } = req.body;
  const correu = req.userId;

  if (!nom || !numobj) {
      return res.status(400).json({ error: 'Missing character name or object number' });
  }

  try {

      // Asignar el objeto al personaje
      const assignQuery = `
          UPDATE practica.personatgeinvocat
          SET numobj = $1
          WHERE nom = $2 AND correu = $3
      `;
      await pool.query(assignQuery, [numobj, nom, correu]);

      res.status(200).json({ message: 'Object assigned to character successfully' });
  } catch (error) {
      console.error('Error assigning object to character:', error);
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