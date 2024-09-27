require('dotenv').config()
module.exports = {
  "domain": process.env.DOMAIN,
  "jwtSecret": "",
  "token": process.env.TOKEN,
}