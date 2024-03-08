import { useContext, useEffect, useRef } from "react";
import { MainContextApi } from "../contextapi/mainapi";

const Calling=()=>{
    const {handleCall,userName,remoteStream,localStream,handledIceCandidate}=useContext(MainContextApi);
    const inputRef=useRef();
    const localAudioRef=useRef();
    const remoteAudioRef=useRef();

   
    if(localAudioRef.current!=null){
        localAudioRef.current.srcObject = localStream;
        remoteAudioRef.current.srcObject = remoteStream;
    }
           
        
        console.log("inside audio useeffect",localStream,remoteStream);

    const call=()=>{
        handleCall(inputRef.current.value)
        inputRef.current.value="";

    }
    return (
        <>
        <p>your UserName: {userName}</p>
        <input type="text" ref={inputRef} />
        <button onClick={call}>Call</button>
        <br />
        
        <video ref={remoteAudioRef}  id="local" controls autoPlay playsInline ></video>
        <video ref={localAudioRef}  style={{width:"200px",height:"190px",marginLeft:"10px"}}  id="remote" controls autoPlay playsInline ></video>

        
        <br />
        <button onClick={handledIceCandidate}> send ICE</button>

        </>
    )
}
export default Calling;