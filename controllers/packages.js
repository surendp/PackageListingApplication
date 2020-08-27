const packagesRouter = require('express').Router()
const packagesService = require('../services/packages')

packagesRouter.get('/', (request, response) => {
  try {
    const packages = packagesService.getAll()
    response.json(packages)
  } catch (err) {
    response
      .status(400)
      .json({
        error: 'Server error'
      })
  }
})

module.exports = packagesRouter