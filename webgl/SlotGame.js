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
    this.perspectiveMatrix = makePerspective(45, 640.0 / 480.0, 0.1, 100.0);
    //this.rubik = new SlotGame($gl, $shaderProgram);
	initTextures(getTextureNames());
	$SlotMachine = new SlotMachine(gl);
	$SlotMachine.start();
    var self = this;
    
	this.drawScene = function () {
        //Canvas leeren
        $gl.clear($gl.COLOR_BUFFER_BIT | $gl.DEPTH_BUFFER_BIT);
        $gl.enable($gl.DEPTH_TEST);
        $gl.depthFunc($gl.LEQUAL);

        //TODO: Perspektive einstellen
        perspectiveMatrix = makePerspective(45, canvasWidth / canvasHeight, 0.1, 100.0);
		
		PerspectivTranslate([0.0,0.0,-2.0])
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

    };
}


    //this.keyPressed = function(key) {
        //totate Layer von rubik aufrufen

    //};
function getTextureNames() {
		var Texturenames ;
		return  Texturenames = new Array("Slotmachine/images/1_kirsche.png",
										 "Slotmachine/images/2_pflaume.png",
										 "Slotmachine/images/3_zitrone.png",
										 "Slotmachine/images/4_orange.png",
										 "Slotmachine/images/5_melone.png",
										 "Slotmachine/images/6_klee.png",
										 "Slotmachine/images/7_sieben.png",
										 "Slotmachine/images/8_diamant.png");
}


function PerspectivRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0;  
  perspectiveMatrix = perspectiveMatrix.x(Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4());
}

function PerspectivTranslate(v) {
  perspectiveMatrix = perspectiveMatrix.x(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

