const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const filePath = "../data.json";
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: 'mysql',
  user: 'root',
  password: 'psw123',
  database: 'batdongsan',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

//api lấy toàn bộ dữ liệu db
app.get('/alldata', async (req, res) => {
  try{
    const [BDS] = await db.execute('SELECT * FROM danhsach ORDER BY created_at DESC');

    return res.status(200).json({status:'success', data: BDS});
  }catch(err) {
    console.error('Lỗi khi lấy dữ liệu:', err.message);
    res.status(500).json({status:'error',message: 'Lỗi khi lấy dữ liệu' });
  }
});

//api xóa toàn bộ dữ liệu db
app.delete('/alldata', async (req, res) => {
  try{
    fs.writeFileSync(filePath,'[]', 'utf-8'); // xoa toan bo du lieu json file
    const [result] = await db.execute('DELETE  FROM danhsach');

    return res.status(200).json({status:'success', affectedRows: result.affectedRows});
  }catch(err) {
    console.error('Lỗi khi lấy dữ liệu:', err.message);
    res.status(500).json({status:'error',message: 'Lỗi khi xóa dữ liệu' });
  }
});

//api tìm kiếm
app.get('/find', async (req, res) => {
  try{
    const { query } = req.query;
    if(!query) return res.status(400).json({status:'error', message: 'Thiếu tham số tìm kiếm'});

    const searchQuery = `SELECT * FROM danhsach WHERE name LIKE ? ORDER BY id DESC`;
    const [BDS] = await db.execute(searchQuery, [`%${query}%`]);

    return res.status(200).json({status:'success', data: BDS});
  }catch(err) {
    console.error('Lỗi tìm kiếm:', err.message);
    return res.status(500).json({status:'error',message: 'Lỗi khi insert dữ liệu' });
  }
});

//api insert dữ liệu
app.post('/insert-multiple', async (req, res) => {
  try{
    const { data } = req.body; //data đầu vào là 1 mảng 2 chiều các dòng dữ liệu đã được xử lý
    const insertQuery = `INSERT IGNORE INTO danhsach(id, name, info, price, street, image) VALUES ?`;
    const [BDS] = await db.query(insertQuery, [data]);
    if(BDS.affectedRows == 0) return res.status(200).json({status:'success', message: 'Không có dữ liệu mới'});
      
    return res.status(201).json({status:'success', message: `Insert thành công ${BDS.affectedRows} dòng`});
  }catch(err) {
    console.error('Lỗi insert:', err.message);
    res.status(500).json({status:'error',message: 'Lỗi khi insert dữ liệu' });
  }
});

app.listen(PORT, () => {
  console.log(`mysql_api đang chạy tại http://localhost:${PORT}`);
});