const Moto = require('../models/moto.model.js');

const createMoto = async (req, res) => {
  try {
    const { placa, marca, modelo, kilometraje } = req.body;

    const newMoto = new Moto({
      placa,
      marca,
      modelo,
      kilometraje,
      user: req.user.id,
    });
    await newMoto.save();

    res.status(201).json(newMoto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMotos = async (req, res) => {
  try {
    const motos = await Moto.find({ user: req.user.id });
    res.status(200).json(motos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMotoById = async (req, res) => {
  try {
    const moto = await Moto.findOne({ _id: req.params.id, user: req.user.id });

    if (!moto) {
      return res.status(404).json({ message: 'Moto no encontrada' });
    }

    res.status(200).json(moto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMoto = async (req, res) => {
  try {
    const { placa, marca, modelo, kilometraje } = req.body;

    const moto = await Moto.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { placa, marca, modelo, kilometraje },
      { returnDocument: 'after', runValidators: true },
    );

    if (!moto) {
      return res.status(404).json({ message: 'Moto no encontrada' });
    }

    res.status(200).json(moto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMoto = async (req, res) => {
  try {
    const moto = await Moto.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!moto) {
      return res.status(404).json({ message: 'Moto no encontrada' });
    }

    res.status(200).json({ message: 'Elemento eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createMoto, getMotos, getMotoById, updateMoto, deleteMoto };
