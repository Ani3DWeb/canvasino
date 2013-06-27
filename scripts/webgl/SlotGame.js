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

        PerspectivTranslate([0.0, 0.0, -1.7])
        //PerspectivRotate(120,[1.0,0.0,0.0]);

        //var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        //gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.perspectiveMatrix));

        //PerspectivTranslate([0.0,0.0,-8.0])
        //PerspectivRotate(120,[1.0,0.0,0.0]);

        var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));


        //Zeichne Rubik
		var currentTime = (new Date).getTime();
		var delta = currentTime - lastCubeUpdateTime;
        $SlotMachine.rotateWheel(1,delta);
        $SlotMachine.rotateWheel(0,delta);
        $SlotMachine.rotateWheel(2,delta);
        countReady = 0;
		lastCubeUpdateTime = currentTime;

    };
	
	this.keyPressed = function(key) {
        
        switch(key){
            case 37: //Left-Key
				$SlotMachine.randomizeSingle(0);
                break;
            case 38: //Up-Key
                break;
            case 39: //Right-Key
				$SlotMachine.randomizeSingle(2);
                break;
            case 40: //Down-Key
				$SlotMachine.randomizeSingle(1);
                break;
            case 65: //A-Key
				$SlotMachine.randomize();
                break;
            case 66:
            case 89: //B-Key 
                break;
                    
        }
    };
}


//this.keyPressed = function(key) {
//totate Layer von rubik aufrufen

//};
function getTextureNames() {
    return new Array("images/webgl/slot/1_kirsche.png", //0
            "images/webgl/slot/2_pflaume.png", //1
            "images/webgl/slot/3_zitrone.png", //2
            "images/webgl/slot/4_orange.png", //3
            "images/webgl/slot/5_melone.png", //4
            "images/webgl/slot/6_klee.png",  //5
            "images/webgl/slot/7_sieben.png", //6
            "images/webgl/slot/8_diamant.png", //7
			"images/webgl/slot/hinten.png", //8
			"images/webgl/slot/links.png", //9
			"images/webgl/slot/neutral.png", //10
			"images/webgl/slot/oben.png", //11
			"images/webgl/slot/rechts.png", //12
			"images/webgl/slot/unten.png"); //13
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
