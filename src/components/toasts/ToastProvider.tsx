"use client"

import { Slide, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export const ToastProvider = () => {


  return (
    <ToastContainer
      position="top-center"
      newestOnTop
      autoClose={3000}
      transition={Slide}
      pauseOnHover
      draggable
      
      closeButton={true}
      className={"text-blue-900"}
    />
  )
}
