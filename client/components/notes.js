//RTC peer connection object manages another udp connection with a user, helps connect peers, initialize connections, and attach media streams¸
// main task is to set up and create peer connections 
//the add new RTCPeerConnection.onaddstream () allows user remote user to add a video or audio stream to their peer connection
//RTCPeerConnection(config)--- it takes in a configuration that does something

//GetUserMedia API or MediaStream API allows 3 functions
//..  gives developer access to a stream object that holds web and audio stream
//..manages selection of input devices incase user has multiple on same device like multiple web cams
//gives user security by asking if he wants to fetch

// [{code] 
// {/* <html>
 
//    <head> 
//       <meta charset = "utf-8"> 
//    </head>
	
//    <body> 
//       <video autoplay></video> 
//       <script src = "client.js"></script> 
//    </body> 
	 
// </html> 
// [/code]}

// [code] 
// //checks if the browser supports WebRTC 

// function hasUserMedia() { 
//    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia 
//       || navigator.mozGetUserMedia || navigator.msGetUserMedia; 
//    return !!navigator.getUserMedia; 
// }
 
// if (hasUserMedia()) { 
//    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
//       || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		
//    //get both video and audio streams from user's camera 
//    navigator.getUserMedia({ video: true, audio: true }, function (stream) { 
//       var video = document.querySelector('video'); 
		
//       //insert stream into the video tag 
//       video.src = window.URL.createObjectURL(stream); 
//    }, function (err) {}); 
	
// }else {
//    alert("Error. WebRTC is not supported!"); 
// }
// [/code] */}

//While you can send media streams to peers you can send more through DataChannel APi

// [code] 
// var peerConn = new RTCPeerConnection(); 

// //establishing peer connection 
// //... 
// //end of establishing peer connection 
// var dataChannel = peerConnection.createDataChannel("myChannel", dataChannelOptions); 

// // here we can start sending direct messages to another peer 
// [/code]

// this is all you need to do. You can create a channel at any peerConnection until the RTCPeerConnectionobject is close

//getUserMedia -- takes in two parameters where the first is restrictions for   enabling video and audio and the second is for writing a callback that accepts the stream coming from the user's device and we can use that to create an ObjectUrl that takes the stream and attaches it as the src to one of the tags.

//--Powerful use cases for  accessing audio and video tracks using getUserMedia api

// var stream;

// function hasUserMedia() { 
//  //check if the browser supports the WebRTC 
//  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || 
//     navigator.mozGetUserMedia); 
// } 

// if (hasUserMedia()) {
//  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
//     || navigator.mozGetUserMedia; 
      
//  //enabling video and audio channels 
//  navigator.getUserMedia({ video: true, audio: true }, function (s) { 
//     stream = s; 
//     var video = document.querySelector('video'); 
      
//     //inserting our stream to the video tag     
//     video.src = window.URL.createObjectURL(stream); 
//  }, function (err) {}); 
  
// } else { 
//  alert("WebRTC is not supported"); 
// }

// btnGetAudioTracks.addEventListener("click", function(){ 
//  console.log("getAudioTracks"); 
//  console.log(stream.getAudioTracks()); 
// });

// btnGetTrackById.addEventListener("click", function(){ 
//  console.log("getTrackById"); 
//  console.log(stream.getTrackById(stream.getAudioTracks()[0].id)); 
// });

// btnGetTracks.addEventListener("click", function(){ 
//  console.log("getTracks()"); 
//  console.log(stream.getTracks()); 
// });

// btnGetVideoTracks.addEventListener("click", function(){ 
//  console.log("getVideoTracks()"); 
//  console.log(stream.getVideoTracks()); 
// });

// btnRemoveAudioTrack.addEventListener("click", function(){ 
//  console.log("removeAudioTrack()"); 
//  stream.removeTrack(stream.getAudioTracks()[0]); 
// });

// btnRemoveVideoTrack.addEventListener("click", function(){ 
//  console.log("removeVideoTrack()"); 
//  stream.removeTrack(stream.getVideoTracks()[0]); 
// });

//mediaStream object holds a lot and all of these built in methods allow for more useability. There are other properties on the object that you can add but thats all so far.



