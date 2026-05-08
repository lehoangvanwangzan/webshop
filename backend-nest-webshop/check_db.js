const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const [rows] = await connection.execute('DESCRIBE shop_products');
  console.log(JSON.stringify(rows, null, 2));
  await connection.end();
}

check().catch(console.error);
