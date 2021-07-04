const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userName: state => state.user.userName,
  email: state => state.user.email,
  userId: state => state.user.userId
}
export default getters
