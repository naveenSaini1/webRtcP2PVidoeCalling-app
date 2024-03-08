import { createContext, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from 'stompjs';


export const MainContextApi = createContext();



function MainContextApiProvider({ children }) {
    const [peerConnectionState, setPeerConnectionState] = useState();
    const [singling, setSingling] = useState();
    const [userName, setUserName] = useState(null);
    const [localStream, setLocalStream] = useState()
    const [remoteStream, setRemoteStream] = useState();
    const [iceCandidateState, setIceCandidateState] = useState();
    const [senderState, setSenderState] = useState();

    async function handlePeearConnecton(peerConnection) {

        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })

        console.log("ice candidate event outside", stream);
        setLocalStream(stream);

        let track = stream.getTracks()
        console.log("tracksss", track)
        peerConnection.addTrack(track[0], stream)

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                setIceCandidateState(event.candidate);
                console.log("ice candidate event");
                //     let iceCandidateObject = {
                //         userName: userName,
                //         type: "iceCandidate",
                //         data: event.candidate,
                //     };
                //     stomp.send("/app/sendInfo", {}, JSON.stringify(iceCandidateObject));
            }
        };

        peerConnection.ontrack = (event) => {
            const [remoteStream] = event.streams;
            console.log("adding remote track", event.streams);
            setRemoteStream(remoteStream);
        };


    }


    useEffect(() => {
        if (userName != null) {
            const socket = new SockJS('http://localhost:8080/ws');
            const stomp = Stomp.over(socket);
            stomp.connect({}, () => {
                console.log('WebSocket connected');
                setSingling(stomp);
            });
            const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
            const peerConnection = new RTCPeerConnection(configuration);
            handlePeearConnecton(peerConnection);
            setPeerConnectionState(peerConnection);

        }
    }, [userName])

    useEffect(() => {
        if (userName != null && singling != null) {
            console.log("suscribeing ho gaya", userName)
            singling.subscribe(`/topic/${userName}`, async (response) => {
                let res = JSON.parse(response.body);
                console.log(peerConnectionState, "peerConnectionstate in suscirbe method")
                switch (res.type) {
                    case "offer":
                        {
                            peerConnectionState.setRemoteDescription(new RTCSessionDescription(res.data));
                            const answer = await peerConnectionState.createAnswer();
                            await peerConnectionState.setLocalDescription(answer);
                            setSenderState(res.senderName);
                            let object = {
                                userName: res.senderName,
                                senderName: userName,
                                type: "answer",
                                data: answer
                            }
                            singling.send("/app/sendInfo", {}, JSON.stringify(object));
                            console.log("offer", answer);
                            break;

                        }
                    case "answer":
                        {
                            const remoteDesc = new RTCSessionDescription(res.data);
                            await peerConnectionState.setRemoteDescription(remoteDesc);
                            console.log("answer", res);
                            let iceCandidateObject = {
                                userName: senderState,
                                type: "iceCandidate",
                                data: iceCandidateState
                            };
                            singling.send("/app/sendInfo", {}, JSON.stringify(iceCandidateObject));


                            break;

                        }
                    case "iceCandidate":
                        {
                            await peerConnectionState.addIceCandidate(res.data);
                            console.log("iceCandidate switch case is called");
                            break

                        }
                }
                console.log(response)
            })



        }
    }, [singling])


    const handleLogin = (userName) => {
        let object = {
            userName,
            type: "login",
            data: "null"
        }
        console.log("handleLogin in Api File: ", object)
        // singling.send("/app/sendInfo", {}, JSON.stringify(object));
        setUserName(userName);
    }

    useEffect(() => {
        if (senderState != null) {
            console.log("andled ice candidate================== ", senderState);

            let iceCandidateObject = {
                userName: senderState,
                type: "iceCandidate",
                data: iceCandidateState
            };
            singling.send("/app/sendInfo", {}, JSON.stringify(iceCandidateObject));

        }
    }, [senderState])

    const handleCall = async (userNames) => {
        setSenderState(userNames);
        console.log("peeeeeeeeeeeeeeeee", peerConnectionState);
        let peerConnectionLocal = peerConnectionState;
        try {


            const offer = await peerConnectionLocal.createOffer();
            await peerConnectionLocal.setLocalDescription(offer);

            let object = {
                userName: userNames,
                senderName: userName,
                type: "offer",
                data: offer,
            };

            singling.send("/app/sendInfo", {}, JSON.stringify(object));
            console.log("handledCall Method in api", object, peerConnectionState);
            setPeerConnectionState(peerConnectionLocal);
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    const handledIceCandidate = () => {
        // let iceCandidateObject = {
        //     userName: senderState,
        //     type: "iceCandidate",
        //     data: iceCandidateState
        // };
        // singling.send("/app/sendInfo", {}, JSON.stringify(iceCandidateObject));    
    }

    return (
        <MainContextApi.Provider value={{ handleLogin, userName, handleCall, remoteStream, localStream, handledIceCandidate }}>
            {children}
        </MainContextApi.Provider>
    )
}
export default MainContextApiProvider;