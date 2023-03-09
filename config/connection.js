const { connect, connection } = require('mongoose');
require('dotenv').config();

const connectionString = process.env.MONGODB_URI || `mongodb+srv://root:M03211990n@cluster0.ztyyztn.mongodb.net/social_network_db`

connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection;