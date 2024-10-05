import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3001'
axios.defaults.withCredentials = true
const baseURL = '/api/users'

const getUserData = async () => {
  const res = await axios.get(baseURL)
  return res.data
};

const createNewUser = async () => {
  const res = await axios.post(`${baseURL}/create`)
  return res.data
}

export default { getUserData, createNewUser }