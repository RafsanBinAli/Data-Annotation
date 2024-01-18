const express= require('express')
const router =express.Router()

const file = require('../db/file_controller')
const upload= require('../Middleware/upload')

router.get('/',file.index)
router.post('/store',upload.single('csv_file'),file.store) 

module.exports = router