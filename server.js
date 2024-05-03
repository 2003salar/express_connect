const express = require('express');
const app = express();
require('dotenv').config();


app.get('/', (req, res) => {
    res.status(200).json({success: true, message: 'Worked Again'});
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});