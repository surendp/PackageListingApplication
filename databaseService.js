const config = require('./utils/config')
const readline = require('readline')
const fs = require('fs')
const events = require('events')

// constants
const PACKAGE = 'package'
const DESCRIPTION = 'description'
const DEPENDS = 'depends'
const BREAKS = 'breaks'

let packages = []
let packageOnProgress = {}
let earlierKey = null

// returns array containing key and values
const splitLine = line => {
  let [key, value] = line.split(': ')
  key = key.toLowerCase()

  if (key === DEPENDS || key === BREAKS) {
    return [key, value.split(', ')]
  }

  return [key, value]
}

// add new package to the packages array
const addNewPackage = () => {
  packages = [ ...packages, packageOnProgress ]
  packageOnProgress = {}
}

const isRequiredInformation = key => {
 return (key === PACKAGE
  || key === DESCRIPTION
  || key === DEPENDS
  || key === BREAKS)
}

// create a package object
const fillPackageOnProgress = line => {
  if (!line) {
    addNewPackage()
    earlierKey = null
    return
  }

  if (line.substring(0, 1) === ' '
    && isRequiredInformation(earlierKey)) {
      packageOnProgress = {
        ...packageOnProgress,
        [earlierKey]: `${packageOnProgress[earlierKey]}<br/>${line}`
      }

      return
  }

  // geneate key and values from the line
  const [key, values] = splitLine(line)
  earlierKey = key

  // add new property to the object
  if (isRequiredInformation(key)) {
    packageOnProgress = {
      ...packageOnProgress,
      [key]: values
    }
  }
}

// reads the file and creates an array of package objects
// returns readline interface
const readFile = () => {
  const rl = readline.createInterface({
    input: fs.createReadStream(config.sourceFileUrl),
  })

  rl.on('line', function(line) {
    // create a key value pair

    // fill package on progress
    fillPackageOnProgress(line)
  })

  events
    .once(rl, 'close')
    .then(() => {
      addNewPackage()
    })

  return rl
}

// dump the javascript array into a json file
const createJsonFile = () => {
  const stringifiedData = JSON.stringify(packages, null, 2)
  fs.writeFile(config.dbFileUrl, stringifiedData, () => {
    console.log('Database Initialized!!')
  })
}

// sort the data in an alphabetical order
// returns the sorted array of package
const sortPackages = packages => {
  const sortedPackages = [ ...packages ]

  const compareFunction = (pack1, pack2) => {
    const packName1 = pack1.package
      ? pack1.package.toUpperCase()
      : pack1.package
    const packName2 = pack2.package
      ? pack2.package.toUpperCase()
      : pack2.package

    if (packName1 < packName2) {
      return -1
    }

    if (packName1 > packName2) {
      return 1
    }

    return 0
  }

  sortedPackages.sort(compareFunction)
  return sortedPackages
}

const init = () => {
  try {
    const rl = readFile()

    events
      .once(rl, 'close')
      .then(() => {
        // sort the package list
        packages = sortPackages(packages)
        createJsonFile()
      })
  } catch (error) {
    console.log('Database initialization failed!!')
    console.error(error)
  }
}

module.exports = {
  init
}