let packages = []
let selectedPackage = null
const baseUrl = `${window.location.href}api/packages`

/*************************************** helper functions */

// create new element node
const createEl = el => document.createElement(el)

// select existing element
const selectEl = selector => document.querySelector(selector)

// add css classname to supplied node
const addCssClass = (node, className) => node.classList.add(className)

// add id to the supplied nodw
const addId = (node, id) => node.id = id

// clear the root element of dom
const clearDom = () => {
  const rootNode = selectEl("#root")
  rootNode.innerHTML = null
}

/********************************************* Event handler functions */

// click event handler for package names
const handleClickPackageName = newPackageName => {
  return () => {
    // if the new package is same as the selected package do nothing
    if (selectedPackage && selectedPackage.package === newPackageName) {
      return
    }

    // find out the selected package in packages list
    const filteredPackage = packages
      .filter(({ package }) => package === newPackageName)
  
    // if the package is not availabel do nothing
    if (!filteredPackage.length) {
      return
    }
  
    // set new selected package object and re-render the dom
    selectedPackage = filteredPackage[0]
    render()
  }
}

// click event handler for home button
const handleClickHomeButton = () => {
  selectedPackage = null
  render()
}

/**************************************** Function to create a divider node */

const divider = () => {
  const divider = createEl("div")
  addCssClass(divider, "divider")
  return divider
}

/**************************************** Functions to create a package node */

// create return to home button
const createHomeButton = () => {
  const button = createEl("button")
  button.innerHTML = "Home"
  addCssClass(button, "home-button")
  button.addEventListener("click", handleClickHomeButton)
  return button
}

// create dependency node
const createDependencyNode = dependency => {
  const dependencyNode = createEl('button')
  addCssClass(dependencyNode, "dependency")
  dependencyNode.innerHTML = dependency

  // add click event listener to the dependancy name
  dependencyNode.addEventListener("click", handleClickPackageName(dependency))
  return dependencyNode
}

// create list Item
const createDependencyListItem = alternativeDependencies => {
  // list node
  const liNode = createEl('li')
  addCssClass(liNode, "dependency-list")

  // render alternative dependencies inside the list node
  alternativeDependencies.forEach(altDep => {
    liNode.appendChild(createDependencyNode(altDep))
  })

  return liNode
}

// return un-ordered list of dependencies
const createUnorderedList = dependencies => {
  // unordered list
  const ulNode = createEl("ul")
  addCssClass(ulNode, "dependencies-list")

  // insert list of dependencies
  // to the un-ordered list
  dependencies.forEach(dependency => {
    const dependencyNode = createDependencyListItem(dependency)
    ulNode.appendChild(dependencyNode)
  })

  return ulNode
}

// returns dependencies node ready to be inserted in dom
const createDependenciesNode = (dependencies, packageName, isReverseDependency) => {
  // wraper div for packages
  const rootNode = createEl("div")
  addCssClass(rootNode, "dependencies")

  // heading for packages
  const dependenciesHeader = createEl("div")
  addCssClass(dependenciesHeader, 'dependencies-header')
  addId(dependenciesHeader, packageName)
  dependenciesHeader.innerHTML = isReverseDependency
    ? "Reverse Dependencies"
    : "Dependencies"
  rootNode.appendChild(dependenciesHeader)
  
  // create and append list of dependencies
  const ulNode = createUnorderedList(dependencies)
  rootNode.appendChild(ulNode)

  return rootNode
}

// create a dom node out of package object
const createDomNodeFromPackage = ({
  package,
  description,
  depends,
  breaks
}, displayNameOnly) => {
  // wraper div for single package
  const rootNode = createEl("div")
  addCssClass(rootNode, "package")

  // package name
  const packageNameNode = createEl("div")
  addCssClass(packageNameNode, "package-name")
  packageNameNode.innerHTML = package
  rootNode.appendChild(packageNameNode)
  
  // return package node containing package name only
  if (displayNameOnly) {
    packageNameNode.addEventListener("click", handleClickPackageName(package))
    return rootNode
  }

  // add home button inside package name node
  packageNameNode.appendChild(createHomeButton())

  // add a divider below package name node
  rootNode.appendChild(divider())

  // description, dependencies and reverse dependencies wraper
  const wrapperNode = createEl("div")
  addCssClass(wrapperNode, "package-body-wraper")
  rootNode.appendChild(wrapperNode)

  // package description
  const descriptionNode = createEl("div")
  addCssClass(descriptionNode, "description")
  descriptionNode.innerHTML = description
  wrapperNode.appendChild(descriptionNode)

  //dependencies
  if (depends) {
    wrapperNode.appendChild(divider())
    const dependenciesNode = createDependenciesNode(depends, package)
    wrapperNode.appendChild(dependenciesNode)
  }

  // reverse dependencies
  if (breaks) {
    wrapperNode.appendChild(divider())
    const reverseDependenciesNode = createDependenciesNode(breaks, package, true)
    wrapperNode.appendChild(reverseDependenciesNode)
  }

  return rootNode
}

/*********************** function to render the list of packages to the dom */

// render all the package names on the screen
const renderPackages = () => {
  // select parent div
  const rootElement = selectEl('#root')

  // render the data to the html page
  packages.forEach(package => {
    const packageNode = createDomNodeFromPackage(package, true)
    rootElement.appendChild(packageNode)
  })
}

// render detailed view of single package on the screen
const renderSelectedPackage = () => {
  // select parent div
  const rootElement = selectEl('#root')

  // render the data to the html page
  const packageNode = createDomNodeFromPackage(selectedPackage)
  rootElement.appendChild(packageNode)
}

// renders the final content to the dom
const render = () => {
  clearDom()

  if (selectedPackage) {
    renderSelectedPackage()
    return
  }

  renderPackages()
}

/************************************************* fetch data from the api */

fetch(baseUrl)
  .then(response => response.json())
  .then(data => {
    packages = [ ...data ]
    render()
  })