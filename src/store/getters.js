const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  email: state => state.user.email,
  userId: state => state.user.userId
}
export default getters
