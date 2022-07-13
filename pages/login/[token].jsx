import React from 'react'
import Image  from 'next/image';
// import loginMale from "../assets/home/loginmale.svg";
import { useState } from 'react';
import Axios from "../../helpers/axios"
import { useRouter } from 'next/router';
import {useDispatch} from 'react-redux';
import { login } from './../../store/actions/AuthAction';
import Cookie from 'js-cookie';
import Error from '../../components/Error';
import Head from "next/head";
import Alert from '../../components/Alert';


export default function Login() {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME;

  const [data, setData] = useState({email: '', password: ''})
  const [loading, setLoading] = useState(false)
  const [forgot, setForgot] = useState(false)
  const [error, setError] = useState('')
  const [alert, setAlert] = useState(false)
  const [page, setPage] = useState('app')

  const router = useRouter()
  const { token } = router.query



  const dispatch = useDispatch();

  React.useEffect(() => {
      if(token){
        console.log(token);
        setPage(token)
      }
  }, [])
  

    const resetPassword = (e) => {
        e.preventDefault()
        if(data.email !== '' && data.password === data.confirm_password){
            const headers = {
                "Content-Type" : "multipart/form-data",
            };
            setLoading(true)
            let userData = new FormData()

            userData.append('email', data.email)
            userData.append('password', data.password)

            Axios({
                method: 'post',
                url: 'forgetpwd',
                data: userData,
                headers: headers,
            })
            .then(res => {
                setAlert(true)
                setLoading(false)
            })
        }
    }
    const submitToken = (e) => {
        e.preventDefault()
        if(data.email){
            const headers = {
                "Content-Type" : "multipart/form-data",
            };
            setLoading(true)
            let userData = new FormData()

            userData.append('email', data.email)

            Axios({
                method: 'post',
                url: 'retoken',
                data: userData,
                headers: headers,
            })
            .then(res => {
                setAlert(true)
                setLoading(false)
            })
        }
    }

  
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
                // console.log("User: ", response.data['user'])
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
        <Head>
          <title>
            {businessName + " - Login"}
          </title>
        </Head>
        {alert && <Alert type="success" msg="Reset link sent to your email" />}
        <div className="form-inner">
            {page === 'app' && !forgot && <form onSubmit={submit}>
                <div className="form-header">
                    <h3>{businessName}</h3>
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
                    <small onClick={()=> setForgot(true)}>Forget password</small>
                </span>
            </form>}
            {page === 'app' && forgot &&
                <form onSubmit={submitToken}>
                    <div className="form-header">
                        <h3>{businessName}</h3>
                        <hr className="login-hr" />
                        <Error error={error}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Email</label>
                        <input type="text" name='email' className="form-control" onChange={handleData} />
                    </div>
                    <button>{loading ? 'Please wait...' : 'Reset Password'}</button>
                    <span className='forget-psw'>
                        <small onClick={()=> setForgot(false)}>Login</small>
                    </span>
                </form>
            }
            {page !== 'app' &&
                <form onSubmit={resetPassword}>
                    <div className="form-header">
                        <h3>{businessName}</h3>
                        <hr className="login-hr" />
                        <Error error={error}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Email</label>
                        <input type="email" name='email' className="form-control" onChange={handleData} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">New Password</label>
                        <input type="password" name='password' className="form-control" onChange={handleData} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Confirm Password</label>
                        <input type="password" name='confirm_password' className="form-control" onChange={handleData} />
                    </div>
                    <button>{loading ? 'Please wait...' : 'Reset Password'}</button>
                    {/* <span className='forget-psw'>
                        <small onClick={()=> setForgot(false)}>Login</small>
                    </span> */}
                </form>
            }
        </div>
    </div>
  )
}
