const express = require('express');
const router = express.Router();
const { updateTableStatus } = require('../controllers/tableController');
const {
    createOrder,
    getOrders,
    updateOrder,
    deleteOrder,
    updateOrderStatus 
  } = require('../controllers/ordercontroller');
  

// krijimi i nje porosie
router.post('/', createOrder);

// me i marr porosit per nje tavoline
router.get('/:tableId', getOrders);

// me bo update nje porosi
router.put('/:orderId', updateOrder);

// me fshi nje porosi
router.delete('/:orderId', deleteOrder);

// përditëso statusin e porosisë
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
