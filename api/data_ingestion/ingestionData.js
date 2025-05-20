const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const filePath = "../data.json";

fs.writeFileSync(filePath,'[]', 'utf-8');
// Lấy trạng thái ban đầu của file JSON
var oldData = readJSONFile(filePath);
console.log('Bắt đầu theo dõi file JSON...');

// Theo dõi thay đổi file JSON
fs.watchFile(filePath, (curr, prev) => {
    if (curr.mtimeMs !== prev.mtimeMs) {
        const newData = readJSONFile(filePath);
        const newRows = getNewRows(oldData, newData);

        oldData = newData; // Cập nhật oldData = dữ liệu mới

        if(newRows.length == 0) return console.log('Không có dữ liệu mới nào.');

        return insertToDB(newRows);
    }
});

function insertToDB(data) {
    console.log(`có ${data.length} dòng dữ liệu mới, đang insert vào DB...`);

    // Xử lý dữ liệu trước khi gọi API
    const values = data.map(item => [
        item.id,
        item.name,
        item.info,
        item.price,
        item.street,
        item.image
    ]);

    //call insert api đến mysql_api
    axios.post('http://mysql_api:8080/insert-multiple', { data: values })
    .then(res => console.log(res.data))
    .catch(err => console.error('Lỗi:', err.message));
}


// hàm đọc file JSON
function readJSONFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        console.error('Lỗi khi đọc file JSON:', err);
        return [];
    }
}


// hàm so sánh 2 mảng để tìm ra các dòng mới
function getNewRows(oldArray, newArray) {
    try {
        const oldSet = new Set(oldArray.map(item => JSON.stringify(item)));
        return newArray.filter(item => !oldSet.has(JSON.stringify(item)));
    } catch (error) {
        console.error('Lỗi khi so sánh mảng:', error);
        return [];
    }
}
