const mongoose = require('mongoose');

const DB_URL =
    process.env.DB_URL ||
    'mongodb+srv://52100997:qLhOOJFaCnZdrDh1@cluster0.akmisvu.mongodb.net/?retryWrites=true&w=majority';
// Kết nối đến MongoDB
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
module.exports = db;
