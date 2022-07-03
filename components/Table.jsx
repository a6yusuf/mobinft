import Image from 'next/image'
import React from 'react'
import img1 from "../assets/home/img1.png";
import { useRouter } from 'next/router';
import { AiOutlineLoading } from 'react-icons/ai';

export default function Table({data, loading}) {

  const router = useRouter()
  
  return (
    <div>
      {loading && <div style={{height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div className="loading">
          <div className="title">Fetching data...</div>
          <div className="subtitle mt-2 mb-5">
            Please wait...
          </div>
          <AiOutlineLoading size={70} className="icon" />
        </div>
        </div>}
      {data !== undefined && data?.length === 0 && <div style={{height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div className="card">
          <div className="card-body">
            <p style={{margin: 10, fontWeight: 700}}>You have not made any project</p>
            <button className='btn btn-primary' style={{width: '100%'}} onClick={() => router.push('new-project')}>Create Project</button>
          </div>
        </div>
        </div>}
        {data !== undefined && data?.length !== 0 && <div className="row">
              <div className="col-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Recent Projects</h4>
                    <div className="d-flex">
                      {/* <div className="d-flex align-items-center me-4 text-muted font-weight-light">
                        <i className="mdi mdi-account-outline icon-sm me-2"></i>
                        <span>PandaPunk</span>
                      </div>
                      <div className="d-flex align-items-center text-muted font-weight-light">
                        <i className="mdi mdi-clock icon-sm me-2"></i>
                        <span>June 3rd, 2022</span>
                      </div> */}
                    </div>
                    <div className="row mt-3">
                      {data.map((item, index) => {
                        return (
                          <div key={index} className="col-6 col-md-3 pe-1">
                        <div className="card mb-2 mw-100 w-100 rounded" >
                          <img src={item.nft_url} className="card-img-top" alt="nft" />
                          <div className="card-body">
                            <h5 className="card-title">{JSON.parse(item.meta).name}</h5>
                            <p className="card-text">{JSON.parse(item.meta).description}</p>
                            <a href={JSON.parse(item.meta).platform === 'rarible' ? `https://rinkeby.rarible.com/token/${JSON.parse(item.meta).tokenAddress}:${JSON.parse(item.meta).tokenId}` : `https://testnets.opensea.io/assets/mumbai/${JSON.parse(item.meta).contractAddress}/1`} className="btn btn-primary" target="_blank" rel="noreferrer">View</a>
                          </div>
                        </div>
                      </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>}
    </div>
  )
}
