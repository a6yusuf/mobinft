import React from 'react'
import { useMoralis } from 'react-moralis';

export default function Web3Set() {

    const {authenticate, isAuthenticated, logout} = useMoralis()

  return (
    <div>
        <h5 className="card-title">Update Web3 Connection</h5>
        {isAuthenticated && <button className='btn btn-primary' onClick={logout}>Disconnect</button>}
        {!isAuthenticated && <button className='btn btn-primary' onClick={authenticate}>Connect</button>}
    </div>
  )
}
