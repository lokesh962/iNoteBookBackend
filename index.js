const connectmongo=require('./db');
const express = require('express')
var cors = require('cors')
require('dotenv').config();
const BASE_URL=process.env.BASE_URL


connectmongo();
const app = express()
app.use(cors())
const port = 5000

app.use(express.json());
//avilable routes

app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNoteBook App listening on port ${BASE_URL}`)

  // console.log(`iNoteBook App listening on port ${BASE_URL}`)
})



