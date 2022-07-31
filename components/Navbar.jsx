import React, {useEffect} from "react";
import NavLink from "./NavLink";
import Avartar from "./Avartar";
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from "../store/actions/AuthAction";
import Cookie from 'js-cookie';


const Navbar = () => {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME;

  const router = useRouter()
  const state = useSelector(state => state.auth)
  let name = state?.user?.name
  let role = state?.user?.role
  let profile_picture = state?.user?.profile_picture


  // console.log("User: ", packages)

  const dispatch = useDispatch()

  const handleLogout = () => {
    Cookie.remove('token'); 
    dispatch(logout())
    router.push('/login/app')
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/app">
          {/* <Image src="/docs/5.1/assets/brand/bootstrap-logo.svg" alt="" width="30" height="24" className="d-inline-block align-text-top" /> */}
            {businessName}
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-between"
            id="navbarSupportedContent"
          >
            <div className="mr-auto" />

            <ul className="navbar-nav my-2 my-lg-0">
              {/* {pathname !== "/app" && (
                <li className="nav-item me-2">
                  <Button className="btn-sm" to="/app">
                    Generate Collection
                  </Button>
                </li>
              )} */}
              <li className="nav-item nav-toplink">
                <NavLink className="nav-link" to="/dashboard">
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item nav-toplink">
                <NavLink className="nav-link" to="/app">
                  New Project
                </NavLink>
              </li>
              <li className="nav-item nav-toplink">
                <NavLink className="nav-link" to="/settings">
                  Settings
                </NavLink>
              </li>
              {role === 'admin' && <li className="nav-item nav-toplink">
                <NavLink className="nav-link" to="/users">
                  Users
                </NavLink>
              </li>}
              {(role === 'agency' || role === 'admin') && <li className="nav-item nav-toplink">
                <NavLink className="nav-link" to="/agency">
                  Users
                </NavLink>
              </li>}
              <li className="nav-item nav-toplink">
                <NavLink className="nav-link" to="/training">
                  Training
                </NavLink>
              </li>
              <li className="nav-item nav-toplink">
                <NavLink className="nav-link" to="/support">
                  Support
                </NavLink>
              </li>
              <li className="nav-item nav-toplink">
                <a className="nav-link" href="#" onClick={handleLogout}>
                  Logout
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  {profile_picture === 'NA' && <Avartar user={name}/>}
                  {profile_picture !== 'NA' && <div className='profile-wrapper' onClick={() => router.push('/settings')}>
                      <p className='user-name' >{name}</p>
                      <img src={profile_picture} alt="profile pics" style={{width:35, borderRadius: '100%'}} />
                  </div>}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
