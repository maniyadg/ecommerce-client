import React from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
function Dashboard() {
  const [accessToken] = useAuth()
  return (
    <Layout title={"Dashboard - F-Cart"}>
    <div className="container-flui m-3 p-3">
    <div className="row">
      <div className="col-md-3">
        <UserMenu />
      </div>
      <div className="col-md-9">
        <div className="card w-75 p-3">
          <h3>{accessToken.user.name}</h3>
          <h3>{accessToken.user.email}</h3>
          <h3>{accessToken.user.address}</h3>
        </div>
      </div>
    </div>
  </div>    </Layout>  )
}

export default Dashboard