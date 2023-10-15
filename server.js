require('dotenv').config();
require('./config/DB_Config');
const express = require('express');
const router = require('./router/route');
const app = express();
app.use(express.json());

app.use('/', router);

app.listen(process.env.PORT, (err)=>{
    if (!err) {
        console.log(`Server is connected on port ${process.env.PORT}`);
    } else {
        console.log(err);
    }
})