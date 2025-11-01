import React from 'react'
import Signin from './components/auth/sign'
import Dashboard from './components/dashboard/dashboard1'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  [
    {
      path:"/",
      element:<Signin/>

    },
    {
      path:"/dashboard",
      element:<Dashboard/>
    }
  ]
)

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
