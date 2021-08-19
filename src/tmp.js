// generate accessible routes map based on roles
const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

// dynamically add accessible routes
router.addRoutes(accessRoutes)