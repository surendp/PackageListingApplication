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

module.exports = {
  sortPackages,
}