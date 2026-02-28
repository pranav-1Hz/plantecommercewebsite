const express = require('express');

const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const sequelize = require('./config/db');

// Import models so they are registered before sync
require('./models/User');
require('./models/Admin');
require('./models/Nursery');
require('./models/Feedback');
require('./models/Contact');

// Database Connection
sequelize
  .sync({ alter: true })
  .then(() => console.log('MySQL Connected'))
  .catch(err => console.log('Sequelize Sync Error: ', err));

// Routes
app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Plant Shop API Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