//RTC peer connection is the core of how things will work for getting peers connected. As the name suggests. 
// the config argument passed to the RTCpeerConnection constructor holds on key, ice servers? which hold an array of URL objects containing stund and turn servers used to find ice candidates.
// The RTC peer connection object is used differently depending on if your a caller or calle
// The RTC configuration user flow should work like this
// the config should have a method for getting other ice candidates, its an on iceHandler. The onaddStream should do the same for video stream once it is recieved from the remote peer
//the signaling server should have a handelr for recieveing messages from peers. if the RTCSessionDescription object is contained in the message it should be added to RTCPeerConnection using the setRemoteDescription()
// if it contains an RTCIceCandidate then   it should be added to the peerconnection using addIceCandidate()
//utilize getUseMedia to make and addStream() method on RTCPeerConnection to send stream.
//the caller calle connnection is different. The caller initiates by using a method called CreateOffer and uses a callback that recieves the RTCSessionDescription object. This callback then uses this RTCSessionDesc and adds it to the RTCPeerConnection object using setLocalDescription(). Then the caller sends the RTCSessionDesc to remote peer using signaling server. The calle registers same callback but in a createAnswer method. Calle flow only intiated after caller asks

//THE FOLLOWING JUST SHOWS HOW ALL THAT CONTROL FLOW SORTOF STARTS
// var connection = new WebSocket('ws://localhost:9090'); 
// var name = ""; 
 
// var loginInput = document.querySelector('#loginInput'); 
// var loginBtn = document.querySelector('#loginBtn'); 
// var otherUsernameInput = document.querySelector('#otherUsernameInput'); 
// var connectToOtherUsernameBtn = document.querySelector('#connectToOtherUsernameBtn'); 
// var connectedUser, myConnection;
  
// //when a user clicks the login button 
// loginBtn.addEventListener("click", function(event){ 
//    name = loginInput.value; 
	
//    if(name.length > 0){ 
//       send({ 
//          type: "login", 
//          name: name 
//       }); 
//    } 
	
// });
  
// //handle messages from the server 
// connection.onmessage = function (message) { 
//    console.log("Got message", message.data);
//    var data = JSON.parse(message.data); 
	
//    switch(data.type) { 
//       case "login": 
//          onLogin(data.success); 
//          break; 
//       case "offer": 
//          onOffer(data.offer, data.name); 
//          break; 
//       case "answer": 
//          onAnswer(data.answer); 
//          break; 
//       case "candidate": 
//          onCandidate(data.candidate); 
//          break; 
//       default: 
//          break; 
//    } 
// };
  
// //when a user logs in 
// function onLogin(success) { 

//    if (success === false) { 
//       alert("oops...try a different username"); 
//    } else { 
//       //creating our RTCPeerConnection object 
		
//       var configuration = { 
//          "iceServers": [{ "url": "stun:stun.1.google.com:19302" }] 
//       }; 
		
//       myConnection = new webkitRTCPeerConnection(configuration); 
//       console.log("RTCPeerConnection object was created"); 
//       console.log(myConnection); 
  
//       //setup ice handling
//       //when the browser finds an ice candidate we send it to another peer 
//       myConnection.onicecandidate = function (event) { 
		
//          if (event.candidate) { 
//             send({ 
//                type: "candidate", 
//                candidate: event.candidate 
//             }); 
//          } 
//       }; 
//    } 
// };
  
// connection.onopen = function () { 
//    console.log("Connected"); 
// };
  
// connection.onerror = function (err) { 
//    console.log("Got error", err); 
// };
  
// // Alias for sending messages in JSON format 
// function send(message) { 

//    if (connectedUser) { 
//       message.name = connectedUser; 
//    } 
	
//    connection.send(JSON.stringify(message)); 
// };


//setup a peer connection with another user 


//THIS PART CREATES USES THE CONNECTION ADDED ABOVE AND THEN CONNECTS BOTH PEERS THROUGH THE CALLER CALLE ANSWER AND OFFER FUNCTIONS THAT PASS THE RTCSESSIONDESC AND RTCICECANDIDATE TO SetRemoteDisc, or addIceCandidate to RTCPeer object 

// connectToOtherUsernameBtn.addEventListener("click", function () { 
    
//       var otherUsername = otherUsernameInput.value; 
//       connectedUser = otherUsername;
       
//       if (otherUsername.length > 0) { 
//          //make an offer 
//          myConnection.createOffer(function (offer) { 
//             console.log(); 
//             send({ 
//                type: "offer", 
//                offer: offer 
//             });
               
//             myConnection.setLocalDescription(offer); 
//          }, function (error) { 
//             alert("An error has occurred."); 
//          }); 
//       } 
//    }); 
    
//    //when somebody wants to call us 
//    function onOffer(offer, name) { 
//       connectedUser = name; 
//       myConnection.setRemoteDescription(new RTCSessionDescription(offer)); 
       
//       myConnection.createAnswer(function (answer) { 
//          myConnection.setLocalDescription(answer); 
           
//          send({ 
//             type: "answer", 
//             answer: answer 
//          }); 
           
//       }, function (error) { 
//          alert("oops...error"); 
//       }); 
//    }
     
//    //when another user answers to our offer 
//    function onAnswer(answer) { 
//       myConnection.setRemoteDescription(new RTCSessionDescription(answer)); 
//    } 
    
//    //when we got ice candidate from another user 
//    function onCandidate(candidate) { 
//       myConnection.addIceCandidate(new RTCIceCandidate(candidate)); 
//    }	
-----------------
//RTCDataChannel allows us to send abritrary data through our peer connection other than video and audio --. The example below is how one would use this

// var connection = new WebSocket('ws://localhost:9090'); 
// var name = "";

// var loginInput = document.querySelector('#loginInput'); 
// var loginBtn = document.querySelector('#loginBtn'); 

// var otherUsernameInput = document.querySelector('#otherUsernameInput'); 
// var connectToOtherUsernameBtn = document.querySelector('#connectToOtherUsernameBtn'); 
// var msgInput = document.querySelector('#msgInput'); 
// var sendMsgBtn = document.querySelector('#sendMsgBtn'); 
// var connectedUser, myConnection, dataChannel;
  
// //when a user clicks the login button 
// loginBtn.addEventListener("click", function(event) { 
//    name = loginInput.value; 
	
//    if(name.length > 0) { 
//       send({ 
//          type: "login", 
//          name: name 
//       }); 
//    } 
// }); 
 
// //handle messages from the server 
// connection.onmessage = function (message) { 
//    console.log("Got message", message.data); 
//    var data = JSON.parse(message.data); 
	
//    switch(data.type) { 
//       case "login": 
//          onLogin(data.success); 
//          break; 
//       case "offer": 
//          onOffer(data.offer, data.name); 
//          break; 
//       case "answer":
//          onAnswer(data.answer); 
//          break; 
//       case "candidate": 
//          onCandidate(data.candidate); 
//          break; 
//       default: 
//          break; 
//    } 
// }; 
 
// //when a user logs in 
// function onLogin(success) { 

//    if (success === false) { 
//       alert("oops...try a different username"); 
//    } else { 
//       //creating our RTCPeerConnection object 
//       var configuration = { 
//          "iceServers": [{ "url": "stun:stun.1.google.com:19302" }] 
//       }; 
		
//       myConnection = new webkitRTCPeerConnection(configuration, { 
//          optional: [{RtpDataChannels: true}] 
//       }); 
		
//       console.log("RTCPeerConnection object was created"); 
//       console.log(myConnection); 
  
//       //setup ice handling 
//       //when the browser finds an ice candidate we send it to another peer 
//       myConnection.onicecandidate = function (event) { 
		
//          if (event.candidate) { 
//             send({ 
//                type: "candidate", 
//                candidate: event.candidate 
//             });
//          } 
//       }; 
		
//       openDataChannel();
		
//    } 
// };
  
// connection.onopen = function () { 
//    console.log("Connected"); 
// }; 
 
// connection.onerror = function (err) { 
//    console.log("Got error", err); 
// };
  
// // Alias for sending messages in JSON format 
// function send(message) { 
//    if (connectedUser) { 
//       message.name = connectedUser; 
//    }
	
//    connection.send(JSON.stringify(message)); 
// };

//setup a peer connection with another user 

// connectToOtherUsernameBtn.addEventListener("click", function () {
    
//      var otherUsername = otherUsernameInput.value;
//      connectedUser = otherUsername;
      
//      if (otherUsername.length > 0) { 
//         //make an offer 
//         myConnection.createOffer(function (offer) { 
//            console.log(); 
              
//            send({ 
//               type: "offer", 
//               offer: offer 
//            }); 
              
//            myConnection.setLocalDescription(offer); 
//         }, function (error) { 
//            alert("An error has occurred."); 
//         }); 
//      } 
//   });
    
//   //when somebody wants to call us 
//   function onOffer(offer, name) { 
//      connectedUser = name; 
//      myConnection.setRemoteDescription(new RTCSessionDescription(offer));
      
