import Image from 'next/image'
import React from 'react'
import img1 from "../assets/home/img1.png";
import { useRouter } from 'next/router';
import { AiOutlineLoading } from 'react-icons/ai';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Alert from '../components/Alert';


export default function Table({data, loading}) {

  const router = useRouter()
  const [alert, setAlert] = React.useState(false)
  // console.log("Meta", JSON.parse(data[0].meta))

  const handleAlert = () => {
    setAlert(true)
    setTimeout(() => setAlert(false), 3000)
  }

  // console.log(JSON.parse(data[0].meta))
  
  return (
    <div>
    {alert && <Alert type="success" msg="Contract address copied to clipboard" />}
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
                    </div>
                    <div className="row mt-3">
                      {data.map((item, index) => {
                        return (
                          <div key={index} className="col-6 col-md-3 pe-1">
                        <div className="card mb-2 mw-100 w-100 rounded" >
                          <img src={item.nft_url} className="card-img-top" alt="nft" style={{maxHeight: 145}}/>
                          <div className="card-body">
                            <h5 className="card-title">{JSON.parse(item.meta).name}</h5>
                            <p className="card-text">{JSON.parse(item.meta).description}</p>
                            {JSON.parse(item.meta).platform === 'rarible' && <a href={JSON.parse(item.meta).platform === 'rarible' ? `https://rarible.com/token/${JSON.parse(item.meta).tokenAddress}:${JSON.parse(item.meta).tokenId}?tab=details` : `https://testnets.opensea.io/assets/mumbai/${JSON.parse(item.meta).contractAddress}/1`} className="btn btn-primary" target="_blank" rel="noreferrer" style={{width: '45%', margin: 5}}>View</a>}
                            <CopyToClipboard text={JSON.parse(item.meta).platform === 'rarible' ? JSON.parse(item.meta).tokenAddress : JSON.parse(item.meta).contractAddress}
                              onCopy={handleAlert}>
                            <button className="btn btn-primary"  style={{width: '45%', margin: 5}}>Address</button>
                            </CopyToClipboard>
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
