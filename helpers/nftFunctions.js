import Moralis from 'moralis'
import Web3 from 'web3';
// import { contractABI, contractAddress } from './contract';
import Axios from 'axios'

const contractUrl = process.env.NEXT_PUBLIC_CONTRACT_URL
const apiKey = process.env.NEXT_PUBLIC_API_KEY

const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

 const capitalizeEachWord = arg => {
     if(!arg.split(' ')){
        return arg
     }else {
         let arr = []
         arg.split(' ').map(item => arr.push(capitalizeFirstLetter(item)))
         return arr.join('')
     }
 }

export const singleRarible = async  (name, desc, img, user) => {
    
    const web3 = await Moralis.enableWeb3();
    const imageFile = new Moralis.File(img.name, img)
    await imageFile.saveIPFS();
    let imageHash = imageFile.hash();

    let imageFileUrl = imageFile.ipfs()
    
    let metadata = {
        name: name,
        description: desc,
        image: "/ipfs/" + imageHash
    }
    console.log(metadata);
    const jsonFile = new Moralis.File(`${name}metadata.json`, {base64 : Buffer.from(JSON.stringify(metadata)).toString("base64")});
    await jsonFile.saveIPFS();

    let metadataHash = jsonFile.hash();
    console.log(jsonFile.ipfs())
    let res = await Moralis.Plugins.rarible.lazyMint({
        chain: 'rinkeby',
        userAddress: user.get('ethAddress'),
        tokenType: 'ERC721',
        tokenUri: 'ipfs://' + metadataHash,
        royaltiesAmount: 5, // 0.05% royalty. Optional
    })
    let nftData = {tokenAddress: res.data.result.tokenAddress, tokenId: res.data.result.tokenId, url: `https://rinkeby.rarible.com/token/${res.data.result.tokenAddress}:${res.data.result.tokenId}`, metadataHash, imageFileUrl}
    return nftData;
}
export const bulkRarible = async  (name, desc, user, collection) => {
    
    const web3 = await Moralis.enableWeb3();

    let ipfsArray = [];
    let ipfsArray2 = [];
    let promises = [];
    let hash = ''

    collection.map((item, index) => {
        let paddedHex = ("0000000000000000000000000000000000000000000000000000000000000000" + (index + 1).toString(16)).substr("-64");
        ipfsArray.push({
                        path: `images/${paddedHex}.png`,
                        content: item.image
                    })
    })
    Axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", 
        ipfsArray,
        {
            headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json",
                "accept": "application/json"
            }
        }
    ).then( (res) => {
        console.log(res.data);
        hash = res.data[0].path.split('/')[4]
        uploadJSON(hash, apiKey, res.data[0].path)

    })
    .catch ( (error) => {
        console.log(error)
    })
    
    //Upload json
    const uploadJSON = async (hsh, key, img) => {
        for (let i = 1; i <= collection.length; i++) {
            let paddedHex = ("0000000000000000000000000000000000000000000000000000000000000000" + i.toString(16)).substr("-64");
            ipfsArray2.push({
                path: `metadata/${paddedHex}.json`,
                content: {
                    image: `ipfs://${hsh}/images/${paddedHex}.png`,
                    name: `${name} #${i}`,
                    description: desc
                }
            })
        }

        Axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", 
        ipfsArray2,
        {
            headers: {
                "X-API-KEY": key,
                "Content-Type": "application/json",
                "accept": "application/json"
            }
        }
        ).then( (resp) => {
            console.log("uploaded json: ", resp.data);
            let hashh = resp.data[0].path.split('/')[4]
            //lazy mint
            Moralis.Plugins.rarible.lazyMint({
                chain: 'rinkeby',
                userAddress: user.get('ethAddress'),
                tokenType: 'ERC1155',
                tokenUri: `/ipfs/${hashh}`,
                royaltiesAmount: 5, // 0.05% royalty. Optional
                // supply: 100,
                // list: true, // Only if lazy listing
                // listTokenAmount: 3, // Only if lazy listing
                // listTokenValue: 10 ** 18, // Only if lazy listing
                // listAssetClass: 'ETH', // only if lazy listing  || optional
              })
              .then(res => {
                  let nftData = {tokenAddress: res.data.result.tokenAddress, imageFileUrl: img, metadataUrl: resp.data}
                  return nftData;
              })
        })
        .catch ( (error) => {
            console.log(error)
        })
    }

}

