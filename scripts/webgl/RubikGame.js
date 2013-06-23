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
    console.log("Starte SlotMachineGame...");
 	initTextures(getCubeTextureNames());
    this.rubik = new RubikCube($gl, $shaderProgram);
    var self = this;
    this.selectedX=1;
    this.selectedY=1;
    this.selectedZ=2;
    this.selectedFace='F';
    this.controlMode=0; //0: Selection, 1: Rotate
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
			ModelViewMatrixRotate(rot++,[1.0,1.0,0.0]);
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
                self.rubik.selectCube(self.selectedX,self.selectedY,self.selectedZ);

    };


    this.keyPressed = function(key) {
		PerspectivRotate(90,[0.0,1.0,0.0]);
        if(this.controlMode===0){
        switch(key){
            case 37: //Left-Key
                this.moveLeftRight(-1);
                break;
            case 38: //Up-Key
                this.moveUpDown(1);
                break;
            case 39: //Right-Key
                this.moveLeftRight(1);
                break;
            case 40: //Down-Key
                this.moveUpDown(-1);
                break;
            case 65: //A-Key
                //switch to Rotation-Mode
                this.controlMode=1;
                break;
            case 66,89: //B-Key (or Y)
                //nothing
                break;
                    
        }
        this.checkSelection();
        }
        else{
          switch(key){
            case 37: //Left-Key
                this.rotateLeftRight(-1);
                break;
            case 38: //Up-Key
                this.rotateUpDown(-1);
                break;
            case 39: //Right-Key
                this.rotateLeftRight(1);
                break;
            case 40: //Down-Key
                this.rotateUpDown(1);
                break;
            case 65: //A-Key
                //nothing
                break;
            case 66,89: //B-Key (or Y)
                //switch Back To Selection-Mode
                this.controlMode=0;
                break;
                    
        }
        }


    };
    
    this.moveLeftRight = function(direction){
        switch(this.selectedFace){
            case 'F':
            case 'T':
            case 'D':
                this.selectedX+=direction;
                break;
                
            case 'L':
                this.selectedZ+=direction;
                break;
                
            case 'R':
                this.selectedZ-=direction;
                break;
                
            case 'B':
                this.selectedX-=direction;
                break;
        }
        
    };
    this.moveUpDown = function(direction){
        switch(this.selectedFace){
            case 'F':
            case 'L':
            case 'R':
            case 'B':
                this.selectedY+=direction;
                break;              
            case 'T':
                this.selectedZ-=direction;
                break;              
            case 'D':
                this.selectedZ+=direction;
                break;
        }
    };
    
    this.rotateLeftRight = function(dir){
        direction=dir;
        switch(this.selectedFace){
            case 'F':
            case 'B':
            case 'L':
            case 'R':
                axis='y';
                layer=this.selectedY;
                rotate=true;
                break;              
            case 'T':          
                direction*=-1;
            case 'D':

                axis='z';
                layer=this.selectedZ;
                rotate=true;
                break;   
        }
        this.controlMode=0;
    }
    
        this.rotateUpDown = function(dir){
        direction=dir;
        switch(this.selectedFace){
            case 'B':
                direction*=-1; 
            case 'F':

            case 'T':             
            case 'D':
                axis='x';
                layer=this.selectedX;
                rotate=true;
                break;              
            case 'R':
            direction*=-1;
            case 'L':
                axis='z';
                layer=this.selectedZ;
                rotate=true;
                break;   
        }
        this.controlMode=0;
    }
    
    this.checkSelection = function(){
        if(this.selectedX===3){
            this.selectedX=2;
            this.selectedFace='R';
        }
        if(this.selectedX===-1){
            this.selectedX=0;
            this.selectedFace='L';
        }
        if(this.selectedY===3){
            this.selectedY=2;
            this.selectedFace='T';
		}
        if(this.selectedY===-1){
            this.selectedY=0;
            this.selectedFace='D';
        }
        if(this.selectedZ===3){
            this.selectedZ=2;
            this.selectedFace='F';
        }
        if(this.selectedZ===-1){
            this.selectedZ=0;
            this.selectedFace='B';
        }
        console.log("Darzustellende Seite: "+this.selectedFace);
        this.showTest(this.selectedFace);
    };
    
	this.rotateTest = function (a, l) {
		axis = a;
		layer = l;
                this.rubik.selectCube(l,1,2);
	}
	this.directionTest = function (dir) {
	    direction = dir; 
		rotate = true;
		//self.rubik.rotateLayer(axis, layer, dir);
	}
	this.showTest = function(face) {
		if(face=='F') {
			ModelViewMatrixRotate(0,[0.0,1.0,0.0]);
		}
		if(face=='T') {
			ModelViewMatrixRotate(90,[1.0,0.0,0.0]);		
		}
		if(face=='D') {
			ModelViewMatrixRotate(-90,[1.0,0.0,0.0]);			
		}
		if(face=='B') {
			ModelViewMatrixRotate(180,[0.0,1.0,0.0]);			
		}
		if(face=='R') {
			ModelViewMatrixRotate(-90,[0.0,1.0,0.0]);		
		}
		if(face=='L') {
			ModelViewMatrixRotate(90,[0.0,1.0,0.0]);				
		}
		if(face=='FR') {
			ModelViewMatrixRotate(-30,[0.0,1.0,0.0]);		
		}
		if(face=='FT') {
			ModelViewMatrixRotate(30,[1.0,0.0,0.0]);			
		}
		if(face=='FD') {
			ModelViewMatrixRotate(-30,[1.0,0.0,0.0]);		
		}
		if(face=='FL') {
			ModelViewMatrixRotate(30,[0.0,1.0,0.0]);			
		}
		if(face=='Rotate'){/* PerspectivRotate(0,[0.0,1.0,0.0]); rot=0;*/ rotatePers = true;}
		if(face=='Stop'){ rotatePers = false;}
		if(face=='Reset') { ModelViewMatrixRotate(0,[1.0,1.0,0.0]); this.rubik = new RubikCube($gl, $shaderProgram);};
	}
}

function getCubeTextureNames() {
		return new Array("images/webgl/rubik/Flaeche_pink.png",
						  "images/webgl/rubik/Flaeche_gruen.png",
						  "images/webgl/rubik/Flaeche_orange.png",
						  "images/webgl/rubik/Flaeche_blau.png",
						  "images/webgl/rubik/Flaeche_rot.png",
						  "images/webgl/rubik/Flaeche_gelb.png",
						  "images/webgl/rubik/Flaeche_schwarz.png",
                                                  "images/webgl/rubik/Flaeche_pink_logo.png",
                                                  "images/webgl/rubik/pink_select.png",
						  "images/webgl/rubik/gruen_select.png",
						  "images/webgl/rubik/orange_select.png",
						  "images/webgl/rubik/blau_select.png",
						  "images/webgl/rubik/rot_select.png",
						  "images/webgl/rubik/gelb_select.png",
						  "images/webgl/rubik/Flaeche_schwarz.png");
		/*return  new Array("images/webgl/rubik/weiss.png",
						  "images/webgl/rubik/gruen.png",
						  "images/webgl/rubik/orange.png",
						  "images/webgl/rubik/blau.png",
						  "images/webgl/rubik/rot.png",
						  "images/webgl/rubik/gelb.png",
						  "images/webgl/rubik/schwarz.png",
						  "images/webgl/rubik/weiss_logo.png");*/
}

function ModelViewMatrixRotate(angle, v) {
	alert("Hier1");
  var inRadians = angle * Math.PI / 180.0;  
  mvMatrix = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
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



