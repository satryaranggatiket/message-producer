const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const refund = require('./src/modules/refund');
const ResponseFormatter = require('./src/middlewares/ResponseFormatter.js');
const mongoConfig = require('./src/configs/mongo.js');

app.use(cors());
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(ResponseFormatter());

app.use('/refund', refund);

let port = 3010;
app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});