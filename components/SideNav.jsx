import React from 'react'
import {RiDashboardLine} from 'react-icons/ri';
import { FaImages, FaGraduationCap, FaPlus, FaSignOutAlt, FaToolbox, FaUsers } from 'react-icons/fa';
import { FaGlobe } from 'react-icons/fa';
import NavLink from './NavLink';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import { useSelector } from 'react-redux';


export default function SideNav() {

  const { pathname } = useRouter();
  const router = useRouter()

  const state = useSelector(state => state.auth)
  let role = state?.user?.role
  let packages = state?.user?.packages



  const handleLogout = () => {
    // setUser({})
    Cookie.remove('token');
    // logout() 
    router.push('/login/app')
  }
  
    const handleSupport = () => {
    window.location = "mailto:support@mobinft.co";
    };

    const handleTutorial = () => {
        const link = "https://getmobinft.com/mobinft-training";
        window.open(link, "_blank");
    };

    const handleStockPro = () => {
        const link = "https://stockprohub.com/login/";
        window.open(link, "_blank");
    };
    
        
    return (
                <aside className="main-nav">
                    <nav >
                        <div>
                            <ul className="nav-menu-items">
                                <li className={pathname === "/dashboard" ? "nav-active" : "nav-item"}>
                                    <RiDashboardLine className='nav-icon'/>
                                    <NavLink className="nav-text" to="/dashboard">
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li className={pathname === "/new-project" ? "nav-active" : "nav-item"}>
                                    <FaPlus className='nav-icon'/>
                                    <NavLink className="nav-text" to="/new-project">
                                        New Project
                                    </NavLink>
                                </li>
                                <li className={pathname === "/settings" ? "nav-active" : "nav-item"}>
                                    <FaToolbox className='nav-icon'/>
                                    <NavLink className="nav-text" to="/settings">
                                        Settings
                                    </NavLink>
                                </li>
                                {role === 'admin' && <li className={pathname === "/users" ? "nav-active" : "nav-item"}>
                                    <FaUsers className='nav-icon'/>
                                    <NavLink className="nav-text" to="/users">
                                        Users
                                    </NavLink>
                                </li>}
                                {(role === 'agency' || role === 'admin') && <li className={pathname === "/agency" ? "nav-active" : "nav-item"}>
                                    <FaUsers className='nav-icon'/>
                                    <NavLink className="nav-text" to="/agency">
                                        Agency
                                    </NavLink>
                                </li>}
                                {(packages.includes('stockpro') || role === 'admin') && <li className="nav-item">
                                    <FaImages className='nav-icon'/>
                                    <a className="nav-text" href="#" onClick={handleStockPro}>
                                        StockPro
                                    </a>
                                </li>}
                                <li className="nav-item">
                                    <FaGraduationCap className='nav-icon'/>
                                    <a className="nav-text" href="#" onClick={handleTutorial}>
                                        Training
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <FaGlobe className='nav-icon'/>
                                    <a className="nav-text" href="#" onClick={handleSupport}>
                                        Support
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <FaSignOutAlt className='nav-icon'/>
                                    <a className="nav-text" href='#' onClick={handleLogout}>
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </aside>
    )
}
