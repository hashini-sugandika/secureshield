const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob',   email: 'bob@example.com' }
];

router.get('/', (req, res) => {
  res.json({ users });
});

router.post('/',
  body('name').notEmpty().trim(),
  body('email').isEmail(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = { id: users.length + 1, ...req.body };
    users.push(user);
    res.status(201).json({ user });
  }
);

module.exports = router;
