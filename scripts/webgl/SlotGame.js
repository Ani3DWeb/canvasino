/*
 * Eigentliches Spiel: 
 *      
 * Logik für SlotMachine:
 *      keyPressed-> StartMachine
 *      Random, Geschwindigkeit, schneller/Langsamer werden
 *      
 *      
 */

        var perspectiveMatrix;
var lastCubeUpdateTime = 0;
var xIncValue = 0.0;
var yIncValue = 0.5;
var zIncValue = 0.5;
var mvMatrix = Matrix.I(4);
var $SlotMachine;

function SlotGame($gl, $shaderProgram) {
    console.log("Starte SlotMachineGame...");
    this.perspectiveMatrix = makePerspective(45, 640.0 / 480.0, 0.1, 100.0);
    //this.rubik = new SlotGame($gl, $shaderProgram);
    initTextures(getTextureNames());
    $SlotMachine = new SlotMachine(gl);
    $SlotMachine.start();
    var self = this;

    this.drawScene = function() {
        //Canvas leeren
        $gl.clear($gl.COLOR_BUFFER_BIT | $gl.DEPTH_BUFFER_BIT);
        $gl.enable($gl.DEPTH_TEST);
        $gl.depthFunc($gl.LEQUAL);
        setupLight();
        //TODO: Perspektive einstellen
        perspectiveMatrix = makePerspective(45, canvasWidth / canvasHeight, 0.1, 100.0);

        PerspectivTranslate([0.0, 0.0, -2.0])
        //PerspectivRotate(120,[1.0,0.0,0.0]);

        //var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        //gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.perspectiveMatrix));

        //PerspectivTranslate([0.0,0.0,-8.0])
        //PerspectivRotate(120,[1.0,0.0,0.0]);

        var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));


        //Zeichne Rubik
        $SlotMachine.rotateWheel(0);
        $SlotMachine.rotateWheel(1);
        $SlotMachine.rotateWheel(2);
        countReady = 0;

    };
}


//this.keyPressed = function(key) {
//totate Layer von rubik aufrufen

//};
function getTextureNames() {
    return new Array("images/webgl/slot/1_kirsche.png",
            "images/webgl/slot/2_pflaume.png",
            "images/webgl/slot/3_zitrone.png",
            "images/webgl/slot/4_orange.png",
            "images/webgl/slot/5_melone.png",
            "images/webgl/slot/6_klee.png",
            "images/webgl/slot/7_sieben.png",
            "images/webgl/slot/8_diamant.png");
}


function PerspectivRotate(angle, v) {
    var inRadians = angle * Math.PI / 180.0;
    perspectiveMatrix = perspectiveMatrix.x(Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4());
}

function PerspectivTranslate(v) {
    perspectiveMatrix = perspectiveMatrix.x(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setupLight()
{
    gl.uniform1f(shaderProgram.materialShininessUniform, 10.0);

    gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, 1);

    gl.uniform3f(shaderProgram.ambientColorUniform, 1.0, 1.0, 1.0);
    gl.uniform3f(shaderProgram.pointLightingSpecularColorUniform,
            1.8, 1.8, 1.8);
    gl.uniform3f(shaderProgram.pointLightingDiffuseColorUniform,
            1.8, 1.0, 1.0);

    gl.uniform3f(shaderProgram.pointLightingLocationUniform,
            -20, -10, 20);
}
