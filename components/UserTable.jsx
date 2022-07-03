import React from 'react'
import { FaTrash } from 'react-icons/fa'
import { useState } from 'react';
import dayjs from 'dayjs';
import { validateEmail } from './../helpers/validateEmail';
import { useSelector } from 'react-redux';

export default function UserTable({data, handleDelete, packages, handleData, handlePackage, submit, handleExport}) {

    const [query, setQuery] = useState('')
    const [found, setFound] = useState(undefined)
    const state = useSelector(state => state.auth)
    let role = state?.user?.role

    const search = () => {
        if(query && validateEmail(query)){
            let foun = data.find(item => item.email === query)
            setFound(foun)
        }
    }


  return (
    <div className="table-responsive" style={{margin: 10}}>
        <div>
        <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">Search User</span>
            <input type="text" onChange={e => setQuery(e.target.value)} name='email' className="form-control" aria-label="Sizing example input" placeholder="Enter user's email" aria-describedby="inputGroup-sizing-default" />
        </div>
        {found &&
        <div>
            <button className='btn btn-primary' style={{marginRight: 10}} onClick={() => setFound(undefined)}>Clear search</button>
            <table className="table table-striped">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Package</th>
                <th scope="col">Created</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr key={found.id}>
                    <th scope="row">{1}</th>
                    <td>{found.name}</td>
                    <td>{found.email}</td>
                    <td>{found.packages}</td>
                    <td>{dayjs(found.created_at).format('MMM D YY, h:mm a')}</td>
                    <td>
                        <FaTrash style={{color: 'red', cursor: 'pointer'}} onClick={() => handleDelete(found.id)}/>
                    </td>
                </tr>
            </tbody>
            </table>
        </div>}
        {!found && <div className="input-group mb-3">
            <button className='btn btn-primary' style={{marginRight: 10}} onClick={search}>Search</button>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" style={{marginRight: 10}}data-bs-target="#exampleModal">
            Add User
            </button>
            <button type="button" className="btn btn-primary" onClick={handleExport}>
            Export Users
            </button>
        </div>}
        </div>
        {!found && <table className="table table-striped">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Package</th>
                <th scope="col">Created</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item,index) => {
                    return (
                        <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.packages}</td>
                            <td>{dayjs(item.created_at).format('MMM D YY, h:mm a')}</td>
                            <td>
                                <FaTrash style={{color: 'red', cursor: 'pointer'}} onClick={() => handleDelete(item.id)}/>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>}
        {
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Add New User</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <div className="input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-default">Name</span>
                    <input type="text" className="form-control" onChange={handleData} name='name' aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
                    <div className="input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-default">Email</span>
                    <input type="text" className="form-control"  onChange={handleData} name='email' aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
                    {packages && <div className="card">
                        <div className="card-body">
                            {[... new Set(packages)].join(', ')}
                        </div>
                    </div>}
                    <div className="input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-default">Packages</span>
                        <select className="form-select" aria-label="Default select example" onChange={handlePackage}>
                        <option selected value="fe">Basic</option>
                        {role === "admin" && <option value="pro">Pro</option>}
                        {/* <option value="agency">Agency</option> */}
                    </select>
                    </div>
                    <div className="input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-default">Role</span>
                        <select className="form-select" name='role' aria-label="Default select example" onChange={handleData}>
                        <option selected value="user">User</option>
                        {role === "admin" && <option value="admin">Admin</option>}
                        {role === "admin" && <option value="agency">Agency</option>}
                    </select>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" style={{background: 'red', color: 'white'}}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={submit}>Add</button>
                </div>
                </div>
            </div>
            </div>}
    </div>
  )
}
