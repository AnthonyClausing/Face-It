//import getUserMedia from 'getusermedia';
//import emotionClassifier from './models/emotionclassifier.js';
//import emotionModel from './models/emotionmodel.js';
//import pModel from './models/pmodel.js';
//import clm from '../../public/ClamTracker/build/clmtrackr.js';
//import _ from 'lodash';
//import PubSub from 'pubsub-js';

export default function buildDraw (videoSource) {
    let error = function (e) {
        console.log('video error');
    }

    let canvasInput = document.getElementById('drawCanvas');
    let cc = canvasInput.getContext('2d');

    pModel.shapeModel.nonRegularizedVectors.push(9);
    pModel.shapeModel.nonRegularizedVectors.push(11);

    var ctracker = new clm.tracker({useWebGL: true});
    ctracker.init(pModel);
    ctracker.start(videoSource);

    function drawLoop() {
        requestAnimationFrame(drawLoop);
        cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
        ctracker.draw(canvasInput);

        let cp = ctracker.getCurrentParameters();
        let er = ec.meanPredict(cp);
         document.getElementById('angry').innerHTML = '<span> Anger </span>' + er[0].value;
         document.getElementById('happy').innerHTML = '<span> Happy </span>' + er[5].value;
         document.getElementById('sad').innerHTML = '<span> Sad </span>' + er[3].value;
         document.getElementById('surprised').innerHTML = '<span> Surprised </span>' + er[4].value;
     }

    let ec = new emotionClassifier();
    ec.init(emotionModel);
    let emotionData = ec.getBlank();

    drawLoop();
}
//  Cross-Browser Implementierung von der URL-Funktion, eher unwichtig
// window.URL = window.URL ||
// window.webkitURL ||
// window.msURL ||
// window.mozURL;

// state = {
//     emotion: { emotion: '' }
// }

// constructor(props) {
//     super(props);

//     this.PubSub = props.PubSub || PubSub;
// }

// componentDidMount() {

//     // overlayCC ist im Prinzip eine leere Ebene zum zeichnen, soweit ich das verstanden
//     let overlayCC = this.overlay.getContext('2d');

//     // Der emotionClassifier wird erstellt und wird mit einem emotionModel initiert.
//     // Der Classifier ist im Prinzip der Rechner
//     // Das emotionModel ist quasi das Wörterbuch für die Werte und die Emotionen
//     let ec = new emotionClassifier();
//     ec.init(emotionModel);

//     // wir erstellen hier mal ein Emotion-Wörterbuch was auf null gesetzt ist. Diese Variable wird zum Zwischenspeichern der Werte genutzt.
//     let emotionData = ec.getBlank();

//     // Browser fragt jetzt nach der Webcam
//     // die Funktion braucht folgende Argumente navigator.getUserMedia(optionen, success);
//     getUserMedia({ video : true}, this.getUserMediaCallback.bind(this) );

//     //
//     // Hier wird das Tracking an sich implmentiert
//     //
//     let ctrack = new clm.tracker({useWebGL : true});

//     // der Tracker wird mit dem pModel initiiert. magic! :)
//     ctrack.init(pModel);

//     this.ctrack = ctrack;
//     this.overlayCC = overlayCC;
//     this.ec = ec;

//     let self = this;

//     this.video.addEventListener('canplay', (this.startVideo).bind(this), false);

// }

// shouldComponentUpdate(nextProps, nextState) {
//     if (this.state.emotion.emotion !== nextState.emotion.emotion) {
//         this.PubSub.publish('emotion.update', nextState.emotion);

//         return true;
//     }

//     return false;
// }

// getUserMediaCallback(err, stream ) {
//     // Damit es auch auf allen Browsern funktioniert
//     // technisch wichtig, aber eher unwichtig für das Tracking
//     this.video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;

//     // Um sicher zu gehen, dass das Video auch wirklich abgespielt wird.
//     this.video.play();
// }

// startVideo(){

//     // start video
//     this.video.play();
//     // start tracking
//     this.ctrack.start(this.video);
//     // start loop to draw face
//     this.drawLoop();

// }

// drawLoop(){

//     requestAnimationFrame((this.drawLoop).bind(this));
    
//     // Die numerischen Parameter
//     let cp = this.ctrack.getCurrentParameters();

//     // bei jedem Frame wird Ebene geleert
//     // Probier mal die untere Zeile auszukommentieren
//     this.overlayCC.clearRect(0, 0, 400, 300);

//     // falls alles geklappt hat und es Emotion-Werte gibt
//     // soll die Maske gezeichnet werden
//     if (this.ctrack.getCurrentPosition()) {
//         this.ctrack.draw(this.overlay);
//     }

//     // Die Emotionen in darstellbare Form bringen
//     let er = this.ec.meanPredict(cp);
//     document.getElementById('angry').innerHTML = '<span> Anger </span>' + er[0].value;
//     document.getElementById('happy').innerHTML = '<span> Happy </span>' + er[3].value;
//     document.getElementById('sad').innerHTML = '<span> Sad </span>' + er[1].value;
//     document.getElementById('surprised').innerHTML = '<span> Surprised </span>' + er[2].value;

//     if (er) {
//         const emotion = _.maxBy(er, (o) => { return o.value; });
//         this.setState({ emotion: emotion });
//         this.PubSub.publish('emotions.loop', er);
//     }

// }