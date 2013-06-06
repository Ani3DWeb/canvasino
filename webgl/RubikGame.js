/*
 * Eigentliches Spiel: 
 * Logik für RubikCube: 
 *      keyPressed-> rotateLayer
 *      highlightedColumn/Row
 *      
 */
 var perspectiveMatrix;
function RubikGame($gl, $shaderProgram) {
 //   this.perspectiveMatrix = makePerspective(45, 640.0 / 480.0, 0.1, 100.0);
    this.rubik = new RubikCube($gl, $shaderProgram);
    var self = this;
	
	initTextures(getTextureNames());
   
    this.drawScene = function() {
        //Canvas leeren
        $gl.clear($gl.COLOR_BUFFER_BIT | $gl.DEPTH_BUFFER_BIT);
        $gl.enable($gl.DEPTH_TEST);
        $gl.depthFunc($gl.LEQUAL);

        //TODO: Perspektive einstellen
        perspectiveMatrix = makePerspective(45, 640.0 / 480.0, 0.1, 100.0);
		
		perspectiveMatrix = perspectiveMatrix.x(Matrix.Translation($V([0.0, 0.0, -8.0])).ensure4x4());
		
        var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

        //Zeichne Rubik
        self.rubik.draw();
    };


    this.keyPressed = function(key) {
        //rotate Layer von rubik aufrufen

    };
}

function getTextureNames() {
		return  Texturenames = new Array("RubiksCube/images/Flaeche_pink.png",
										 "RubiksCube/images/Flaeche_blau.png",
										 "RubiksCube/images/Flaeche_orange.png",
										 "RubiksCube/images/Flaeche_gruen.png",
										 "RubiksCube/images/Flaeche_rot.png",
										 "RubiksCube/images/Flaeche_gelb.png",
										 "RubiksCube/images/Flaeche_schwarz.png");
}

function mvRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0;  
  return Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
}




