const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const cron = require('node-cron');
const crypto = require('crypto');
global.crypto = crypto;
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

var __config = {
  limit: 10,
  currentSchedule: '*/5 * * * *', // mặc định cào 5 phút 1 lần
}

var crawlJob; // Lưu lịch hiện tại

async function craw_data(){
  try{
    console.log('Cào dữ liệu lúc', new Date().toLocaleTimeString(), 'limit', __config.limit);
    var returnData = []
    var url = `https://gateway.chotot.com/v1/public/ad-listing?cg=1000&limit=${__config.limit}&protection_entitlement=true&key_param_included=true&region_v2=3017&area_v2=0&ward=0`;
    var response = await axios.get(url);
    var BDS = response.data?.ads || [];

    if(BDS.length == 0) return []

    for(let item of BDS){
      returnData.push(
        {
          id:item?.list_id,
          name:item?.subject,
          info:item?.body,
          price:item?.price,
          street:item?.street_name,
          image:item?.image,
        })
    }
    
    fs.writeFileSync('../data.json', JSON.stringify(returnData, null, 2), 'utf-8');
    return returnData
  }catch(error){
    console.error('Lỗi khi cào dữ liệu',error.message);
    return []
  }

}

// Hàm khởi tạo job hẹn giờ
function startCrawlJob(time){
 try{
   if (crawlJob) crawlJob.stop(); // Dừng job cũ nếu có
 
   crawlJob = cron.schedule(time, craw_data, {
     scheduled: true,
     timezone: "Asia/Ho_Chi_Minh",
   });
   
   __config.currentSchedule = time; //đặt lịch cào mới
   console.log(`Đã đặt lịch cào: "${time}"`);
 }catch(error){
  console.error(error.message);
 }
}

startCrawlJob(__config.currentSchedule);
craw_data()

// api cào datadata
app.get('/craw-data', async (req, res) => {
  try{
    const BDS  = await craw_data();
    if(BDS.length == 0)  return  res.status(500).json({ status:'error',message: 'Cào dữ liệu thất bại!' });
    
    return res.status(200).json({ status: 'success', data: BDS });
  }catch(error){
    console.error('Lỗi:', error.message);
    return res.status(500).json({ error: 'Không thể lấy dữ liệu' });
  }
});


//api thay đổi thời gian cào
app.put('/update-time', (req, res) => {
  try{
    const {time} = req.body;
    if(!time) return res.status(400).json({ error: 'Thiếu tham số time!' });
 
    const parsed = parseInt(time, 10);
    if(parsed <= 0) return res.status(400).json({ error: 'Giá trị time phải là số nguyên dương' });
 
    var cronTime = ''; // đặt thời gian cào theo phút
    var message = ''
    if(parsed < 60){
      cronTime = `*/${parsed} * * * *`; // đặt thời gian cào theo phút
      message = `${parsed} phút 1 lần`;
    }else{
      const hours = Math.floor(parsed / 60);
      cronTime = `0 */${hours} * * *`;// đặt thời gian cào theo giờ
      message = `${hours} giờ 1 lần`;
    }

    if(!cron.validate(cronTime)) return res.status(400).json({ error: 'Sai định dạng thời gian!' });

    startCrawlJob(cronTime);
    res.status(200).json({status:'success', message: `Đã cập nhật lịch mới: ${message}` });
  }catch(error){
    console.error('Lỗi:', error.message);
    return res.status(500).json({ error: 'Không thể cập nhật thời gian' });
  }
});

//api thay đổi limit
app.put('/update-limit', (req, res) => {
  try{
    const {limit} = req.body;
    if(!limit) return res.status(400).json({ error: 'Thiếu tham số limit!' });
  
    const parsed = parseInt(limit, 10);
    //check limit phải là số nguyên dương
    if(parsed <= 0 || parsed > 50) return res.status(400).json({ error: 'Giá trị limit phải là số nguyên dương và ko được lớn hơn 50!' });
  
    __config.limit = parsed;
    return res.status(500).json({status: 'success', message: `Đã cập nhật limit mới: limit = ${__config.limit}` });
  }catch(error){
    console.error('Lỗi:', error.message);
    return res.status(500).json({ error: 'Không thể cập nhật limit'});
  }
});

app.listen(PORT, () => {
  console.log(`Server cào data đang chạy tại http://localhost:${PORT}`);
});