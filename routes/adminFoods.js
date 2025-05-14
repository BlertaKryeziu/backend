const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

//Get
router.get("/", authMiddleware, async (req, res) => {
    const result = await pool.query("SELECT * FROM foods ORDER BY id");
    res.json(result.rows);
});

//Create
router.post("/create", authMiddleware, async (req, res) =>{
    const { name, image} = req.body;
    const result = await pool.query("INSERT INTO foods (name, image) VALUES ($1, $2) RETURNING*",
        [name,image]);
        res.status(201).json(result.rows[0]);
});

//Update
router.put("/update/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, image} = req.body; 
    const result = await pool.query("UPDATE foods SET name =$1, image = $2 WHERE id = $3 RETURNING*",
        [name, image, id]
    );
    res.json(result.rows[0]);
});

//Delete
router.delete("/delete/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM foods WHERE id = $1", [id]);
    res.json({message: "Foods deleted"});
});

module.exports = router;