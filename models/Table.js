// models/Table.js
const pool = require("../config/db");

// Krijo nje tavoline te re
const createTable = async (table_name, room_id) => {
  const query = `
    INSERT INTO tables (table_name, room_id, status)
    VALUES ($1, $2, $3)
    RETURNING *`;
  const values = [table_name, room_id, "Available"];
  const res = await pool.query(query, values);
  return res.rows[0];
};

// Merr te gjitha tavolinat
const getTables = async () => {
  const query = `SELECT * FROM tables`;
  const res = await pool.query(query);
  return res.rows;
};

// Perditeso nje tavoline ekzistuese
const updateTable = async (id, table_name, room_id, status) => {
  const query = `
    UPDATE tables
    SET table_name = $2,
        room_id    = $3,
        status     = $4
    WHERE id = $1
    RETURNING *`;
  const values = [id, table_name, room_id, status];
  const res = await pool.query(query, values);
  return res.rows[0];
};

// Fshi nje tavoline sipas ID
const deleteTable = async (id) => {
  const query = `DELETE FROM tables WHERE id = $1 RETURNING *`;
  const res = await pool.query(query, [id]);
  if (res.rows.length === 0) {
    throw new Error("Tabela me këtë ID nuk u gjet.");
  }
  return res.rows[0];
};

const updateTableStatus = async (id, status) => {
  const query = `
    UPDATE tables
    SET status = $1
    WHERE id = $2
    RETURNING *`;
  const res = await pool.query(query, [status, id]);
  return res.rows[0];
};

module.exports = { createTable, getTables, updateTable, deleteTable, updateTableStatus };
