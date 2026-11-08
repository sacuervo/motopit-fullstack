const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        errors: [{ path: 'email', msg: 'El usuario ya está registrado' }],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nombre,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: { id: newUser._id, nombre: newUser.nombre, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'El usuario no existe' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: { id: user._id, nombre: user.nombre, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
