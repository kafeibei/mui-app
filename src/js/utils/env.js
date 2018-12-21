/*
* develop, testing, prerelease, production
*/
define(() => {
  let getEnv = () => {
    // return 'testing'
    return 'prerelease'
  }
  return getEnv
})
