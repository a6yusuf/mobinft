import React from 'react'
import Page from '../components/Page'
import circle from "../assets/home/circle.svg";
import Image from 'next/image';
import Table from '../components/Table';
import { MdBarChart } from 'react-icons/md';
import { useMoralis } from 'react-moralis';
import { useEffect } from 'react';
import Axios from './../helpers/axios';
import cookie from 'js-cookie';
import { useSelector } from 'react-redux';
import { useState } from 'react';



export default function Dashboard() {
    
    let token = cookie.get('token'); 
    const {authenticate, isAuthenticated, user} = useMoralis()
    const [project, setProject] = useState({loading: true})    
    
    useEffect(() => {
        const headers = {
            "Authorization" : `Bearer ${ token }`
        };

        Axios({
            method: 'get',
            url: 'project',
            data: JSON.stringify({}),
            headers: headers,
        })
        .then(res => {
            console.log("data: ", res.data)
            let arr = []
            let coll = res.data.filter(item => item.collection === 'yes')
            let totalNFT = res.data.map(item => arr.push(item.total_nft))
            setProject({loading: false, collection: coll?.length || 0, totalNFT: arr.reduce((a, b) => parseInt(a) + parseInt(b), 0), data: res.data})
        })
    }, [])
    
  return (
      <Page title="MobiNFT | Dashboard">
          <div className='settings-panel'>
              <div className='container-fluid settings-container'>

            <div className='dash-wrapper'>
                <div className="row">
                <div className="col-md-4 stretch-card grid-margin">
                    <div className="card bg-gradient-danger card-img-holder text-white">
                    <div className="card-body">
                        <h4 className="font-weight-normal mb-3">Total Collections 
                        </h4>
                        <h2 className="mb-5">{project.collection ? project.collection : 0}</h2>
                    </div>
                    </div>
                </div>
                <div className="col-md-4 stretch-card grid-margin">
                    <div className="card bg-gradient-info card-img-holder text-white">
                    <div className="card-body">
                        <h4 className="font-weight-normal mb-3">Total NFTs 
                        </h4>
                        <h2 className="mb-5">{project.totalNFT ? project.totalNFT : 0}</h2>
                    </div>
                    </div>
                </div>
                <div className="col-md-4 stretch-card grid-margin">
                    <div className="card bg-gradient-success card-img-holder text-white">
                    <div className="card-body">
                        <h4 className="font-weight-normal mb-3">Web3
                        </h4>
                        {isAuthenticated && <h2 className="mb-5">Connected</h2>}
                        {!isAuthenticated && <button type="button" className="btn btn-primary mint-btn" onClick={authenticate}>Connect Wallet</button>}
                    </div>
                    </div>
                </div>
                </div>
                <Table data={project.data} loading={project.loading} />
            </div>
          </div>
        </div>
      </Page>
  )
}
