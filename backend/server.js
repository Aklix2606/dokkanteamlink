const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Tu configuración personalizada del servidor aquí

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});






/*const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Función para conectar a la base de datos
async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Conectado a MongoDB");
        return client.db(); // Devuelve la instancia de la base de datos conectada
    } catch (error) {
        console.error("Error de conexión a MongoDB:", error);
        throw error;
    }
}

// Función para cerrar la conexión
async function closeDatabaseConnection() {
    try {
        await client.close();
        console.log("Conexión a MongoDB cerrada");
    } catch (error) {
        console.error("Error al cerrar la conexión a MongoDB:", error);
    }
}

module.exports = {
    connectToDatabase,
    closeDatabaseConnection,
};*/