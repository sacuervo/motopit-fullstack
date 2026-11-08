require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/db.js');
const authRoutes = require('./routes/auth.routes.js');
const motoRoutes = require('./routes/moto.routes.js');

const app = express();

conectarDB();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API de MotoPit funcionando' });
});

app.use('/api/auth', authRoutes);
app.use('/api/motos', motoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http:localhost:${PORT}`);
});
