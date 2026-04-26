/*
 * DATABASE SCHEMA
 *
 * CREATE TABLE users (
 *   id SERIAL PRIMARY KEY,
 *   name VARCHAR(100),
 *   email VARCHAR(150) UNIQUE,
 *   password_hash TEXT,
 *   role VARCHAR(20) DEFAULT 'student',
 *   created_at TIMESTAMP DEFAULT NOW()
 * );
 *
 * CREATE TABLE attendance (
 *   id SERIAL PRIMARY KEY,
 *   user_id INT REFERENCES users(id),
 *   date DATE,
 *   status VARCHAR(20) DEFAULT 'present',
 *   tokens_awarded INT DEFAULT 10,
 *   created_at TIMESTAMP DEFAULT NOW(),
 *   UNIQUE(user_id, date)
 * );
 *
 * CREATE TABLE token_wallet (
 *   id SERIAL PRIMARY KEY,
 *   user_id INT REFERENCES users(id) UNIQUE,
 *   balance INT DEFAULT 0,
 *   updated_at TIMESTAMP DEFAULT NOW()
 * );
 *
 * CREATE TABLE redemptions (
 *   id SERIAL PRIMARY KEY,
 *   user_id INT REFERENCES users(id),
 *   tokens_used INT,
 *   reward_type VARCHAR(100),
 *   redeemed_at TIMESTAMP DEFAULT NOW()
 * );
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'attendance_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

module.exports = pool;