//      myConnection.createAnswer(function (answer) { 
//         myConnection.setLocalDescription(answer); 
          
//         send({ 
//            type: "answer", 
//            answer: answer 
//         }); 
          
//      }, function (error) { 
//         alert("oops...error"); 
//      }); 
//   }
  
//   //when another user answers to our offer 
//   function onAnswer(answer) { 
//      myConnection.setRemoteDescription(new RTCSessionDescription(answer)); 
//   }
    
//   //when we got ice candidate from another user 
//   function onCandidate(candidate) { 
//      myConnection.addIceCandidate(new RTCIceCandidate(candidate)); 
//   }

// creating data channel 
// function openDataChannel() { 
    
//        var dataChannelOptions = { 
//           reliable:true 
//        }; 
        
//        dataChannel = myConnection.createDataChannel("myDataChannel", dataChannelOptions);
        
//        dataChannel.onerror = function (error) { 
//           console.log("Error:", error); 
//        };
        
//        dataChannel.onmessage = function (event) { 
//           console.log("Got message:", event.data); 
//        };  
//     }
      
//     //when a user clicks the send message button 
//     sendMsgBtn.addEventListener("click", function (event) { 
//        console.log("send message");
//        var val = msgInput.value; 
//        dataChannel.send(val); 
//     });
-------

//THE process of connecting to another user around the web is known as signaling and negotation-- in order to do so in WebRTC all one needs to do is    exchange contact info   
// --- This process occurs like this. there's a list of potential candidates to connect to. User picks one. That one is presented with an offer which they can either accept to or not, then the first user is told of what is up. If acceptance there is a created peer connection and both users exchange data about hardware and software and location information through signaling server. Connection succeeds or fails. Peers must exchange details about the  network connection and that is basically stored in the ice Candiate
// for doing signaling one must be able to connect to another without the RTCPeer object being created first. This is done through websockets. Such code is below :

// //require our websocket library 
// var WebSocketServer = require('ws').Server; 

// //creating a websocket server at port 9090 
// var wss = new WebSocketServer({port: 9090}); 
 
// //when a user connects to our sever 
// wss.on('connection', function(connection) { 
//    console.log("user connected");
	
//    //when server gets a message from a connected user 
//    connection.on('message', function(message){ 
//       console.log("Got message from a user:", message); 
//    }); 
	
//    connection.send("Hello from server"); 
// }); 

//--- NOW we talk about how things really get connected.

// connection.on('message', function(message) { 
//     var data; 
     
//     //accepting only JSON messages 
//     try { 
//        data = JSON.parse(message); 
//     } catch (e) { 
//        console.log("Invalid JSON"); 
//        data = {}; 
//     } 
     
//  });

// //require our websocket library 
// var WebSocketServer = require('ws').Server;

// //creating a websocket server at port 9090 
// var wss = new WebSocketServer({port: 9090}); 

// //all connected to the server users
// var users = {};

// connection.on('message', function(message){
//     var data; 
     
//     //accepting only JSON messages 
//     try { 
//        data = JSON.parse(message); 
//     } catch (e) { 
//        console.log("Invalid JSON"); 
//        data = {}; 
//     }
     
//     //switching type of the user message 
//     switch (data.type) { 
//        //when a user tries to login 
//        case "login": 
//           console.log("User logged:", data.name); 
             
//           //if anyone is logged in with this username then refuse 
//           if(users[data.name]) { 
//              sendTo(connection, { 
//                 type: "login", 
//                 success: false 
//              }); 
//           } else { 
//              //save user connection on the server 
//              users[data.name] = connection; 
//              connection.name = data.name; 
                 
//              sendTo(connection, { 
//                 type: "login", 
//                 success: true 
//              });
                 
//           } 
             
//           break;
                      
//        default: 
//           sendTo(connection, { 
//              type: "error", 
//              message: "Command no found: " + data.type 
//           }); 
             
//           break; 
//     } 
     
//  });

//--one of the above steps is if the user is already loggged in it wont work
//need to create the sendTo handler function

// function sendTo(connection, message) { 
//     connection.send(JSON.stringify(message)); 
//  }

//connection--- if the user closes his browser/ the app his data and key will be delted from the big user object intialized in the beginning near the ws. 

// connection.on("close", function() { 
//     if(connection.name) { 
//        delete users[connection.name]; 
//     } 
//  });

