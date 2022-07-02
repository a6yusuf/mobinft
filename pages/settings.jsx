import React from 'react'
import Page from '../components/Page'
import { useSelector } from 'react-redux';
import Profile from '../components/Profile';
import Password from '../components/Password';
import Web3Set from './../components/Web3Set';

export default function Settings() {

  const state = useSelector(state => state.auth)
  let user = state?.user

  return (
      <Page title="Settings">
          <div className="settings-panel">
            <div className='container-fluid settings-container'>
              <div className="d-flex align-items-start" style={{height: '80vh', marginTop: 5}}>
                <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical" style={{width: '20%'}}>
                  <button className="nav-link active" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">Profile</button>
                  <button className="nav-link" id="v-pills-Password-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Password" type="button" role="tab" aria-controls="v-pills-Password" aria-selected="false">Password</button>
                  <button className="nav-link" id="v-pills-Web3-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Web3" type="button" role="tab" aria-controls="v-pills-Web3" aria-selected="false">Web3</button>
                </div>
                <div className="tab-content" id="v-pills-tabContent" style={{width: '80%'}}>
                  <div className="tab-pane fade show active" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                    <Profile profile={user} />
                  </div>
                  <div className="tab-pane fade" id="v-pills-Password" role="tabpanel" aria-labelledby="v-pills-Password-tab">
                    <Password />
                  </div>
                  <div className="tab-pane fade" id="v-pills-Web3" role="tabpanel" aria-labelledby="v-pills-Web3-tab">
                    <Web3Set />
                  </div>
                </div>
              </div>
            </div>
            </div>
      </Page>
  )
}
