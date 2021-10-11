import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Button, TextInput } from 'react-native'
import Peer from 'react-native-peerjs'
import {
  RTCView,
  mediaDevices
} from 'react-native-webrtc';
//import { io } from "socket.io-client";

const App = () => {

  const [peer, setPeer] = useState(new Peer());
  const [myId, setMyId] = useState('');
  const [conn, setConn] = useState(null);
  const [remoteId, setRemoteId] = useState('');
  //let { current: con } = useRef();
  const [con, setCon] = useState({});
  const [isFront, setIsFront] = useState(true);
  const [myStream, setMyStream] = useState();
  const [peerStream, setPeerStream] = useState();

  let txt = useRef();

  useEffect(() => {
    console.log("peer object ", peer);
    // alert("peerobject")
    //localStrm();

    peer.on('open', (id) => {
      //setMyid
      setMyId(id);
      console.log("my id ", id)
      // alert(id)
    })
    //data connection
    peer.on('connection', (rmtconn) => {
      console.log("remote connection ", rmtconn);
      rmtconn.on('open', () => {
        rmtconn.on('data', (data) => {
          console.log("data friom another client ", data);
        });
      });
    })

    //when we get call
    peer.on('call', async function (call) {
      // Answer the call, providing our mediaStream
      //getting media stream 
      let stream = await getMyStream();
      //if media stream present
      setMyStream(stream)
      call.answer(stream);
      console.log("*****************local stream inside peer.on(call) ", stream)
      //when we grt remote stream
      call.on('stream', (rmtstream) => {
        console.log("***** remote stream inside peer.on(call) event", rmtstream.toURL());
        setPeerStream(rmtstream);
      })
    });

  }, [])

  const getMyStream = () => {
    let sourceInfos = mediaDevices.enumerateDevices();
    // console.log("sources info ", sourceInfos);
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
        videoSourceId = sourceInfo.deviceId;
      }
    }
    let stream = mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 640,
        height: 480,
        frameRate: 30,
        facingMode: (isFront ? "user" : "environment"),
        deviceId: videoSourceId
      }
    })
    return stream;
  }

  //make a call
  const makeCall = async () => {
    //check weather remote id 
    console.log("remoted id stored locally ", remoteId);
    //if media stream present
    //getting media stream 
    let stream = await getMyStream();
    // if stream is present 
    console.log("********local stream inside  making call", stream);
    //set Local stream
    setMyStream(stream);
    let call = peer.call(remoteId, stream);
    call.on('stream', (remoteStream) => {
      //another peer media
      console.log("*** remote stream inside inside makecall() ", remoteStream.toURL());
      setPeerStream(remoteStream);
    })
  }

  return (
    <View>
      <Text>hellooooooooo am  clientA heyy  https://local:3000</Text>
      <TextInput onChangeText={(el) => { txt.current = el }} />
      <Button
        title="connect" onPress={() => {
          console.log(txt.current)
          setRemoteId(txt.current)
        }} />
      <Button
        title="make call" onPress={() => { makeCall() }} />
      <Text>Local Stream</Text>
      {myStream && <RTCView streamURL={myStream  && myStream.toURL()} style={{ height: 200, width: 400 }}/>}
      {/* {myStream && console.log("LOCAL STREAM INSIDE render function ", myStream)} */}
      <Text>Remote Stream</Text>
      {peerStream && <RTCView style={{ height: 200, width: 400 }} streamURL={peerStream.toURL()} />}
    </View>
  )

}
export default App;