// export const openSea = async  (name, desc, img, user, collectionSize) => {

//     try {
//         const web3 = new Web3(Web3.givenProvider)
//         const metamaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
//         web3.setProvider(metamaskProvider);
        
//         const web = await Moralis.enableWeb3();
//         const imageFile = new Moralis.File(img.name, img)
//         await imageFile.saveIPFS();
//         let imageHash = imageFile.hash();

//         let imageFileUrl = imageFile.ipfs()
    
//         let metadata = {
//             name: name,
//             description: desc,
//             image: imageFileUrl
//         }
//         console.log(metadata);
//         const jsonFile = new Moralis.File(`${name}metadata.json`, {base64 : Buffer.from(JSON.stringify(metadata)).toString("base64")});
//         await jsonFile.saveIPFS();
    
//         let metadataHash = jsonFile.hash();
//         console.log(jsonFile.ipfs())
//         let metadataUrl = jsonFile.ipfs()
  
//         let cont = buildContract(name, false)
//         // console.log("contract: ", cont)
//         Axios.post(contractUrl, {contract: cont})
//         .then(res => {
//             console.log(res.data)
//             let bi = res.data.abi
//             let bytecod = res.data.bytecode
//             let contract = new web3.eth.Contract(bi)
//             contract.deploy({data: bytecod}).send({from: user.get("ethAddress")})
//         })
//         .then(contract.methods.mint(metadataUrl).send({from: user.get("ethAddress")}))
//         .then(console.log)
//         .catch(error => console.error(error))
//         // let response = webDeploy(abi, bytecode)
//         // let contract = new web3.eth.Contract(contractABI, contractAddress)
//         // let response = await contract.methods.mint(metadataUrl).send({from: user.get("ethAddress")})
//         // let tokenId = response.events.Transfer.returnValues.tokenId
//         // return {contractAddress, tokenId, imageFileUrl, metadataUrl}
//         // console.log(response)
      
    
//     } catch (error) {
//         console.error(error)
//     }

// }

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const mintCollection1 = async (file, name, desc, user, collectionName) => {
    
    
    let ipfsArray = [];
    let ipfsArray2 = [];
    let promises = [];
    let hash = ''
    let img = await toBase64(file)
    
    let paddedHex = ("00000000000000000000000000000000000000000000000000000000000000001".toString(16)).substr("-64");
    ipfsArray.push({
        path: `images/${paddedHex}.png`,
        content: img
    })

        Axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", 
            ipfsArray,
            {
                headers: {
                    "X-API-KEY": apiKey,
                    "Content-Type": "application/json",
                    "accept": "application/json"
                }
            }
        ).then( (res) => {
            // console.log(res.data);
            hash = res.data[0].path.split('/')[4]
            uploadJSON(hash, apiKey, res.data[0].path)
        })
        .catch ( (error) => {
            console.log(error)
        })

    const uploadJSON = async (hsh, key, img) => {
        let paddedHex = ("00000000000000000000000000000000000000000000000000000000000000001".toString(16)).substr("-64");
        ipfsArray2.push({
            path: `metadata/${paddedHex}.json`,
            content: {
                image: `ipfs://${hsh}/images/${paddedHex}.png`,
                name: `${name} #1`,
                description: desc
            }
        })

        Axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", 
        ipfsArray2,
        {
            headers: {
                "X-API-KEY": key,
                "Content-Type": "application/json",
                "accept": "application/json"
            }
        }
        ).then( (res) => {
            console.log("uploaded json: ", res.data);
            let hashh = res.data[0].path.split('/')[4]
            //compile contract
            let contract = buildContract(name, hashh, collectionName, 1)
            compile(contract, contractUrl, user).then(res => {
                // console.log("Res: ", res)
                return {contactAddress: res, imageFileUrl: img, metadataUrl: res.data[0].path}
            })
        })
        .catch ( (error) => {
            console.log(error)
        })
    }
}

