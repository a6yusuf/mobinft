import React from 'react'
import Page from "../components/Page";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import { MdOutlineMonochromePhotos } from 'react-icons/md';
import { useMoralis } from 'react-moralis';
import {mintCollection1, openSea, singleRarible} from './../helpers/nftFunctions';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
// import Moralis from 'moralis'
// import Script from 'next/script';
// import Web3 from 'web3';
import Axios from './../helpers/axios';
import cookie from 'js-cookie';
import { useSelector } from 'react-redux';



export default function NewProject() {

    const router = useRouter()
    const [upload, setUpload] = useState(false)
    const [raribleLoading, setRaribleLoading] = useState(false)
    const [openSeaLoading, setOpenSeaLoading] = useState(false)
    const [imgError, setImgError] = useState(false)
    const [nftAlert, setNftAlert] = useState(false)
    const [data, setData] = useState({})
    const [nft, setNft] = useState('')
    const [file, setFile] = useState(undefined)
    const [max, setMax] = useState({collection: 20, nft: 1000})

    let token = cookie.get('token'); 

    // const contractAddress = '0xB579F4dE237082780D183Ab2486c70c7A109f339'

    const state = useSelector(state => state)
    const userDetail = state.auth.user
    const project = state.project

    // console.log("Project: Date)

    const {authenticate, isAuthenticated, user} = useMoralis()
    
    useEffect(() => {
      if(userDetail?.packages.includes('pro')){
          setMax({collection: 25, nft: 10000})
      }

    }, [])
    

    const handleData = e => {
        setData(prev => {
            return {...prev, [e.target.name]: e.target.value}
        })
    }
    const handleUpload = (e) => {
        setNft(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0]);
        // console.log('Image file:', e.target.files[0])
      }

    const handleOpenSea = async () => {
        if(file && data.name && data.description && isAuthenticated){
            // console.log("OpenSeaData: ", data)
            setOpenSeaLoading(true)

            const callback = arg => {
                // console.log("Callback arg: ", arg)
                try {
                    // console.log("token: ", dt  )
                    let meta = {
                        collectionName: data.collection_name,
                        name: data.name,
                        description: data.description,
                        platform: 'opensea',
                        contractAddress: arg.contractAddress,
                        tokenId: 1,
                        imageFileUrl: arg.imageFileUrl, 
                        metadataUrl: arg.metadataUrl 
                    }
                    const headers = {
                        "Authorization" : `Bearer ${ token }`
                    };

                    let projectData = new FormData()

                    projectData.append('collection', 'no')
                    projectData.append('total_nft', 1)
                    projectData.append('nft_url', arg.imageFileUrl)
                    projectData.append('meta', JSON.stringify(meta))
                    // console.log("Sending... ", projectData)
                    Axios({
                        method: 'post',
                        url: 'project',
                        data: projectData,
                        headers: headers,
                    })
                    .then(res => {
                        setOpenSeaLoading(false)
                        setNftAlert(true)
                        setTimeout(() => setNftAlert(false), 3000)
                        // console.log(res.data)
                    })
                } catch (error) {
                    console.log(error)
                }

            }
            try {
                // const {imageFileUrl, metadataUrl, tokenId} = await openSea(data.name, data.description, file, user)
                await mintCollection1(file, data.name, data.description, user, data.collection_name, callback)
            } catch (error) {
                console.error(error)
                // alert("Something went wrong")
            }
        }else{
            setImgError(true)
            setTimeout(() => setImgError(false), 3000)
        }
    } 
    const handleRarible = async () => {
        if(file && data.name && data.description && isAuthenticated){
            // console.log("RaribleData: ", data)
            setRaribleLoading(true)
            let {tokenAddress, tokenId, url, imageFileUrl, metadataUrl } = await singleRarible(data.name, data.description, file, user)
            // console.log("Rarible Token: ", {tokenAddress, tokenId, url } )
            let meta = {
                collectionName: data.collection_name,
                name: data.name,
                description: data.description,
                platform: 'rarible',
                tokenAddress,
                tokenId,
                imageFileUrl, 
                metadataUrl 
            }
            const headers = {
                "Authorization" : `Bearer ${ token }`
            };

            let projectData = new FormData()

            projectData.append('collection', 'no')
            projectData.append('total_nft', 1)
            projectData.append('nft_url', imageFileUrl)
            projectData.append('meta', JSON.stringify(meta))
    
            Axios({
                method: 'post',
                url: 'project',
                data: projectData,
                headers: headers,
            })
            .then(res => {
                setRaribleLoading(false)
                setNftAlert(true)
                setTimeout(() => setNftAlert(false), 3000)
                // console.log(res.data)
            })
        }else{
            setImgError(true)
            setTimeout(() => setImgError(false), 3000)
        }
    } 

  return (
      <Page title="New NFT">
        <div className="settings-panel">
            <div className="container-fluid settings-container">
                {imgError && <Alert type="error" msg="Please upload an image" />}
                {nftAlert && <Alert type="success" msg="NFT minted successfully" />}
                <div className='nft-wrapper'>
                    {!isAuthenticated && <div className='connect-btn-wrapper'>
                        <button type="button" className="btn btn-primary mint-btn" onClick={authenticate}>Connect Wallet</button>
                        </div>}
                    {isAuthenticated && <div className='np-wrapper'>
                        {project.totalNFT <= max.nft && <div className="card nft-card" onClick={()=> setUpload(true)}>
                            <FaUpload className="card-img-top nft-icon" />
                            <div className="card-body">
                                <p className="card-text">Upload NFT</p>
                            </div>
                        </div>}
                        {project.collection <= max.collection && <div className="card nft-card" onClick={() => router.push('/app')}>
                            <MdOutlineMonochromePhotos className="card-img-top nft-icon"/>
                            <div className="card-body">
                                <p className="card-text">Generate NFT</p>
                            </div>
                        </div>}
                    </div>}
                    {upload && <div className='nft-upload'>
                        <div>
                            <div className="input-group mb-3">
                                <input type="file" accept="image/*" onChange={handleUpload} name='nft' className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="inputGroup-sizing-default">Collection Name</span>
                                <input type="text" name='collection_name' onChange={handleData} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="inputGroup-sizing-default">Name</span>
                                <input type="text" name='name' onChange={handleData} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="inputGroup-sizing-default">Description</span>
                                <input type="text" name='description' onChange={handleData} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                            </div>
                            <div className="input-group mb-3 mint-btns">
                                <button type="button" className="btn btn-primary mint-btn" onClick={handleOpenSea}>{openSeaLoading ? <Spinner /> : 'Mint OpenSea' }</button>
                                <button type="button" className="btn btn-primary mint-btn" onClick={handleRarible}>{raribleLoading ? <Spinner /> : 'Mint Rarible' }</button>
                            </div>
                        </div>
                        <div className='nft-image'>
                            {nft && <img
                                src={nft}
                                className="img-fluid"
                                alt="nft-preview"
                            />}
                        </div>
                    </div>}
                </div>
            </div>
        </div>
      </Page>
  )
}
