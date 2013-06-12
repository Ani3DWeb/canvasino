/*
 * Eigentliches Spiel: 
 * Logik für RubikCube: 
 *      keyPressed-> rotateLayer
 *      highlightedColumn/Row
 *      
 */
var perspectiveMatrix;
var angle = 0;
var mvMatrix = Matrix.I(4);
var angle = 0;
function RubikGame($gl, $shaderProgram) {
 //   this.perspectiveMatrix = makePerspective(45, 640.0 / 480.0, 0.1, 100.0);
 	initTextures(getCubeTextureNames());
    this.rubik = new RubikCube($gl, $shaderProgram);
    var self = this;
  
    this.drawScene = function() {
        //Canvas leeren
        $gl.clear($gl.COLOR_BUFFER_BIT | $gl.DEPTH_BUFFER_BIT);
        $gl.enable($gl.DEPTH_TEST);
        $gl.depthFunc($gl.LEQUAL);

        //TODO: Perspektive einstellen
        perspectiveMatrix = makePerspective(45, canvasWidth / canvasHeight, 0.1, 100.0);
		
		PerspectivTranslate([0.0,0.0,-8.0])
		PerspectivRotate(120,[1.0,0.0,0.0]);
		
        var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

        //Zeichne Rubik
		if(angle < 90) {
			self.rubik.rotateLayer('x', 0, angle +=5);
		}
		self.rubik.draw();

    };


    this.keyPressed = function(key) {
        //rotate Layer von rubik aufrufen

    };
}

function getCubeTextureNames() {
		return  new Array("RubiksCube/images/Flaeche_pink.png",
										 "RubiksCube/images/Flaeche_blau.png",
										 "RubiksCube/images/Flaeche_orange.png",
										 "RubiksCube/images/Flaeche_gruen.png",
										 "RubiksCube/images/Flaeche_rot.png",
										 "RubiksCube/images/Flaeche_gelb.png",
										 "RubiksCube/images/Flaeche_schwarz.png");
}

function PerspectivRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0;  
  perspectiveMatrix = perspectiveMatrix.x(Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4());
}

function PerspectivTranslate(v) {
  perspectiveMatrix = perspectiveMatrix.x(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}




