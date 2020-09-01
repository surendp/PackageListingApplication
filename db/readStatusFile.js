const config = require('../utils/config')
const helper = require('../utils/helper')
const fs = require('fs')
const readline = require('readline')
const events = require('events')

// constants
const PACKAGE = 'package'
const DESCRIPTION = 'description'
const DEPENDS = 'depends'
const BREAKS = 'breaks'

let packages = []
let packageOnProgress = {}
let earlierKey = null

/********************************************************** Functions to format the dependencies and reverse dependencies */

// exclude version numbers from the package names
const excludeVersionNumbers = packagesArray => {
  return packagesArray.map(package => package.split(" ")[0])
}

// create array of alternative dependencies
const seperateAlternativeDependencies = dependencyString => dependencyString.split(" | ")

// enclose individual dependency into array
const formatDependencies = dependencies => {
  return dependencies.map(dependancy => {
    const alternativeDependencies = seperateAlternativeDependencies(dependancy)
    return excludeVersionNumbers(alternativeDependencies)
  })
}

// create array of dependencies and reverse dependencies arrays
const formatDependenciesAndReverseDependencies = package => {
  let newPackage = { ...package }

  if (newPackage.depends) {
    newPackage = {
      ...newPackage,
      depends: formatDependencies(newPackage.depends)
    }
  }

  if (newPackage.breaks) {
    newPackage = {
      ...newPackage,
      breaks: formatDependencies(newPackage.breaks)
    }
  }

  return newPackage
}

/*********************************************Helper functions to extract the file content */

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
  const formattedPackage = formatDependenciesAndReverseDependencies(packageOnProgress)
  packages = [ ...packages, formattedPackage ]
  packageOnProgress = {}
}

// check if the supplied key is needed to be stored
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

/********************************************************** Function to initiate the content extraction */

// reads the file and creates an array of package objects
// returns readline interface
const extractContent = () => {
  const rl = readline.createInterface({
    input: fs.createReadStream(config.sourceFileUrl),
  })

  rl.on('line', function(line) {
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

/***************************************************** Functions to provied the data */

// return the array of package objects
const getData = () => {
  packages = helper.sortPackages(packages)
  return packages
}

// return the json formated data
const getJsonData = () => {
  packages = helper.sortPackages(packages)
  return JSON.stringify(packages, null, 2)
}

module.exports = {
  extractContent,
  getData,
  getJsonData
}
