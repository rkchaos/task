const mysql = require('mysql2/promise');


const sqlDatabase = mysql.createPool({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
   
});


async function testConnection() {
    try {
        const connection = await sqlDatabase.getConnection();
        console.log("Database connected successfully!");
        connection.release(); 
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
    }
}

testConnection();

module.exports=sqlDatabase