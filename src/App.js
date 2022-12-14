import React, { useState, useEffect, useContext } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import Home from "./views/Home"
import { Routes, Route, useNavigate, Outlet } from "react-router-dom"
import { UserContext } from "./context/userContext"
import { API, setAuthToken } from "./config/api"
import Navbars from "./component/Navbars"
import Layout from "./component/Private/Layout"
import AddBook from "./views/AddBook"
import DetailBook from "./views/DetailBook"
import Cart from "./views/Cart"
import './index.css'
import Profile from "./views/Profile"
import ComplainAdmin from "./views/ComplainAdmin"
import ComplainUser from "./views/ComplainUser"
import Invoice from "./views/Invoice"
import ListBookAdmin from "./views/ListBookAdmin"
import EditBook from "./views/EditBook"

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {
  let navigate = useNavigate()

  const [state, dispatch] = useContext(UserContext)
  const [isLoading, setIsloading] = useState(true)

  useEffect(() => {
    if (state.isLogin === false && !isLoading) {
      navigate("/")
    } else {
      if (state.user.role === "admin") {
        navigate("/transaction")
      } else if (state.user.role === "user") {
        navigate("/")
      }
    }

    setAuthToken(localStorage.token)
  }, [state])

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth")

      console.log("check auth", response)

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        })
      }

      let payload = response.data.data

      payload.token = localStorage.token

      dispatch({
        type: "USER_SUCCESS",
        payload,
      })
      console.log("state check auth", state)
      setIsloading(false)
    } catch (error) {
      console.log(error)
      setIsloading(false)
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  const PrivateRoute = () => {
    return state.user.role === "user" ? <Outlet /> : <navigate to="/" />
  };

  const AdminRoute = () => {
    return state.user.role === "admin" ? <Outlet /> : <navigate to="/Admin" />
  };

  return (
    <>
      {isLoading ? null : (
        <>
          <div className="bg">
            <Navbars />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/" element={<AdminRoute />} >
                <Route path="/add-book" element={<AddBook />} />
                <Route path="/complain-admin" element={<ComplainAdmin />} />
                <Route path="/transaction" element={<Invoice />} />
                <Route path="/list-book" element={<ListBookAdmin />} />
                <Route path="/edit-book/:id" element={<EditBook />} />
              </Route>
              
              <Route path="/" element={<PrivateRoute />} >
                <Route path="/detail-book/:id" element={<DetailBook />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/complain-user" element={<ComplainUser />} />
              </Route>
              
            </Routes>
          </div>
        </>
      )}
    </>
  )
}
export default App
