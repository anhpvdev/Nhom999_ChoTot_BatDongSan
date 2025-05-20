CREATE DATABASE batdongsan; 
USE batdongsan; 

CREATE TABLE `danhsach` (
  `id` BIGINT PRIMARY KEY,
  `name` varchar(255) DEFAULT NULL,
  `info` text DEFAULT NULL,
  `price` bigint(20) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
