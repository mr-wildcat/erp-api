const mysql = require('mysql');

//local mysql db connection
const connection = mysql.createConnection({
    host     : '127.0.0.1',
    port     : '8889',
    user     : 'root',
    password : 'root',
    database : 'ERP_AERO'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
