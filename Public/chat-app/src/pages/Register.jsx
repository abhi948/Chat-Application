import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from "../assests/logo.svg"
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios';
import { registerRoute } from '../utils/APIRoutes';

const Register = () => {

  const nav = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    pass: "",
    cnfmpass: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(handleValidation()){
      const { username, email, pass } = values;
      const data = await axios.post(registerRoute,{
        username,email,pass
      });
      console.log("Message",data.data);

      if (data.data.status === false){
        toast.error(data.msg, toastOptions);
      }
      if(data.data.status === true){
        console.log('ababababbab',data.data)
        localStorage.setItem('chat-app-user',JSON.stringify(data.data.user));
        console.log('the data is iiiisssss',JSON.parse(localStorage.getItem('chat-app-user')));
        nav("/");
        // console.log("success data");
      }
      // nav("/");
    }
  };

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark'
  }

  useEffect(()=>{
    if(localStorage.getItem('chat-app-user')){
      nav('/');
    }
  })

  const handleValidation = () => {
    const { username, email, pass, cnfmpass } = values;
    if (pass !== cnfmpass) {
      toast.error("Password and confirm password must be Same.", toastOptions)
      return false;
    }
    else if(username.length<3){
      toast.error("Username should greater than 3 character.", toastOptions)
      return false;
    }
    else if(pass.length<8){
      toast.error("Password should greater than 7 character.", toastOptions)
      return false;
    }else if(email ===""){
      toast.error("Email is required..", toastOptions);
      return false;
    }else{
      toast.error("Email is already exists..", toastOptions)
    }
    return true;
    
  }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={logo} alt="logo" />
            <h1>Snappy</h1>
          </div>
          <input type="text" placeholder='Username' name='username' onChange={(e) => handleChange(e)} />

          <input type="email" placeholder='Email' name='email' onChange={(e) => handleChange(e)} />

          <input type="password" placeholder='Password' name='pass' onChange={(e) => handleChange(e)} />

          <input type="password" placeholder='Confirm Password' name='cnfmpass' onChange={(e) => handleChange(e)} />

          <button type="submit">Create User</button>

          <span>Already have an account? <Link to='/login'>Login</Link></span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vm;
  display : flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand{
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content:center;
  
    img{
      height: 5rem;
    }
    h1{
      color:white;
      text-transform: uppercase;
    }
  }
  form{
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input{
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff ;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus{
      border: 0.1rem solid #997af0 ;
      outline: none;
    }
  }
  button{
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer ;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.3s ease-in-out;
    &:hover{
      background-color: #4e0eff;
    }
  }
  span{
    color: white;
    text-transform: uppercase;
    a{
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Register