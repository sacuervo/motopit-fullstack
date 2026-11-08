const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const conexion = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado correctamente');
    console.log('Base de datos: ', conexion.connection.name);
  } catch (error) {
    console.error('Error al conectar con MongoDB: ', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;
