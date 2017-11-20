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