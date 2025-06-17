// this is just a skeleton

// to use the dependencies below, run these in terminal:
// npm install express mongoose dotenv cors
// npm install nodemon --save-dev

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;


// Create a .env file in the backend folder
// add the MONGO_URI string to .env 
// make sure you add .env file to .gitignore

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));