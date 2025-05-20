# Data Crawling (Chợ tốt - Bất động sản)

## 📌 Mục tiêu

Dự án này được xây dựng nhằm thu thập dữ liệu từ website chotot.com(có API), xử lý và lưu trữ vào cơ sở dữ liệu thông qua chuỗi các container Docker. Người dùng có thể trigger quá trình cào dữ liệu một cách thủ công hoặc theo chu kì được thiết lập. Hệ thống cũng cung cấp giao diện Web và API để người dùng tìm kiếm và truy xuất dữ liệu.

---

### Các thành phần chính:
| Thành phần | Mô tả |
|-----------|------|
| **data_craw** | Gửi request đến API để lấy dữ liệu sau đó lưu vào data.json, có thể chạy theo lịch cố định hoặc thiết lập thời gian. |
| **data.json (JSON Files)** | Nơi lưu dữ liệu cào được từ data_craw ở định dạng JSON. |
| **data_ingestion** | Đọc dữ liệu từ data.json, khi có dữ liệu mới thì insert vào database. |
| **mysql_api** | Cung cấp các api để tương tác đến Database. |
| **Web_Page** | Giao diện người dùng để tìm kiếm và hiển thị thông tin bất động sản. |
| **mysql** | Cơ sở dữ liệu bất động sản, lưu trữ dữ liệu bất động sản đã xử lý. |

---

## 🚀 Cách triển khai

### Yêu cầu:

- Docker
- Git

### Các bước:

```bash
# 1. Clone repo
git https://github.com/anhpvdev/Nhom999_ChoTot_BatDongSan
cd Nhom999_ChoTot_BatDongSan

# 2. Khởi chạy hệ thống
docker-compose up --build