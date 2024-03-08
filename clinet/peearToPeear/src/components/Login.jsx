import { useContext, useRef } from "react"
import { MainContextApi } from "../contextapi/mainapi";

const Login=()=>{
    const {handleLogin} =useContext(MainContextApi);
    const inputRef=useRef();
    const submitBtn=()=>{
        handleLogin(inputRef.current.value)
        inputRef.current.value="";
    }
    return (
        <>
        <input ref={inputRef} type="text" name="" id=""  placeholder="Enter Your UserName"/>
        <button onClick={submitBtn}>Login</button>
        </>
    )
}
export default Login;