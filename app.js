const express = require('express')
const path = require('path')
const app = express()
const databaseService = require('./databaseService')
const packagesRouter = require('./controllers/packages')

// initiate database
databaseService.init()

// create packages router
app.use('/api/packages', packagesRouter)

app.use(express.static(path.join(__dirname, 'static')))

module.exports = app