const { body, param } = require('express-validator');

const motoValidator = [
  body('placa')
    .notEmpty()
    .withMessage('La placa es obligatoria')
    .isLength({ min: 5, max: 6 })
    .withMessage('La placa debe tener entre 5 y 6 caracteres'),
  body('marca').notEmpty().withMessage('La marca es obligatoria'),
  body('modelo').notEmpty().withMessage('El modelo es obligatorio'),
  body('kilometraje')
    .notEmpty()
    .withMessage('El kilometraje es obligatorio')
    .isInt({ min: 0 })
    .withMessage('El kilometraje debe ser un número entero mayor o igual a 0'),
];

const idValidator = [
  param('id').isMongoId().withMessage('El id de la moto no es válido'),
];

module.exports = { motoValidator, idValidator };