//--for making a call
// case "offer": 
// //for ex. UserA wants to call UserB 
// console.log("Sending offer to: ", data.name); 
 
// //if UserB exists then send him offer details 
// var conn = users[data.name]; 
 
// if(conn != null){ 
//    //setting that UserA connected with UserB 
//    connection.otherName = data.name; 
     
//    sendTo(conn, { 
//       type: "offer", 
//       offer: data.offer, 
//       name: connection.name 
//    }); 
// }
 
// break;

-----------------------
// COMPLETE SERVER CODE TO LOOK AT 

//require our websocket library 
// var WebSocketServer = require('ws').Server;

// //creating a websocket server at port 9090 
// var wss = new WebSocketServer({port: 9090}); 

// //all connected to the server users 
// var users = {};
 
// //when a user connects to our sever 
// wss.on('connection', function(connection) {
 
//   console.log("User connected");
   
//   //when server gets a message from a connected user
//   connection.on('message', function(message) { 
   
//      var data; 
//      //accepting only JSON messages 
//      try {
//         data = JSON.parse(message); 
//      } catch (e) { 
//         console.log("Invalid JSON"); 
//         data = {}; 
//      } 
       
//      //switching type of the user message 
//      switch (data.type) { 
//         //when a user tries to login 
           
//         case "login": 
//            console.log("User logged", data.name); 
               
//            //if anyone is logged in with this username then refuse 
//            if(users[data.name]) { 
//               sendTo(connection, { 
//                  type: "login", 
//                  success: false 
//               }); 
//            } else { 
//               //save user connection on the server 
//               users[data.name] = connection; 
//               connection.name = data.name; 
                   
//               sendTo(connection, { 
//                  type: "login", 
//                  success: true 
//               }); 
//            } 
               
//            break; 
               
//         case "offer": 
//            //for ex. UserA wants to call UserB 
//            console.log("Sending offer to: ", data.name); 
               
//            //if UserB exists then send him offer details 
//            var conn = users[data.name];
               
//            if(conn != null) { 
//               //setting that UserA connected with UserB 
//               connection.otherName = data.name; 
                   
//               sendTo(conn, { 
//                  type: "offer", 
//                  offer: data.offer, 
//                  name: connection.name 
//               }); 
//            } 
               
//            break;  
               
//         case "answer": 
//            console.log("Sending answer to: ", data.name); 
//            //for ex. UserB answers UserA 
//            var conn = users[data.name]; 
               
//            if(conn != null) { 
//               connection.otherName = data.name; 
//               sendTo(conn, { 
//                  type: "answer", 
//                  answer: data.answer 
//               }); 
//            } 
               
//            break;  
               
//         case "candidate": 
//            console.log("Sending candidate to:",data.name); 
//            var conn = users[data.name];  
               
//            if(conn != null) { 
//               sendTo(conn, { 
//                  type: "candidate", 
//                  candidate: data.candidate 
//               });
//            } 
               
//            break;  
               
//         case "leave": 
//            console.log("Disconnecting from", data.name); 
//            var conn = users[data.name]; 
//            conn.otherName = null; 
               
//            //notify the other user so he can disconnect his peer connection 
//            if(conn != null) { 
//               sendTo(conn, { 
//                  type: "leave" 
//               }); 
//            }  
               
//            break;  
               
//         default: 
//            sendTo(connection, { 
//               type: "error", 
//               message: "Command not found: " + data.type 
//            }); 
               
//            break; 
//      }  
//   });  
   
//   //when user exits, for example closes a browser window 
//   //this may help if we are still in "offer","answer" or "candidate" state 
//   connection.on("close", function() { 
   
//      if(connection.name) { 
//      delete users[connection.name]; 
       
//         if(connection.otherName) { 
//            console.log("Disconnecting from ", connection.otherName);
//            var conn = users[connection.otherName]; 
//            conn.otherName = null;  
               
//            if(conn != null) { 
//               sendTo(conn, { 
//                  type: "leave" 
//               });
//            }  
//         } 
//      } 
//   });  
   
//   connection.send("Hello world"); 
   
// });  

// function sendTo(connection, message) { 
//   connection.send(JSON.stringify(message)); 
// }
-----------------------------

//This is the entire client side to getting 2 videos up
//our username 
// var name; 
// var connectedUser;
  
// //connecting to our signaling server
// var conn = new WebSocket('ws://localhost:9090');
  
// conn.onopen = function () { 
//    console.log("Connected to the signaling server"); 
// };
  
