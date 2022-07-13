import React from 'react'

export default function Alert({msg, type}) {
  return (
    type === 'error' ?
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Cool down!</strong> {msg}.
    </div> :
    <div className="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Success! </strong> {msg}.
    </div>
  )
}
