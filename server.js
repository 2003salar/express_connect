const express = require('express');
const app = express();
const expressConnectRouter = require('./routers/express_connect');
require('dotenv').config();

app.use('/', expressConnectRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});