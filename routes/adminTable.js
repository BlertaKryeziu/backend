const express = require("express");
const pool = require("../config/db");
//const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//create table

router.post("/create",  async (req, res) => {
  const { number, status, room_id } = req.body;


    try {
      const result = await pool.query(
            `INSERT INTO adminTable (number, status, room_id)
            VALUES ($1, $2, $3) RETURNING * `,
            [number, status || "available", room_id || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

//update
router.put("/update/:editTableId", async (req, res) => {
    const { editTableId } = req.params;
    const {number, status, room_id} = req.body;

    try {
        const result = await pool.query(
            `UPDATE adminTable SET number = $1, status = $2, room_id = $3 WHERE id = $4 RETURNING *`,
            [number, status, room_id, editTableId]
        );

        if(result.rowCount === 0){
            return res.status(404).json({message: "Table not found. "});
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

//GET
router.get("/",  async (req, res) => {
  const result = await pool.query("SELECT * FROM adminTable ORDER BY id");
  res.json(result.rows);
});

//delete
router.delete("/delete/:id",  async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query("DELETE FROM adminTable WHERE id = $1", [id]);
        res.json({message: "Table deleted successfully."});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;