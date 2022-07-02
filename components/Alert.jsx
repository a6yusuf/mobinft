import React from 'react'

export default function Alert({msg, type}) {
  return (
    type === 'error' ?
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Cool down!</strong> {msg}.
        {/* <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> */}
    </div> :
    <div className="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Success</strong> {msg}.
        {/* <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> */}
    </div>
  )
}
