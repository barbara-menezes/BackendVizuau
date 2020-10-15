require('dotenv').config();
module.exports= {
  "development": {
    "url": "postgres://postgres:admin@192.168.99.100:5432/db_vizuau"
  },
  "test": {
    "url": process.env.DATABASE_URL
  },
  "production": {
    "url": process.env.DATABASE_URL
  }
}