const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// =============== REGISTER ===============
const registerUser = async (req, res) => {
  try {
    const { name, email, password} = req.body;
    const role = req.body.role.toLowerCase();
    console.log("Request Data:", req.body);

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Please fill in all fields." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    const newUser = await pool.query(
      "INSERT INTO usersrestaurant (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error during registration." });
  }
};

// =============== LOGIN ===============
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please enter both email and password." });
    }

    const user = await pool.query("SELECT * FROM usersrestaurant WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
};

module.exports = { registerUser, loginUser };
