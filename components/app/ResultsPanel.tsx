import JSZip from "jszip";
import React, { useContext, useState } from "react";
import { AiOutlineLoading, AiOutlineReload } from "react-icons/ai";
import { HiFolderDownload } from "react-icons/hi";
import { MdModeEditOutline } from "react-icons/md";
import AppContext from "../../context/AppContext";
import Button from "../Button";
import ResultsItem from "./ResultsItem";
import { useMoralis } from 'react-moralis';
import { bulkRarible, mintCollection2 } from './../../helpers/nftFunctions';
import cookie from 'js-cookie';
import axios from "../../helpers/axios";
import Alert from './../Alert';


interface ResultsPanelProps {
  data: any;
  setData: any;
  setError: any;
  generate: any;
}

const LIMIT = 54;
const filename: any = process.env.NEXT_PUBLIC_DOWNLOAD_FILENAME;

const ResultsPanel = ({
  data,
  setData,
  setError,
  generate,
}: ResultsPanelProps) => {
  const { setShowResults, collectionName, collectionSize, collectionDesc } =
    useContext(AppContext);
  const [downloading, setDownloading] = useState(false);
  const [openseaLoading, setOpenseaLoading] = useState(false);
  const [raribleLoading, setRaribleLoading] = useState(false);
  const [nftAlert, setNftAlert] = useState(false);
  const [results, setResults] = useState(data?.collections.slice(0, LIMIT));
  const [currentIndex, setCurrentIndex] = useState(LIMIT);

  const {isAuthenticated, user} = useMoralis()
  let token = cookie.get('token'); 

  // console.log("Coll name: ", collectionName, "Descr: ", collectionDesc)

  const showMore = () => {
    setCurrentIndex(currentIndex + LIMIT);
    setResults([
      ...results,
      ...data?.collections.slice(currentIndex, currentIndex + LIMIT),
    ]);
  };

  const mintOpenSea = async () => {
    if(isAuthenticated && data?.collections){
        // console.log("OpenSeaData: ", data)
        setOpenseaLoading(true)
        //calback
        const callback = (arg :any) => {
                // console.log("Callback arg: ", arg)
                try {
                    // console.log("token: ", dt  )
                    let meta = {
                        collectionName: collectionName,
                        name: collectionName,
                        description: collectionDesc,
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

                    projectData.append('collection', 'yes')
                    projectData.append('total_nft', collectionSize.toString())
                    projectData.append('nft_url', arg.imageFileUrl)
                    projectData.append('meta', JSON.stringify(meta))
                    console.log("Sending... ", projectData)
                    axios({
                        method: 'post',
                        url: 'project',
                        data: projectData,
                        headers: headers,
                    })
                    .then(res => {
                        setOpenseaLoading(false)
                        setNftAlert(true)
                        setTimeout(() => setNftAlert(false), 3000)
                        // console.log(res.data)
                    })
                } catch (error) {
                    console.log(error)
                }

            }
            
        try {
            const res: any = await mintCollection2(collectionName, collectionDesc, user, data?.collections, collectionName, callback)
        } catch (error) {
            console.error(error)
            // alert("Something went wrong")
        }
    }
} 
  const mintRarible = async () => {
    if(isAuthenticated && data?.collections){
        // console.log("OpenSeaData: ", data)
        setRaribleLoading(true)
        try {
          let callback = (arg: any) => {
            // console.log("token: ", arg  )
            let meta = {
              collectionName: collectionName,
              name: collectionName,
              description: collectionDesc,
              platform: 'rarible',
              tokenAddress: arg.tokenAddress,
              tokenId: arg.tokenId,
              imageFileUrl: arg.imageFileUrl, 
              metadataUrl: arg.metadataUrl 
            }
            const headers = {
                "Authorization" : `Bearer ${ token }`
            };

            let projectData = new FormData()

            projectData.append('collection', 'yes')
            projectData.append('total_nft', collectionSize.toString())
            projectData.append('nft_url', arg.imageFileUrl)
            projectData.append('meta', JSON.stringify(meta))
    
            axios({
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

          }
            const res: any = await bulkRarible(collectionName, collectionDesc, user, data?.collections, callback)
                        
        } catch (error) {
            console.error(error)
            alert("Something went wrong")
        }
    }
} 

  const downloadZip = async () => {
    setDownloading(true);

    var zip = new JSZip();
    var file: any = zip.folder(filename);
    var images: any = file.folder("images");
    var gifs: any;
    var meta: any = file.folder("meta");

    if (data?.collections[0].gif) gifs = file.folder("gifs");

    data?.collections.map((element: any, index: number) => {
      var idx = element.image.indexOf("base64,") + "base64,".length;
      var content = element.image.substring(idx);
      images.file(`${index + 1}.png`, content, { base64: true });

      // add gifs
      if (element.gif)
        gifs.file(`${index + 1}.gif`, element.gif, { base64: true });

      // add meta
      meta.file(
        `${index + 1}.json`,
        Buffer.from(JSON.stringify(element.meta, null, 4))
      );
    });

    // add meta data
    meta.file(
      `metadata.json`,
      Buffer.from(JSON.stringify(data?.metadata, null, 4))
    );

    // download
    const content = await zip.generateAsync({ type: "blob" });

    setDownloading(false);

    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(content);
    link.download = `${filename}.zip`;
    link.click();
  };

  const backToEdit = () => {
    window.scrollTo(0, 0);
    setShowResults(false);
    setError(null);
  };

  // Error
  if (!data)
    return (
      <div className="results-panel">
        <header className="text-center">
          <h3 className="mb-3">An Error Occured</h3>
          <h6>Please try again</h6>
        </header>

        {/* show collections */}
        <div className="collection-images">
          <div className="options-bar text-center mb-3">
            <div className="container">
              <Button onClick={backToEdit} className="me-3 btn-sm">
                <MdModeEditOutline /> Back To Edit
              </Button>
              <Button theme="white" onClick={generate} className="me-3 btn-sm">
                <AiOutlineReload /> Regenerate
              </Button>
            </div>
          </div>
        </div>
      </div>
    );

  // Show Data
  return (
    <div className="settings-panel">
      {nftAlert && <Alert type="success" msg="NFT minted successfully" />}
      <header className="text-center">
        <h3 className="mb-3">{collectionName} Collection</h3>
        <h6>
          {collectionSize} Item{collectionSize > 1 && "s"}
        </h6>
      </header>

      {/* show collections */}
      <div className="collection-images">
        <div className="options-bar text-center mb-3">
          <div className="container">
            <Button onClick={backToEdit} className="me-3 btn-sm">
              <MdModeEditOutline /> Back To Edit
            </Button>
            <Button theme="white" onClick={generate} className="me-3 btn-sm">
              <AiOutlineReload /> Regenerate
            </Button>
            <Button theme="white" onClick={downloadZip} className="btn-sm">
              {downloading ? (
                <AiOutlineLoading className="loading-icon" />
              ) : (
                <HiFolderDownload />
              )}{" "}
              Download
            </Button>
            <Button theme="white" onClick={mintOpenSea} className="btn-sm" >
              {openseaLoading ? (
                <AiOutlineLoading className="loading-icon" />
              ) : "Mint OpenSea"}
            </Button>
            <Button theme="white" onClick={mintRarible} className="btn-sm" >
              {raribleLoading ? (
                <AiOutlineLoading className="loading-icon" />
              ) : "Mint Rarible"}
            </Button>
          </div>
        </div>

        <div className="container">
          <div className="collections-block">
            <div className="row">
              {results.map(({ image, gif }: any, index: number) => {
                return (
                  <div className="col-md-2 col-6" key={`result-item-${index}`}>
                    <ResultsItem
                      image={image}
                      gif={gif ? URL.createObjectURL(gif) : null}
                    />
                  </div>
                );
              })}

              {results.length < data.collections.length && (
                <div className="text-center mt-5">
                  <Button className="btn-sm" onClick={showMore}>
                    Show More
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
