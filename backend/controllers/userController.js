import {genSalt, hash} from 'bcrypt';

const saltRounds = 10;

export async function postUser(req, res) {
    const { username, password } = req.body;
  
    try {
      // Generar un salt y hashear la contraseña
      const salt = await genSalt(saltRounds);
      const hashedPassword = await hash(password, salt);
  
      // Guardar el username y la contraseña hasheada en tu base de datos
      // ...
  
      res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
}
  