const express = require("express");
const pool = require("../config/db");
const router = express.Router();

//Get all waiters
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM usersrestaurant WHERE role = 'waiter' ORDER BY id" );
        res.json(result.rows);
    } catch (error) {
        console.log("Ka ndodhur nje gabim:" , error);
        res.status(500).json({error: "Gabim serveri gjate marrjes se kamariereve. "});

    }
});

//Create a new waiter
router.post("/create", async (req, res) => {
      console.log("POST /create body:", req.body); // Kjo të ndihmon të shohësh çfarë po të vjen

    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ error: "Te plotesohent te gjitha fushat. "});
    }

    try {
        const result = await pool.query(
            " INSERT INTO usersrestaurant (name, email, password, role) VALUES ($1, $2, $3, 'waiter') RETURNING *",
            [name, email, password]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log("Gabim gjate krijimit", error);
        res.status(500).json({error: "Gabim serveri gjate krijimit. "});
    }
});

//update
router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const {name, email, password, role} = req.body;

    if(!name || !email || !password ) {
        return res.status(400).json({error: "Te gjitha fushat te plotesohen."});
    }

    try {
        const result = await pool.query(
  "UPDATE usersrestaurant SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
  [name, email, password, id]
);

        if(result.rowCount === 0) {
            return res.status(404).json({Message: "Kamarieri nuk u gjet. "});
        }

        res.json(result.rows[0]);
    } catch (error) {
         console.error("Gabim gjate perditesimit: ", error);
        res.status(500).json({error: "Gabim serveri gjate perditesimit. "});
    }
});

//Delete 
router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(  "DELETE FROM usersrestaurant WHERE id = $1 AND role = 'waiter'", [id]);

        if(result.rowCount === 0){
            return res.status(404).json({message: "Kamarieri nuk u gjet "});
        }

        res.json({message: "Kamarieri u fshi me sukses. "});
    } catch (error) {
        console.error("Gabim gjate fshirjes:", error);
        res.status(500).json({error: "Gabim serveri gjate fshirjes. "});
    }
});

module.exports = router;