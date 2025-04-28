
"use client"
 import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useEffect, useReducer } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userinfo } from "@/feature/userinfo";
import { cartinfo } from "@/feature/cart";

export default function Home() {
  let dispatch = useDispatch();
  let router = useRouter()
  useEffect(() =>{
    data()
    dispatch(cartinfo(localStorage.getItem("cart")||0))
    console.log("hello")

  },[])

  let data = async() =>{
    let token = localStorage.getItem("token");
  
    if(token){
      let result = await axios.post("http://localhost:5000/user/user", {token: token});
      if(result.data.success){
        dispatch(userinfo(result.data.data));
        console.log(result.data.success)
        if(result.data.data.role === "salesMan"){
          window.location.href = "./Salesman"
        }
       

      }
      

    }
    else{
      router.push("./SignIn")

    }
   

  }
  
  return (
    <> 
    <Navbar/>
   
    </>
  );
}