// //when we got a message from a signaling server 
// conn.onmessage = function (msg) { 
//    console.log("Got message", msg.data);
	
//    var data = JSON.parse(msg.data); 
	
//    switch(data.type) { 
//       case "login": 
//          handleLogin(data.success); 
//          break; 
//       //when somebody wants to call us 
//       case "offer": 
//          handleOffer(data.offer, data.name); 
//          break; 
//       case "answer": 
//          handleAnswer(data.answer); 
//          break; 
//       //when a remote peer sends an ice candidate to us 
//       case "candidate": 
//          handleCandidate(data.candidate); 
//          break; 
//       case "leave": 
//          handleLeave(); 
//          break; 
//       default: 
//          break; 
//    }
// };
  
// conn.onerror = function (err) { 
//    console.log("Got error", err); 
// };
  
// //alias for sending JSON encoded messages 
// function send(message) { 
//    //attach the other peer username to our messages 
//    if (connectedUser) { 
//       message.name = connectedUser; 
//    } 
	
//    conn.send(JSON.stringify(message)); 
// };
  
// //****** 
// //UI selectors block 
// //******
 
// var loginPage = document.querySelector('#loginPage'); 
// var usernameInput = document.querySelector('#usernameInput'); 
// var loginBtn = document.querySelector('#loginBtn'); 

// var callPage = document.querySelector('#callPage'); 
// var callToUsernameInput = document.querySelector('#callToUsernameInput');
// var callBtn = document.querySelector('#callBtn'); 

// var hangUpBtn = document.querySelector('#hangUpBtn');
  
// var localVideo = document.querySelector('#localVideo'); 
// var remoteVideo = document.querySelector('#remoteVideo'); 

// var yourConn; 
// var stream;
  
// callPage.style.display = "none";

// // Login when the user clicks the button 
// loginBtn.addEventListener("click", function (event) { 
//    name = usernameInput.value;
	
//    if (name.length > 0) { 
//       send({ 
//          type: "login", 
//          name: name 
//       }); 
//    }
	
// });
  
// function handleLogin(success) { 
//    if (success === false) { 
//       alert("Ooops...try a different username"); 
//    } else { 
//       loginPage.style.display = "none"; 
//       callPage.style.display = "block";
		
//       //********************** 
//       //Starting a peer connection 
//       //********************** 
		
//       //getting local video stream 
//       navigator.webkitGetUserMedia({ video: true, audio: true }, function (myStream) { 
//          stream = myStream; 
			
//          //displaying local video stream on the page 
//          localVideo.src = window.URL.createObjectURL(stream);
			
//          //using Google public stun server 
//          var configuration = { 
//             "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }]
//          }; 
			
//          yourConn = new webkitRTCPeerConnection(configuration); 
			
//          // setup stream listening 
//          yourConn.addStream(stream); 
			
//          //when a remote user adds stream to the peer connection, we display it 
//          yourConn.onaddstream = function (e) { 
//             remoteVideo.src = window.URL.createObjectURL(e.stream); 
//          };
			
//          // Setup ice handling 
//          yourConn.onicecandidate = function (event) { 
//             if (event.candidate) { 
//                send({ 
//                   type: "candidate", 
//                   candidate: event.candidate 
//                }); 
//             } 
//          };  
			
//       }, function (error) { 
//          console.log(error); 
//       }); 
		
//    } 
// };
  
// //initiating a call 
// callBtn.addEventListener("click", function () { 
//    var callToUsername = callToUsernameInput.value;
	
//    if (callToUsername.length > 0) { 
	
//       connectedUser = callToUsername;
		
//       // create an offer 
//       yourConn.createOffer(function (offer) { 
//          send({ 
//             type: "offer", 
//             offer: offer 
//          }); 
			
//          yourConn.setLocalDescription(offer); 
//       }, function (error) { 
//          alert("Error when creating an offer"); 
//       });
		
//    } 
// });
  
// //when somebody sends us an offer 
// function handleOffer(offer, name) { 
//    connectedUser = name; 
//    yourConn.setRemoteDescription(new RTCSessionDescription(offer));
	
//    //create an answer to an offer 
//    yourConn.createAnswer(function (answer) { 
//       yourConn.setLocalDescription(answer); 
		
//       send({ 
//          type: "answer", 
//          answer: answer 
//       }); 
		
//    }, function (error) { 
//       alert("Error when creating an answer"); 
//    }); 
// };
  
