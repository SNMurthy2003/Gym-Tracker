const express = require('express');
const router = express.Router();

const DEFAULT_USERNAME = "Admin";
const DEFAULT_PASSWORD = "gym123";

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
    return res.json({ success: true, message: "Login successful" });
  } else {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }
});

module.exports = router;
