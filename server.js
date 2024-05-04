const express = require('express');
const app = express();
const expressConnectRouter = require('./routers/express_connect');
require('dotenv').config();

app.use('/', expressConnectRouter);

app.all('*', (req, res) => {
    res.status(404).json({success: false, message: 'Page not found'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});