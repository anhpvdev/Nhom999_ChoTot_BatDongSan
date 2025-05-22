const express = require('express');
const path = require('path');
const app = express();
const PORT = 8081;
const cors = require('cors');
app.use(cors());
app.use(express.static(__dirname));

// Route trang chủ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'search.html'));
});

app.listen(PORT, () => {
  console.log(`Giao diện tìm kiếm chạy tại http://localhost:${PORT}`);
});