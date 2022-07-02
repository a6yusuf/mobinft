import React from 'react'
import { useState } from 'react';
import cookie from 'js-cookie';
import Alert from './Alert';
import Axios from './../helpers/axios';
import Spinner from './Spinner';


export default function Password() {

  let token = cookie.get('token'); 

  const [password, setNewPassword] = useState({})
  const [loading, setLoading] = useState(false)
  const [profileAlert, setProfileAlert] = useState(false)


  const handlePassword = e => {
    setNewPassword(prev => {
      return {...prev, [e.target.name]: e.target.value}
    })
  }

  const handleSubmit = () => {
    if(password?.new?.length >= 6 && password?.new === password?.confirm){
      console.log(password)
      setLoading(true)
      const headers = {
          "Authorization" : `Bearer ${ token }`
      };

      let projectData = new FormData()

      projectData.append('password', password.new)

      Axios({
          method: 'post',
          url: 'updatepwd',
          data: projectData,
          headers: headers,
      })
      .then(res => {
          setLoading(false)
          setProfileAlert(true)
          setTimeout(() => setProfileAlert(false), 3000)
          console.log(res.data)
      })
    }else{
      alert("Password must be longer than 6 letters!")
    }
  }
  return (
    <div>
        {profileAlert && <Alert type="success" msg="Password updated successfully" />}
        <h5 className="card-title">Change Password</h5>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">New Password</span>
          <input type="text" className="form-control" aria-label="Sizing example input" name="new" onChange={handlePassword} aria-describedby="inputGroup-sizing-default" />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">Confirm New Password</span>
          <input type="text" className="form-control" aria-label="Sizing example input"  name="confirm" onChange={handlePassword}aria-describedby="inputGroup-sizing-default" />
        </div>
        <div className="input-group mb-3">
          <button className='btn btn-primary' onClick={handleSubmit}>
          {loading && <Spinner />}
            {!loading ? 'Update Password' : ''}
          </button>
        </div>
    </div>
  )
}
