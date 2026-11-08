const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware.js');
const validateReq = require('../middlewares/validateReq.middleware.js');
const {
  motoValidator,
  idValidator,
} = require('../validators/moto.validator.js');
const {
  createMoto,
  getMotos,
  getMotoById,
  updateMoto,
  deleteMoto,
} = require('../controllers/moto.controller.js');

const router = express.Router();

router.post('/', authMiddleware, motoValidator, validateReq, createMoto);
router.get('/', authMiddleware, getMotos);
router.get('/:id', authMiddleware, idValidator, validateReq, getMotoById);
router.put(
  '/:id',
  authMiddleware,
  idValidator,
  motoValidator,
  validateReq,
  updateMoto,
);
router.delete('/:id', authMiddleware, idValidator, validateReq, deleteMoto);

module.exports = router;
