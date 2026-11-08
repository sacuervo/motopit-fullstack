const { body } = require('express-validator');

const registerValidator = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 3 })
    .withMessage('El nombre debe tener mínimo 3 caracteres'),
  body('email')
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Debes enviar un email válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'La contraseña debe tener mínimo 8 caracteres, mayúsculas, minúsculas, números y un carácter especial',
    ),
];

const loginValidator = [
  body('email').notEmpty().withMessage('El email es obligatorio'),
  body('password').notEmpty().withMessage('El password es obligatorio'),
];

module.exports = { registerValidator, loginValidator };
