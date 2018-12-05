/*
* develop, testing, prerelease, production
*/
define(() => {
  let getEnv = () => {
    return 'testing'
    // return 'develop'
  }
  return getEnv
})
