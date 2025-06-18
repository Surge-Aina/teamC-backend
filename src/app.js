// this is just a skeleton

// to use the dependencies below, run these in terminal:
// npm install express mongoose dotenv cors cookie-parser
// npm install nodemon --save-dev

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db'); // <-- import MongoDB connector
const authRoutes = require('./routes/authRoutes'); // <-- import routes
const userRoutes = require('./routes/userRoutes');
const managerRoutes = require('./routes/managerRoutes');
const workerRoutes = require('./routes/workerRoutes');
const User = require('./models/User'); // Needed for background job

dotenv.config();
connectDB(); // <-- connect to MongoDB

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes); // ✅ enables /signup and /login routes
app.use('/api/users', userRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/workers', workerRoutes);


setInterval(async () => {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
    const result = await User.updateMany(
      { lastActive: { $lt: tenMinutesAgo }, isActive: true },
      { isActive: false }
    );
    if (result.modifiedCount > 0) {
      console.log(`Auto-deactivated ${result.modifiedCount} users`);
    }
  } catch (err) {
    console.error('Error in auto-deactivation task:', err.message);
  }
}, 5 * 60 * 1000); // Every 5 minutes

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));