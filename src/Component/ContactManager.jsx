import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home'
import User from './User'
import Navbar from './Navbar'
import LoginPage from './LoginPage'
import SingUp from './SingUp'
import Add_User from './Add_User'

const ContactManager = (id) => {
  const router=createBrowserRouter([
    {
      path:"/",
      element: <><LoginPage/></>
   },
    {
      path:"/home",
      element: <><Navbar/><Home/></>
   },
    {
       path:"/Add",
       element:<><Navbar/><Add_User/></>
    },
    {
      path:"/User",
      element:<><Navbar/><User/></>
   },
   {
    path:"/login",
    element:<><LoginPage/></>
 },
 {
  path:"/SignUp",
  element:<><SingUp/></>
},
])
  return (
    <div>
      <RouterProvider router={router}/> 

    </div>
  )
}

export default ContactManager
