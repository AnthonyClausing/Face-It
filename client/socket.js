const config = {
    iceServers: [{ url: 'stun:stun2.1.google.com:19302' },
    {url:'stun:stun01.sipphone.com'},
    {url:'stun:stun.ekiga.net'},
    {url:'stun:stun.fwdnet.net'},
    {url:'stun:stun.ideasip.com'},
    {url:'stun:stun.iptel.org'},
    {url:'stun:stun.rixtelecom.se'},
    {url:'stun:stun.schlund.de'},
    {url:'stun:stun.l.google.com:19302'},
    {url:'stun:stun1.l.google.com:19302'},
    {url:'stun:stun2.l.google.com:19302'},
    {url:'stun:stun3.l.google.com:19302'},
    {url:'stun:stun4.l.google.com:19302'}]
};

function createPeerConnection (state, socket, roomName) {
    this.pc = new RTCPeerConnection(config);
    this.pc.onicecandidate = handleIceCandidate;
    this.pc.onaddstream = handleRemoteStreamAdded;
    this.pc.onremovestream = handleRemoteStreamRemoved;
    console.log(state.userMediaObject);
    this.pc.addStream(state.userMediaObject);
    if (this.isInitiator) {
        this.pc.createOffer().then(offer => {
            return this.pc.setLocalDescription(offer);
        }).then(() => {
            console.log('localdes:', this.pc.localDescription);
            socket.emit('signal', this.pc.localDescription, this.state.roomName);
        });
    } else {
        console.log('not initiator pc:', this.pc);
    }
}

function handleIceCandidate (event) {
    console.log('handleIceCandidate event: ', event);
    if (event.candidate) {
        console.log('have cand');
        // this.pc.addIceCandidate(new RTCIceCandidate(event.candidate))
        socket.send({
            type: 'candidate',
            candidate: event.candidate.candidate
        })
    } else {
        console.log('End of candidates.');
    }
}

function doAnswer (socket, roomName) {
    this.pc.createAnswer().then(answer => {
        return this.pc.setLocalDescription(answer);
    }).then(() => {
        socket.emit('signal', this.pc.localDescription, roomName);
    });
}

function handleRemoteStreamAdded (event) {
    remoteStream.src = window.URL.createObjectURL(stream);
}

function handleRemoteStreamRemoved () {

}

function setLocalAndSendMessage (sessionDescription) {
    sessionDescription.sdp = preferOpus(sessionDescription.sdp);
    pc.setLocalDescription(sessionDescription);
    console.log('localdescription:', sessionDescription);
}

function handleCreateOfferError () {
    console.log('create offer error');
}

//setting codec stuff
function preferOpus(sdp) {
    var sdpLines = sdp.split('\r\n');
    var mLineIndex;
    // Search for m line.
    for (var i = 0; i < sdpLines.length; i++) {
        if (sdpLines[i].search('m=audio') !== -1) {
          mLineIndex = i;
          break;
        }
    }
    if (mLineIndex === null) {
      return sdp;
    }

    // If Opus is available, set it as the default in m line.
    for (i = 0; i < sdpLines.length; i++) {
      if (sdpLines[i].search('opus/48000') !== -1) {
        var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
        if (opusPayload) {
          sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
        }
        break;
      }
    }

    // Remove CN in m line and sdp.
    sdpLines = removeCN(sdpLines, mLineIndex);

    sdp = sdpLines.join('\r\n');
    return sdp;
}

//codec helper stuff
function extractSdp(sdpLine, pattern) {
    var result = sdpLine.match(pattern);
    return result && result.length === 2 ? result[1] : null;
}

  // Set the selected codec to the first in m line.
function setDefaultCodec(mLine, payload) {
    var elements = mLine.split(' ');
    var newLine = [];
    var index = 0;
    for (var i = 0; i < elements.length; i++) {
      if (index === 3) { // Format of media starts from the fourth.
        newLine[index++] = payload; // Put target payload to the first.
      }
      if (elements[i] !== payload) {
        newLine[index++] = elements[i];
      }
    }
    return newLine.join(' ');
}

  // Strip CN from sdp before CN constraints is ready.
function removeCN(sdpLines, mLineIndex) {
    var mLineElements = sdpLines[mLineIndex].split(' ');
    // Scan from end for the convenience of removing an item.
    for (var i = sdpLines.length - 1; i >= 0; i--) {
      var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
      if (payload) {
        var cnPos = mLineElements.indexOf(payload);
        if (cnPos !== -1) {
          // Remove CN payload from m line.
          mLineElements.splice(cnPos, 1);
        }
        // Remove CN line in sdp
        sdpLines.splice(i, 1);
      }
    }

    sdpLines[mLineIndex] = mLineElements.join(' ');
    return sdpLines;
}

module.exports = {
    createPeerConnection, doAnswer, handleIceCandidate, handleRemoteStreamAdded, handleRemoteStreamRemoved
};