export const mintCollection2 = async (name, desc, user, collection, collectionName) => {
    
    
    let ipfsArray = [];
    let ipfsArray2 = [];
    let promises = [];
    let hash = ''

    collection.map((item, index) => {
        let paddedHex = ("0000000000000000000000000000000000000000000000000000000000000000" + (index + 1).toString(16)).substr("-64");
        ipfsArray.push({
                        path: `images/${paddedHex}.png`,
                        content: item.image
                    })
    })
    Axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", 
        ipfsArray,
        {
            headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json",
                "accept": "application/json"
            }
        }
    ).then( (res) => {
        console.log(res.data);
        hash = res.data[0].path.split('/')[4]
        uploadJSON(hash, apiKey, res.data[0].path)

    })
    .catch ( (error) => {
        console.log(error)
    })
    
    //Upload json
    const uploadJSON = async (hsh, key, img) => {
        for (let i = 1; i <= collection.length; i++) {
            let paddedHex = ("0000000000000000000000000000000000000000000000000000000000000000" + i.toString(16)).substr("-64");
            ipfsArray2.push({
                path: `metadata/${paddedHex}.json`,
                content: {
                    image: `ipfs://${hsh}/images/${paddedHex}.png`,
                    name: `${name} #${i}`,
                    description: desc
                }
            })
        }

        Axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", 
        ipfsArray2,
        {
            headers: {
                "X-API-KEY": key,
                "Content-Type": "application/json",
                "accept": "application/json"
            }
        }
        ).then( (res) => {
            console.log("uploaded json: ", res.data);
            let hashh = res.data[0].path.split('/')[4]
            //compile contract
            let contract = buildContract(name, hashh, collectionName, 1)
            compile(contract, contractUrl, user).then(res => {
                console.log("Res: ", res)
                return {contactAddress: res, imageFileUrl: img, metadataUrl: res.data[0].path}
            })
        })
        .catch ( (error) => {
            console.log(error)
        })
    }
}
//Build smart contract 
const buildContract = (name, hash, collectionName, collectionSize) => {
    

    let erc1155 = `// SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;
    
    import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";

    
    
    contract ${capitalizeEachWord(name)} is ERC1155, Ownable {
        string public name;

        constructor()
            ERC1155("ipfs://${hash}/metadata/{id}.json" )
        
        {
            setName('${collectionName}');
            for (uint i = 1; i <= ${collectionSize}; i++) {
            _mint(msg.sender, i, 1, "");
            }
        }
        
        function setName(string memory _name) public onlyOwner {
            name = _name;
        }
    }`

    return erc1155
}

//compile and deploy smart contract
const compile = async (contract, contractUrl, user) => {
    const web3 = new Web3(Web3.givenProvider)
    const metamaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
    web3.setProvider(metamaskProvider);
    
    const web = await Moralis.enableWeb3();
    let txHash;
    Axios.post(contractUrl, {contract})
        .then(res => {
            console.log(res.data)
            let bi = res.data.abi
            let bytecod = res.data.bytecode
            let contract = new web3.eth.Contract(bi)
            contract.deploy({data: bytecod}).send({from: user.get("ethAddress")})
                .on('transactionHash', hash => txHash = hash)
                .on('receipt', receipt => {
                // receipt example
                console.log("trans: ", receipt)
                return receipt.contractAddress
            })
        })
        .catch(error => {
            console.error(error)
            if(error.includes('not mined within 50 blocks')) {
                const handle = setInterval(() => {
                  web3.eth.getTransactionReceipt(txHash).then((resp) => {
                    if(resp != null && resp.blockNumber > 0) {
                      clearInterval(handle);
                      console.log("trans: ", resp)
                      return resp.contractAddress
                    }
                  })
                })
            }
        })
}
