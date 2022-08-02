import React from 'react'
import Image from 'next/image';
import superuser from '../assets/home/superuser.png'
import { FaSave, FaUpload } from 'react-icons/fa';
import { useState } from 'react';
import cookie from 'js-cookie';
import Spinner from './Spinner';
import Axios from './../helpers/axios';
import Alert from './Alert';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/actions/AuthAction';
import dayjs from 'dayjs';


export default function Profile() {

    const [file, setFile] = useState(undefined)
    const [profile, setProfile] = useState(undefined)
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [updated, setUpdated] = useState(false)
    const [profileAlert, setProfileAlert] = useState(false)
    const [usedPeriod, setUsedPeriod] = useState(0)

    const dispatch = useDispatch()

    let token = cookie.get('token'); 

    useEffect(() => {
        const headers = {
            "Authorization" : `Bearer ${ token }`
          };

        Axios( {
            method:'get',
            url: 'me',
            data: JSON.stringify({}),
            headers: headers,
        } )
        .then(res => {
            setProfile(res.data)
            dispatch(login(res.data))
            //set validity period
            console.log("Res: ", res.data.created_at)
            const created = dayjs(res.data.created_at);
            const now = dayjs();
    
            let df1 = now.diff(created, 'month', true);
            setUsedPeriod(df1)
            console.log("Used period: ", df1);    
        })
    }, [updated])
    

    const clickUpload = () => {
        // setError(false)
        let vidUpload = document.getElementById("vidUpload")
        vidUpload.click();
        const selected = vidUpload.files[0];
        console.log(selected);
    }

    const handleUpload = (event) => {
        if(event.target.files[0].size < 100000){
            setFile(event.target.files[0]);
            console.log('Image file:', event.target.files[0])
        }else{
            alert("Image too big!")
        }
      }

    const handleSubmit = () => {
        if(name || file) {
            setLoading(true)
    
            const headers = {
                "Authorization" : `Bearer ${ token }`
            };
    
            let projectData = new FormData()
    
            projectData.append('name', name)
            projectData.append('profileImg', file)
    
            Axios({
                method: 'post',
                url: 'updateme',
                data: projectData,
                headers: headers,
            })
            .then(res => {
                setLoading(false)
                setUpdated(true)
                setProfileAlert(true)
                setTimeout(() => setProfileAlert(false), 3000)
                // console.log(res.data)
            })
        }else{
            alert("Required field missing!")
        }
    }

  return (
    <div className="row mt-3">
        {profileAlert && <Alert type="success" msg="Profile updated successfully" />}
        <h5 className="card-title">Edit Profile</h5>
        <div className="col-12 col-md-5 pe-1">
            <div className="card mb-2 mw-100 w-100 rounded" >
                {profile?.profile_picture !== 'NA' && !file && <img src={profile?.profile_picture} className="card-img-top" alt="nft" style={{borderRadius: '100%', padding: 10, height: 300}} />}
                {file && <img src={URL.createObjectURL(file)} className="card-img-top" alt="nft" style={{borderRadius: '100%', padding: 10, height: 300}} />}
                {profile?.profile_picture === 'NA' && !file && <Image src={superuser} alt="profile-img" style={{borderRadius: '100%', padding: 10, height: 300, background: 'steelblue'}}/>}
                <div className="card-body" style={{textAlign: 'center'}}>
                <h5 className="card-title">{profile?.name}</h5>
                <p className="card-text" style={{marginBottom: 10, fontWeight: 500}}>{profile?.email}</p>
                <p className="card-text" style={{marginBottom: 10, fontWeight: 500}}>Access validity: {(14 - usedPeriod).toFixed(2)} month(s)</p>
                <div>
                    <input type="file" id="vidUpload" accept="image/*" onChange={handleUpload} style={{ display: "none"}}/>
                    <button
                        className="btn btn-primary" 
                        style={{ width: '100%' }}
                        onClick={clickUpload}
                        >
                        <FaUpload style={{ fontSize: '20px', marginRight: '10px',display: 'inline-block'}}/>
                        Upload Image
                    </button>
                </div>
                </div>
            </div>
        </div>
        <div className="col-12 col-md-7 pe-1">
            <div className="input-group mb-3">
                <span className="input-group-text" id="inputGroup-sizing-default">New Name</span>
                <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" name="name" onChange={(e) => setName(e.target.value)}/>
            </div>
        </div>
        <div className="input-group mb-3">
        <button
            className="btn btn-primary" 
            style={{ width: '100%' }}
            onClick={handleSubmit}
            >
            {!loading && <FaSave style={{ fontSize: '20px', marginRight: '10px',display: 'inline-block'}}/> }
            {loading && <Spinner />}
            {!loading ? 'Update Profile' : ''}
        </button>
        </div>
    </div>
  )
}
