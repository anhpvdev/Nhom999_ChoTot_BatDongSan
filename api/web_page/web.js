const express = require('express');
const path = require('path');
const app = express();
const PORT = 8081;
const cors = require('cors');
const axios = require('axios');
app.use(cors());
app.use(express.static(__dirname));

// Route trang chủ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'search.html'));
});

app.get('/find', async (req, res) => {
  try{
    const { query } = req.query;
    if(!query) return res.status(400).json({status:'error', message: 'Thiếu tham số tìm kiếm'});

    const response = await axios.get(`http://mysql_api:8080/find`, {
      params: { query: query }
    });

    return res.status(200).json(response.data);
  }catch(err) {
    console.error('Lỗi tìm kiếm:', err.message);
    return res.status(500).json({status:'error',message: 'Lỗi khi tìm kiếm dữ liệu' });
  }
});

app.listen(PORT, () => {
  console.log(`Giao diện tìm kiếm chạy tại http://localhost:${PORT}`);
});