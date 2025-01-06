const mysql = require('mysql2/promise');


const sqlDatabase = mysql.createPool({
    host:"srv1021.hstgr.io",
    user:"u627331871_System",
    password:"System321#",
    database:"u627331871_TaskMangSys"
   
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