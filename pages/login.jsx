import React from 'react'
import Image  from 'next/image';
import loginMale from "../assets/home/loginmale.svg";
// import loginFemale from "../assets/home/loginfemale.svg";
import { useState } from 'react';
import Axios from "../helpers/axios"
import { useRouter } from 'next/router';
import {useDispatch} from 'react-redux';
import { login } from './../store/actions/AuthAction';
import Cookie from 'js-cookie';
import Error from '../components/Error';


export default function Login() {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME;

  const [img, setImg] = useState(loginMale)
  const [data, setData] = useState({email: '', password: ''})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  const dispatch = useDispatch();


//   setInterval( () => img === loginMale ? setImg(loginFemale) : setImg(loginMale), 10000)


  const handleData = e => {
      setData(prev => {
          return {...prev, [e.target.name]: e.target.value}
      })
  }

  const submit = e => {
      e.preventDefault()
      setError("")
      if(data.email && data.password){
        const headers = {
            "Content-Type" : "multipart/form-data",
        };
        setLoading(true)
        let userData = new FormData()

        userData.append('email', data.email)
        userData.append('password', data.password)

        Axios({
            method: 'post',
            url: 'login',
            data: userData,
            headers: headers,
        })
        .then(response => {
            if(response.data['success']){
                console.log("User: ", response.data['user'])
                setLoading(false)
                Cookie.set("token", response.data['token']);
                dispatch(login(response.data['user']))
                router.push('/dashboard')
            }else {
                console.log("Failed")
                setError("Username and/or password incorrect")
                // Cookie.remove("token")
            }
        })
        .catch(err => {
            console.log(err)
            setError("Error while logging in. Please try again")
        })
      }
  }
  

  return (
    <div className="wrapper">
        {/* <div className="image-holder">
            <img src={"https://i.picsum.photos/id/668/200/300.jpg?hmac=E7YE9NQG89nCsmW1hc-1nACBZTj9ll8IiXS65WjdD28"} alt="login image male" className='login-image'/>
        </div> */}
        <div className="form-inner">
            <form onSubmit={submit}>
                <div className="form-header">
                    <h3>{businessName}</h3>
                    {/* <Image src="images/sign-up.png" alt="" className="sign-up-icon" /> */}
                    <hr className="login-hr" />
                    <Error error={error}/>
                </div>
                <div className="form-group">
                    <label htmlFor="">Username</label>
                    <input type="text" name='email' className="form-control" onChange={handleData} />
                </div>
                <div className="form-group">
                    <label htmlFor="">Password</label>
                    <input type="password" name='password' className="form-control"  onChange={handleData} />
                </div>
                <button>{loading ? 'Please wait...' : 'Sign In'}</button>
            <span className='forget-psw'>
                <small>Forget password</small>
            </span>
            </form>
        </div>
        
    </div>
  )
}
