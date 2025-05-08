const tableModel = require('../models/Table');

// Krijo një tavolinë të re
const createTable = async (req, res) => {
  try {
    const { table_name, room_id } = req.body;
    const newTable = await tableModel.createTable(table_name, room_id);
    res.status(201).json(newTable);
  } catch (error) {
    res.status(500).json({ message: 'Error creating table', error });
  }
};

// Merr tavolinat
const getTables = async (req, res) => {
  try {
    const tables = await tableModel.getTables();
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tables', error });
  }
};

// Përditësimi i një tavoline ekzistuese
const updateTable = async (req, res) => {
  const { id } = req.params; // Merrni ID-në nga URL
  const { table_name, room_id, status } = req.body;
  try {
    const updatedTable = await tableModel.updateTable(id, table_name, room_id, status);
    res.status(200).json(updatedTable);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Gabim në server');
  }
};


// Fshirja e një tavoline sipas ID-së
const deleteTable = async (req, res) => {
  const { id } = req.params; // Merrni ID-në nga URL
  try {
    const deletedTable = await tableModel.deleteTable(id);
    res.status(200).json(deletedTable);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Gabim në server');
  }
};


exports.updateTableStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const table = await tableModel.updateTableStatus(id, status);
    res.json(table);
  } catch (err) {
    console.error('Error updating table status:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTable, getTables, updateTable, deleteTable, };
