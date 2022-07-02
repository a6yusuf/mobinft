import React from 'react'

const Error = ({error}) => {
    return (
        <div>
            <p className="login-error-text">{error}</p>
        </div>
    )
}

export default Error;
