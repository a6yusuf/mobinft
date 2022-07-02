import Axios from 'axios'

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export default Axios.create({
    baseURL: baseUrl
  });