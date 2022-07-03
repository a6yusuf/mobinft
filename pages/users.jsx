import React from 'react'
import Page from "../components/Page";
import { AiOutlineLoading } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import Axios from './../helpers/axios';
import cookie from 'js-cookie';
import Spinner from '../components/Spinner';
import UserTable from '../components/UserTable';
import { validateEmail } from './../helpers/validateEmail';


export default function Users() {

    let token = cookie.get('token'); 
    const [loading, setLooading] = useState(true)
    const [data, setData] = useState(undefined)
    const [userData, setUserData] = useState({})
    const [project, setProject] = useState({})
    const [packages, setpackages] = useState(['fe'])


    useEffect(() => {
        const headers = {
            "Authorization" : `Bearer ${ token }`
        };

        Axios({
            method: 'get',
            url: 'allusers',
            data: JSON.stringify({}),
            headers: headers,
        })
        .then(res => {
            // console.log("data: ", res.data)
            let arr = []
            let collectionArr = []
            setData(res.data)
            res.data.map(user => {
                let coll = user.projects.filter(item => item.collection === 'yes')
                user.projects.map(item => arr.push(item.total_nft))
                collectionArr = [...collectionArr, ...coll]
            })
            setProject({collection: collectionArr?.length || 0, totalNFT: arr.reduce((a, b) => parseInt(a) + parseInt(b), 0)})
            setLooading(false)
        })
    }, [])

    const handleDelete = id => {
        if(confirm("Do you really want to delete?")){ 

            if(data.find(item => item.id === id).role === 'admin'){
                alert("You can't delete an Admin")
                return;
            } 

            const headers = {
                "Authorization" : `Bearer ${ token }`
            };

            let projectData = new FormData()

            projectData.append('id', id)
    
            Axios({
                method: 'post',
                url: 'deluser',
                data: projectData,
                headers: headers,
            })
            .then(res => {
                // console.log("data: ", res.data)
                // this.props.delAlert()
                const newdata = data.filter(item => item.id !== id);
                // this.setState({tableData: newdata }, ()=> console.log("Just deleted you, homie.", res.data));
                setData(newdata)
            })
        }
    }


    
    const handleData = e => {
        setUserData(prev => {
            return {...prev, [e.target.name]: e.target.value}
        })
    }

    const handlePackage = e => {
        setpackages(prev => {
            return [...prev, e.target.value]
        })
    }

    const submit = () => {
        if(userData.email && userData.name && validateEmail(userData.email)){
            const headers = {
                "Authorization" : `Bearer ${ token }`
            };
    
            let projectData = new FormData()
    
            projectData.append('name', userData.name)
            projectData.append('email', userData.email)
            projectData.append('role', userData.role)
            projectData.append('packages', JSON.stringify([... new Set(packages)]))
    
            Axios({
                method: 'post',
                url: 'addnew',
                data: projectData,
                headers: headers,
            })
            .then(res => {
                let arr = []
                let collectionArr = []
                let newusers = [...data, res.data[0]]
                setData(newusers)
                newusers.map(user => {
                    let coll = user?.projects?.filter(item => item.collection === 'yes')
                    user?.projects?.map(item => arr.push(item.total_nft))
                    collectionArr = coll ? [...collectionArr, ...coll] : [...collectionArr]
                })
                setProject({collection: collectionArr?.length || 0, totalNFT: arr.reduce((a, b) => parseInt(a) + parseInt(b), 0)})
                setLooading(false)
            })
        }else{
            alert("Enter correct email and other required fields")
        }
    }

  return (
    <Page title="My Users">
        <div className="settings-panel">
            <div className="container-fluid settings-container">
            <div className='dash-wrapper'>
                <div className="row">
                <div className="col-md-4 stretch-card grid-margin">
                    <div className="card bg-gradient-danger card-img-holder text-white">
                    <div className="card-body">
                        <h4 className="font-weight-normal mb-3">Total Users 
                        </h4>
                        {!loading && <h2 className="mb-5">{data ? data.length : 0}</h2>}
                        {loading && <Spinner />}
                    </div>
                    </div>
                </div>
                <div className="col-md-4 stretch-card grid-margin">
                    <div className="card bg-gradient-info card-img-holder text-white">
                    <div className="card-body">
                        <h4 className="font-weight-normal mb-3">Total Collections 
                        </h4>
                        {!loading && <h2 className="mb-5">{project.collection ? project.collection : 0}</h2>}
                        {loading && <Spinner />}
                    </div>
                    </div>
                </div>
                <div className="col-md-4 stretch-card grid-margin">
                    <div className="card bg-gradient-success card-img-holder text-white">
                    <div className="card-body">
                        <h4 className="font-weight-normal mb-3">Total Users NFTs
                        </h4>
                        {!loading && <h2 className="mb-5">{project.totalNFT ? project.totalNFT : 0}</h2>}
                        {loading && <Spinner />}
                    </div>
                    </div>
                </div>
                </div>
                {loading && <div style={{height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div className="loading">
                    <div className="title">Fetching data...</div>
                    <div className="subtitle mt-2 mb-5">
                        Please wait...
                    </div>
                    <AiOutlineLoading size={70} className="icon" />
                    </div>
                </div>}
                {!loading && data !== undefined && <UserTable data={data} handleDelete={handleDelete} handlePackage={handlePackage} packages={packages} handleData={handleData} submit={submit}/>}
            </div>

                
            </div>
        </div>
    </Page>
  )
}
