const express = require('express');
const path = require('path');
const app = express();
const PORT = 8081;
const cors = require('cors');
app.use(cors());

// Dùng để phục vụ file tĩnh (CSS/JS nếu có)
app.use(express.static(path.join(__dirname, 'public')));

// Route trang chủ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'seach.html'));
});

app.listen(PORT, () => {
  console.log(`Giao diện tìm kiếm chạy tại http://localhost:${PORT}`);
});
