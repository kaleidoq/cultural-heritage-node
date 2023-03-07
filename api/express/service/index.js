const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const models = require('../express/module')

const db = mysql.createPool(models.mysql)

// export db
// export router
module.exports = router