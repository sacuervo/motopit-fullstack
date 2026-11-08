const mongoose = require('mongoose');

const motoSchema = new mongoose.Schema(
  {
    placa: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    marca: {
      type: String,
      required: true,
      trim: true,
    },
    modelo: {
      type: String,
      required: true,
      trim: true,
    },
    kilometraje: {
      type: Number,
      required: true,
      min: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Moto', motoSchema);
