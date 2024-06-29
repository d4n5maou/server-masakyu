const express = require('express');
// const bodyParser = require('body-parser');
const {sequelize} = require('./models');
// const cors = require('cors');
const dotenv = require('dotenv');
const route = require('./routes');
const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use(cors);
app.use(route);


const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
