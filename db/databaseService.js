const config = require('../utils/config')
const fs = require('fs')
const events = require('events')
const readStatusFile = require('./readStatusFile')

// dump the javascript array into a json file
const createJsonFile = stringifiedData => {
  fs.writeFile(config.dbFileUrl, stringifiedData, () => {
    console.log('Database Initialized!!')
  })
}

// initialize the database
const init = () => {
  try {
    const rl = readStatusFile.extractContent()
    events
      .once(rl, 'close')
      .then(() => {
        createJsonFile(readStatusFile.getJsonData())
      })
  } catch (error) {
    console.log('Database initialization failed!!')
    console.error(error)
  }
}

module.exports = {
  init
}