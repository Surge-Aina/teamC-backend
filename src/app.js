// this is just a skeleton

// to use the dependencies below, run these in terminal:
// npm install express mongoose dotenv cors
// npm install nodemon --save-dev

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // <-- import MongoDB connector
const authRoutes = require('./routes/authRoutes'); // <-- import routes
const userRoutes = require('./routes/userRoutes');


dotenv.config();
connectDB(); // <-- connect to MongoDB

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;


// Create a .env file in the backend folder
// add the MONGO_URI string to .env 
// make sure you add .env file to .gitignore
app.use('/api/auth', authRoutes); // ✅ enables /signup and /login routes
app.use('/api/users', userRoutes); 
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));