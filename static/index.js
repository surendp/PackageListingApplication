let packages = []
const baseUrl = `${window.location.href}api/packages`

// create new element node
const createEl = el => document.createElement(el)

// select existing element
const selectEl = selector => document.querySelector(selector)

// add css classname to supplied node
const addCssClass = (node, className) => node.classList.add(className)

// add id to the supplied nodw
const addId = (node, id) => node.id = id

// create dependency node
const createDependencyNode = dependency => {
  const liNode = createEl('li')
  addCssClass(liNode, "dependency")
  liNode.innerHTML = dependency
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
    const dependencyNode = createDependencyNode(dependency)
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

  // add onclick event handler to the dependencies header
  rootNode.addEventListener("click", () => {
    if (rootNode.childNodes.length > 1) {
      rootNode.removeChild(rootNode.childNodes[1])
      return
    }
  
    // create and append list of dependencies
    const ulNode = createUnorderedList(dependencies)
    rootNode.appendChild(ulNode)
  })

  return rootNode
}

// create a dom node out of package object
const createDomNodeFromPackage = ({
  package,
  description,
  depends,
  breaks
}) => {
  // wraper div for single package
  const divNode = createEl("div")
  addCssClass(divNode, "package")

  // package name
  const packageNode = createEl("div")
  addCssClass(packageNode, "package-name")
  packageNode.innerHTML = package
  divNode.appendChild(packageNode)

  // description, dependencies and reverse dependencies wraper
  const wraperNode = createEl("div")
  addCssClass(wraperNode, "package-body-wraper")
  divNode.appendChild(wraperNode)

  // package description
  const descriptionNode = createEl("div")
  addCssClass(descriptionNode, "description")
  descriptionNode.innerHTML = description
  wraperNode.appendChild(descriptionNode)

  //dependencies
  if (depends) {
    const dependenciesNode = createDependenciesNode(depends, package)
    wraperNode.appendChild(dependenciesNode)
  }

  // reverse dependencies
  if (breaks) {
    const reverseDependenciesNode = createDependenciesNode(breaks, package, true)
    wraperNode.appendChild(reverseDependenciesNode)
  }

  return divNode
}

// renders the list of packages to the dom
const renderPackages = () => {
  // select parent div
  const rootElement = selectEl('#root')

  // render the data to the html page
  packages.forEach(package => {
    const packageNode = createDomNodeFromPackage(package)
    rootElement.appendChild(packageNode)
  })
}

// fetch data from the api
fetch(baseUrl)
  .then(response => response.json())
  .then(data => {
    packages = [ ...data ]
    renderPackages()
  })