import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3001'
const baseURL = '/api/users'

const getUserData = async () => {
  const res = await axios.post(baseURL)
  return res.data
};

export default { getUserData }