const pool = require('../config/db');

// Statuset e lejuara per nje porosi
const allowedStatuses = ['Pending', 'In Progress', 'Completed'];

// Krijimi i nje porosie të re
const createOrder = async (table_id, items, total_price, waiter_id) => {
  const query = `
    INSERT INTO orders (table_id, items, total_price, waiter_id, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;
  const values = [table_id, JSON.stringify(items), total_price, waiter_id, 'Pending'];
  const res = await pool.query(query, values);
  return res.rows[0];
};

// Marrja e te gjitha porosive per nje tavoline
const getOrders = async (tableId) => {
  const query = `SELECT * FROM orders WHERE table_id = $1`;
  const res = await pool.query(query, [tableId]);
  return res.rows;
};

// Funksion ndihmes per te kontrolluar ekzistencen e porosise
const findOrderById = async (orderId) => {
  const query = `SELECT * FROM orders WHERE id = $1`;
  const res = await pool.query(query, [orderId]);
  return res.rows[0];
};

// Perditsimi  i nje porosie me validim statusi
const updateOrder = async (orderId, items, total_price, status) => {
  const existingOrder = await findOrderById(orderId);
  if (!existingOrder) {
    throw new Error('Order not found');
  }
  if (!allowedStatuses.includes(status)) {
    throw new Error(`Invalid status. Allowed: ${allowedStatuses.join(', ')}`);
  }
  const query = `
    UPDATE orders
    SET items = $1,
        total_price = $2,
        status = $3
    WHERE id = $4
    RETURNING *`;
  const values = [JSON.stringify(items), total_price, status, orderId];
  const res = await pool.query(query, values);
  return res.rows[0];
};

// Fshirja e nje porosie 
const deleteOrder = async (orderId) => {
  const existingOrder = await findOrderById(orderId);
  if (!existingOrder) {
    throw new Error('Order not found');
  }
  const query = `DELETE FROM orders WHERE id = $1 RETURNING *`;
  const res = await pool.query(query, [orderId]);
  return res.rows[0];
};

module.exports = { createOrder, getOrders, updateOrder, deleteOrder };
