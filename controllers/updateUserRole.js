// adminController
const pool = require("../config/db");

const updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    if (!userId || !newRole) {
      return res
        .status(400)
        .json({ error: "Please provide both userId and newRole." });
    }

    const updatedUser = await pool.query(
      "UPDATE usersrestaurant SET role = $1 WHERE id = $2 RETURNING *",
      [newRole, userId]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res
      .status(200)
      .json({
        message: "User role updated successfully.",
        user: updatedUser.rows[0],
      });
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({ error: "Server error during role update." });
  }
};

module.exports = { updateUserRole };