// //when we got an answer from a remote user
// function handleAnswer(answer) { 
//    yourConn.setRemoteDescription(new RTCSessionDescription(answer)); 
// };
  
// //when we got an ice candidate from a remote user 
// function handleCandidate(candidate) { 
//    yourConn.addIceCandidate(new RTCIceCandidate(candidate)); 
// };
   
// //hang up 
// hangUpBtn.addEventListener("click", function () { 

//    send({ 
//       type: "leave" 
//    });  
	
//    handleLeave(); 
// });
  
// function handleLeave() { 
//    connectedUser = null; 
//    remoteVideo.src = null; 
	
//    yourConn.close(); 
//    yourConn.onicecandidate = null; 
//    yourConn.onaddstream = null; 
// };

//THIS IS THE SIGNALING SERVER 
//require our websocket library 
// var WebSocketServer = require('ws').Server; 

// //creating a websocket server at port 9090 
// var wss = new WebSocketServer({port: 9090}); 

// //all connected to the server users 
// var users = {};
  
// //when a user connects to our sever 
// wss.on('connection', function(connection) {
  
//    console.log("User connected");
	
//    //when server gets a message from a connected user 
//    connection.on('message', function(message) { 
	
//       var data; 
		
//       //accepting only JSON messages 
//       try { 
//          data = JSON.parse(message); 
//       } catch (e) { 
//          console.log("Invalid JSON"); 
//          data = {}; 
//       }
		
//       //switching type of the user message 
//       switch (data.type) { 
//          //when a user tries to login
//          case "login": 
//             console.log("User logged", data.name); 
				
//             //if anyone is logged in with this username then refuse 
//             if(users[data.name]) { 
//                sendTo(connection, { 
//                   type: "login", 
//                   success: false 
//                }); 
//             } else { 
//                //save user connection on the server 
//                users[data.name] = connection; 
//                connection.name = data.name; 
					
//                sendTo(connection, { 
//                   type: "login", 
//                   success: true 
//                }); 
//             } 
				
//             break;
				
//          case "offer": 
//             //for ex. UserA wants to call UserB 
//             console.log("Sending offer to: ", data.name);
				
//             //if UserB exists then send him offer details 
//             var conn = users[data.name]; 
				
//             if(conn != null) { 
//                //setting that UserA connected with UserB 
//                connection.otherName = data.name; 
					
//                sendTo(conn, { 
//                   type: "offer", 
//                   offer: data.offer, 
//                   name: connection.name 
//                }); 
//             }
				
//             break;
				
//          case "answer": 
//             console.log("Sending answer to: ", data.name); 
//             //for ex. UserB answers UserA 
//             var conn = users[data.name]; 
				
//             if(conn != null) { 
//                connection.otherName = data.name; 
//                sendTo(conn, { 
//                   type: "answer", 
//                   answer: data.answer 
//                }); 
//             } 
				
//             break; 
				
//          case "candidate": 
//             console.log("Sending candidate to:",data.name); 
//             var conn = users[data.name];
				
//             if(conn != null) { 
//                sendTo(conn, { 
//                   type: "candidate", 
//                   candidate: data.candidate 
//                }); 
//             } 
				
//             break;
				
//          case "leave": 
//             console.log("Disconnecting from", data.name); 
//             var conn = users[data.name]; 
//             conn.otherName = null; 
				
//             //notify the other user so he can disconnect his peer connection 
//             if(conn != null) {
//                sendTo(conn, { 
//                   type: "leave" 
//               }); 
//             }
				
//             break;
				
//          default: 
//             sendTo(connection, { 
//                type: "error", 
//                message: "Command not found: " + data.type 
//             }); 
				
//             break; 
//       }
		
//    }); 
	
//    //when user exits, for example closes a browser window 
//    //this may help if we are still in "offer","answer" or "candidate" state 
//    connection.on("close", function() { 
	
//       if(connection.name) { 
//          delete users[connection.name]; 
			
//          if(connection.otherName) { 
//             console.log("Disconnecting from ", connection.otherName); 
//             var conn = users[connection.otherName]; 
//             conn.otherName = null;
				
//             if(conn != null) { 
//                sendTo(conn, { 
//                   type: "leave" 
//                }); 
//             }
//          } 
//       }
		
//    });  
	
//    connection.send("Hello world");  
// });
  
// function sendTo(connection, message) { 
//    connection.send(JSON.stringify(message)); 
// }