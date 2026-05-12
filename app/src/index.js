const express = require('express');
const helmet = require('helmet');

const healthRouter = require('./routes/health');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

const app = express();

app.use(helmet());
app.use(express.json());

app.use('/health', healthRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);

// Only start listening if this file is run directly
// This lets tests import app without binding to a port
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`SecureShield API running on port ${PORT}`);
  });
}

module.exports = app;
