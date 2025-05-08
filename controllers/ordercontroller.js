const {
  createOrder: createOrderModel,
  getOrders: getOrdersModel,
  updateOrder: updateOrderModel,
  deleteOrder: deleteOrderModel
} = require('../models/Order');

// Krijimi i një porosie
exports.createOrder = async (req, res) => {
  try {
    const { table_id, items, total_price, waiter_id } = req.body;
    const newOrder = await createOrderModel(
      table_id,
      items,
      total_price,
      waiter_id
    );
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Error creating order:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Marrja e porosive për një tavolinë
exports.getOrders = async (req, res) => {
  try {
    const { tableId } = req.params;
    const orders = await getOrdersModel(tableId);
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// perditsimi i nje porosie
exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params; // Merrni orderId nga URL
    const { items, total_price, status } = req.body; // Merrni të dhënat nga trupi i kërkesës

    const updatedOrder = await updateOrderModel(orderId, items, total_price, status);
    res.status(200).json(updatedOrder); // Kthejme perditesimin e porosisë
  } catch (err) {
    console.error('Error updating order:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fshirja e nje porosie
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    await deleteOrderModel(orderId);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error('Error deleting order:', err.message);
    if (err.message.includes('not found')) {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// perditsimi i statusit te porosis
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    
    const updated = await updateOrderModel(id, null, null, status);
    res.json(updated);
  } catch (err) {
    console.error('Error updating order status:', err.message);
    if (err.message.includes('not found')) {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
