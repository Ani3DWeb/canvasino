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
var tmp = 0;
var rotationAngle = 5;
var XRotation = 30, YRotation = 30;

var axis, layer, direction ;
var rotate = false;
var rotatePers = false;
var rot = 0;

function RubikGame($gl, $shaderProgram) {

 	initTextures(getCubeTextureNames());
    this.rubik = new RubikCube($gl, $shaderProgram);
    var self = this;
	
		canvas.onmousedown = handleMouseDown;
		document.onmouseup = handleMouseUp;
		document.onmousemove = handleMouseMove;
  
    this.drawScene = function() {
        //Canvas leeren
        $gl.clear($gl.COLOR_BUFFER_BIT | $gl.DEPTH_BUFFER_BIT);
        $gl.enable($gl.DEPTH_TEST);
        $gl.depthFunc($gl.LEQUAL);
	    setupLight();
        //TODO: Perspektive einstellen
        perspectiveMatrix = makePerspective(45, canvasWidth / canvasHeight, 0.1, 100.0);
		
	
		PerspectivTranslate([0.0,0.0,-8.0])
		if(rotatePers==true) {
			PerspectivRotate(rot++,[1.0,1.0,0.0]);
		}
		
        var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
        //Zeichne Rubik
	/*	if(tmp == 0)
		{*/
		if(rotate==true) {
			if(angle < 90) {
			angle += rotationAngle;
				self.rubik.rotateLayer(axis, layer, direction);
			} else {
				tmp = 1;
				angle = 0;
				rotate = false;
			}
		}
	/*	} else if (tmp == 1)
		{
			if(angle < 90) {
			angle += rotationAngle;
				self.rubik.rotateLayer('x', 2, 1);
			} else {
				tmp = 2;
				angle = 0;
			}			
		}  else if (tmp == 2)
		{
			if(angle < 90) {
			angle += rotationAngle;
				self.rubik.rotateLayer('y', 0, -1);
			} else {
				tmp = 3;
				angle = 0;
			}			
		} /* else if(tmp == 3)
		{
			if(angle < 90) {
			angle += rotationAngle;
				self.rubik.rotateLayer('y', 0, 1);
			} else {
				tmp = 4;
				angle = 0;
			}
		} else if (tmp == 4)
		{
			if(angle < 90) {
			angle += rotationAngle;
				self.rubik.rotateLayer('x', 2, -1);
			} else {
				tmp = 5;
				angle = 0;
			}			
		} else if (tmp == 5)
		{
			if(angle < 90) {
			angle += rotationAngle;
				self.rubik.rotateLayer('z', 2, 1);
			} else {
				tmp = 6;
				angle = 0;
			}			
		} 		*/	
		
		self.rubik.draw();

    };


    this.keyPressed = function(key) {
        //rotate Layer von rubik aufrufen

    };
	this.rotateTest = function (a, l) {
		axis = a;
		layer = l;
	}
	this.directionTest = function (dir) {
	    direction = dir; 
		rotate = true;
		//self.rubik.rotateLayer(axis, layer, dir);
	}
	this.showTest = function(face) {
		if(face=='F') {
			PerspectivRotate(0,[0.0,1.0,0.0]);
		}
		if(face=='T') {
			PerspectivRotate(90,[1.0,0.0,0.0]);		
		}
		if(face=='D') {
			PerspectivRotate(-90,[1.0,0.0,0.0]);			
		}
		if(face=='B') {
			PerspectivRotate(180,[0.0,1.0,0.0]);			
		}
		if(face=='R') {
			PerspectivRotate(-90,[0.0,1.0,0.0]);		
		}
		if(face=='L') {
			PerspectivRotate(90,[0.0,1.0,0.0]);				
		}
		if(face=='FR') {
			PerspectivRotate(-30,[0.0,1.0,0.0]);		
		}
		if(face=='FT') {
			PerspectivRotate(30,[1.0,0.0,0.0]);			
		}
		if(face=='FD') {
			PerspectivRotate(-30,[1.0,0.0,0.0]);		
		}
		if(face=='FL') {
			PerspectivRotate(30,[0.0,1.0,0.0]);			
		}
		if(face=='Rotate'){ PerspectivRotate(0,[0.0,1.0,0.0]); rot=0; rotatePers = true;}
		if(face=='Stop'){ rotatePers = false;}
		if(face=='Reset') { PerspectivRotate(0,[1.0,1.0,0.0]); this.rubik = new RubikCube($gl, $shaderProgram);};
	}
}

function getCubeTextureNames() {
	/*	return  new Array("RubiksCube/images/Flaeche_weiss.png",
						  "RubiksCube/images/Flaeche_gruen.png",
						  "RubiksCube/images/Flaeche_orange.png",
						  "RubiksCube/images/Flaeche_blau.png",
						  "RubiksCube/images/Flaeche_rot.png",
						  "RubiksCube/images/Flaeche_gelb.png",
						  "RubiksCube/images/Flaeche_schwarz.png");*/
		return  new Array("RubiksCube/images/weiss.png",
						  "RubiksCube/images/gruen.png",
						  "RubiksCube/images/orange.png",
						  "RubiksCube/images/blau.png",
						  "RubiksCube/images/rot.png",
						  "RubiksCube/images/gelb.png",
						  "RubiksCube/images/schwarz.png",
						  "RubiksCube/images/weiss_logo.png");
}

function PerspectivRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0;  
  mvMatrix = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
 // perspectiveMatrix = perspectiveMatrix.x(Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4());
}

function PerspectivTranslate(v) {
  perspectiveMatrix = perspectiveMatrix.x(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

	var mouseDown = false;
	var lastMouseX = null;
	var lastMouseY = null;
	
	function handleMouseDown(event) {
		mouseDown = true;
		lastMouseX = event.clientX;
		lastMouseY = event.clientY;
	}

	function handleMouseUp(event) {
		mouseDown = false;
	}	

function handleMouseMove(event) {
		if (!mouseDown) {
			return;
		}		
		var newX = event.clientX;
		var newY = event.clientY;
		
	 //   XRotation = 1.6;
		
		if(XRotation > 360) {XRotation = 0;}

		var deltaY = newY - lastMouseY;
		
	//	YRotation = 1.6 ;
		
		if(YRotation < 0) {YRotation = 360;}
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



