export default function buildDraw () {
    let error = function (e) {
        console.log('video error');
    }

    let canvasInput = document.getElementById('drawCanvas');
    let cc = canvasInput.getContext('2d');

    pModel.shapeModel.nonRegularizedVectors.push(9);
    pModel.shapeModel.nonRegularizedVectors.push(11);

    var ctracker = new clm.tracker({useWebGL: true});
    ctracker.init(pModel);
    ctracker.start(videoInput);

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