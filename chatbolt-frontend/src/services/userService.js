import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3001'

// allow browser to hand back cookies with every request
axios.defaults.withCredentials = true
const baseURL = '/api/users'

// fetch existing user info
const getUserData = async () => {
  const res = await axios.get(baseURL)
  return res.data
};

// create a new user
const createNewUser = async () => {
  const res = await axios.post(`${baseURL}/create`)
  return res.data
}

// update user answers on database
const updateUserData = async (answers, sessionId) => {
  const res = await axios.put(`${baseURL}/${sessionId}`, answers)
  return res.data
}

export default { getUserData, createNewUser, updateUserData }