const express = require('express');
const router = express.Router();

const products = [
  { id: 1, name: 'Laptop',  price: 999 },
  { id: 2, name: 'Monitor', price: 299 }
];

router.get('/', (req, res) => {
  res.json({ products });
});

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});

module.exports = router;
