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

var rotationAngle = 5;
var XRotation = 30, YRotation = 30;

var initState = true;
var axis, layer, direction;
var rotate = false;
var rotatePers = false;
var rot = 0.7;

var rotateFree = false;
var FreeDirection = 0;
var FreeRotationAngle = 0;		
var FreeAxis = ["y","z","x","z","x","y"];
var FreeIndex = 0;

function RubikGame($gl, $shaderProgram) {
    console.log("Starte RubikGame...");
    soundsRubik.playTheme();
    initTextures(getCubeTextureNames());
    this.initialized = 0;
    this.randomDifficulty=5;
    this.rubik = new RubikCube($gl, $shaderProgram);
    
    this.selectedX = 1;
    this.selectedY = 1;
    this.selectedZ = 2;
    this.selectedFace = 'F';
    this.controlMode = -1; //-1: Startup, til Cube randomized, 0: Selection, 1: Rotate, 2: Free Rotation View

    this.drawScene = function() {
        //Canvas leeren
        $gl.clear($gl.COLOR_BUFFER_BIT | $gl.DEPTH_BUFFER_BIT);
        $gl.enable($gl.DEPTH_TEST);
        $gl.depthFunc($gl.LEQUAL);
        self.setupLight();
        perspectiveMatrix = makePerspective(45, canvasWidth / canvasHeight, 0.1, 100.0);


        PerspectivTranslate([0.0, 0.0, -8.0]);

        if (initState) {
            initState = false;
            ModelViewMatrixRotate(30, [1.0, 0.0, 0.0]);
            ModelViewMatrixRotate(-30, [0.0, 1.0, 0.0]);
        }

        var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
        //Zeichne Rubik

        if (rotate) {
            if (angle < 90) {
                angle += rotationAngle;
                self.rubik.rotateLayer(axis, layer, direction);
            } else {
                tmp = 1;
                angle = 0;
                rotate = false;
            }
        }
		
			if (rotateFree) {
				if(FreeRotationAngle < 90) {
				FreeRotationAngle += rotationAngle;
				if(FreeAxis==0){
					ModelViewMatrixRotate(rotationAngle * FreeDirection, FreeAxis[0]);	
				} else (FreeAxis==4){
				    ModelViewMatrixRotate(rotationAngle * FreeDirection, FreeAxis[4]);	
				}				
			} else {
				FreeRotationAngle = 0;
				rotateFree = false;
			}
		}
		
        if (self.initialized <  self.randomDifficulty && !rotate) {
            self.randomize();
            self.initialized++;
        }
        else if(self.initialized ===  self.randomDifficulty && self.controlMode=== -1){
            self.controlMode = 0;
        }
        if (self.controlMode === 0) {
            self.rubik.selectCube(self.selectedX, self.selectedY, self.selectedZ);
        }
        else if (self.controlMode === 1) {
            self.rubik.selectCubeForRotation(self.selectedX, self.selectedY, self.selectedZ);

        }
        else if (self.controlMode === 2) {
            self.rubik.hideSelection();

        }

        self.rubik.draw();

    };


    this.keyPressed = function(key) {
        PerspectivRotate(90, [0.0, 1.0, 0.0]);
        if (this.controlMode === 0) {
            switch (key) {
                case 37: //Left-Key
                	soundsRubik.playSwitch();
                    this.moveLeftRight(-1);
                    break;
                case 38: //Up-Key
                	soundsRubik.playSwitch();
                    this.moveUpDown(1);
                    break;
                case 39: //Right-Key
                	soundsRubik.playSwitch();
                    this.moveLeftRight(1);
                    break;
                case 40: //Down-Key
                	soundsRubik.playSwitch();
                    this.moveUpDown(-1);
                    break;
                case 65: //A-Key
                    //switch to Rotation-Mode
                    soundsRubik.playSelect();
                    this.controlMode = 1;
                    break;
                case 66:
                case 89: //B-Key (or Y)
                    //switch to Free Rotation
					this.controlMode = 2;
                    break;

            }
            this.checkSelection();
        }
        else if (this.controlMode === 1) {
            switch (key) {
                case 37: //Left-Key
                	soundsRubik.playTurn();
                	gameoptions.countRotations('rotate');
                    this.rotateLeftRight(-1);
                    break;
                case 38: //Up-Key
                	soundsRubik.playTurn();
                	gameoptions.countRotations('rotate');
                    this.rotateUpDown(-1);
                    break;
                case 39: //Right-Key
                	soundsRubik.playTurn();
                	gameoptions.countRotations('rotate');
                    this.rotateLeftRight(1);
                    break;
                case 40: //Down-Key
                	soundsRubik.playTurn();
                	gameoptions.countRotations('rotate');
                    this.rotateUpDown(1);
                    break;
                case 65: //A-Key
                    //switch Back To Selection-Mode
                    this.controlMode = 0;
                    break;
                case 66:
                case 89: //B-Key (or Y)
                    //switch
                    break;

            }
        }
        else if (this.controlMode === 2) {
            switch (key) {
                case 37: //Left-Key
                    //free Rotation
					FreeDirection = 1;
					this.rotateFreeLeftRight(FreeDirection);
					FreeIndex = 0;
					rotateFree = true;
                    break;
                case 38: //Up-Key
                    //Free Rotation
					FreeDirection = 1;
					this.rotateFreeUpDown(FreeDirection);
					FreeIndex = 4;
					rotateFree = true;					
                    break;
                case 39: //Right-Key
                    //Free Rotation
					FreeDirection = -1;
					this.rotateFreeLeftRight(FreeDirection);
					FreeIndex = 0;
					rotateFree = true;					
                    break;
                case 40: //Down-Key
                    //Free Rotation
					FreeDirection = -1;
					this.rotateFreeUpDown(FreeDirection);
					FreeIndex = 4;
					rotateFree = true;
                    break;
                case 65: //A-Key
                case 66:
                case 89: //B-Key (or Y)
                    //switch Back To Selection-Mode
                    this.controlMode = 0;
                    break;
            }
        }
    };

    this.moveLeftRight = function(direction) {
        switch (this.selectedFace) {
            case 'F':
            case 'T':
            case 'D':
                this.selectedX += direction;
                break;

            case 'L':
                this.selectedZ += direction;
                break;

            case 'R':
                this.selectedZ -= direction;
                break;

            case 'B':
                this.selectedX -= direction;
                break;
        }

    };
    this.moveUpDown = function(direction) {
        switch (this.selectedFace) {
            case 'F':
            case 'L':
            case 'R':
            case 'B':
                this.selectedY += direction;
                break;
            case 'T':
                this.selectedZ -= direction;
                break;
            case 'D':
                this.selectedZ += direction;
                break;
        }
    };

    this.rotateLeftRight = function(dir) {
        direction = dir;
        switch (this.selectedFace) {
            case 'F':
            case 'B':
            case 'L':
            case 'R':
                axis = 'y';
                layer = this.selectedY;
                rotate = true;
                break;
            case 'T':
                direction *= -1;
            case 'D':

                axis = 'z';
                layer = this.selectedZ;
                rotate = true;
                break;
        }
        this.controlMode = 0;
    };

    this.rotateUpDown = function(dir) {
        direction = dir;
        switch (this.selectedFace) {
            case 'B':
                direction *= -1;
            case 'F':

            case 'T':
            case 'D':
                axis = 'x';
                layer = this.selectedX;
                rotate = true;
                break;
            case 'R':
                direction *= -1;
            case 'L':
                axis = 'z';
                layer = this.selectedZ;
                rotate = true;
                break;
        }
        this.controlMode = 0;
    };

//--
    this.rotateFreeLeftRight = function(dir) {
		var tmp = FreeAxis[1];
		if(dir == -1){
			FreeAxis[1] = FreeAxis[4];
			FreeAxis[4] = FreeAxis[3];
			FreeAxis[3] = FreeAxis[2];
			FreeAxis[2] = tmp;
		} else	{
			FreeAxis[1] = FreeAxis[2];
			FreeAxis[2] = FreeAxis[3];
			FreeAxis[3] = FreeAxis[4];
			FreeAxis[4] = tmp;			
		}
    };

    this.rotateFreeUpDown = function(dir) {
	    var tmp = FreeAxis[1];
		if(dir == -1){
			FreeAxis[1] = FreeAxis[5];
			FreeAxis[5] = FreeAxis[3];
			FreeAxis[3] = FreeAxis[0];
			FreeAxis[0] = tmp;
		} else {
			FreeAxis[1] = FreeAxis[0];
			FreeAxis[0] = FreeAxis[3];
			FreeAxis[3] = FreeAxis[5];
			FreeAxis[5] = tmp;		
		}
    };
//--
	
    //rotates random Layer in random direction
    this.randomize = function() {
        var tempAxis = ['x', 'y', 'z'];
        var tAxis = axis;
        var tLayer = layer;
         //nie 2mal gleiche achse/layer:
        do{
             axis=tempAxis[Math.floor(Math.random() * 3)];
        }
        while(tAxis===axis);
        do{
             layer = Math.floor(Math.random() * 3);
        }
        while(tLayer===layer); 
        
        if (Math.random() < 0.5) {
            direction = 1;
        }
        else {
            direction = -1;
        }
        rotate = true;
        soundsRubik.playTurn();
    };

    this.checkSelection = function() {
        if (this.selectedX === 3) {
            this.selectedX = 2;
            this.selectedFace = 'R';
        }
        if (this.selectedX === -1) {
            this.selectedX = 0;
            this.selectedFace = 'L';
        }
        if (this.selectedY === 3) {
            this.selectedY = 2;
            this.selectedFace = 'T';
        }
        if (this.selectedY === -1) {
            this.selectedY = 0;
            this.selectedFace = 'D';
        }
        if (this.selectedZ === 3) {
            this.selectedZ = 2;
            this.selectedFace = 'F';
        }
        if (this.selectedZ === -1) {
            this.selectedZ = 0;
            this.selectedFace = 'B';
        }
        console.log("Darzustellende Seite: " + this.selectedFace);
        this.RotateSelection(this.selectedFace);
    };

    this.RotateSelection = function(face) {
        mvMatrix = Matrix.I(4);
        if (face == 'F') {
            ModelViewMatrixRotate(30, [1.0, 0.0, 0.0]);
            ModelViewMatrixRotate(-30, [0.0, 1.0, 0.0]);
        }
        if (face == 'T') {
            ModelViewMatrixRotate(120, [1.0, 0.0, 0.0]);
            ModelViewMatrixRotate(30, [0.0, 0.0, 1.0]);
        }
        if (face == 'D') {
            ModelViewMatrixRotate(-60, [1.0, 0.0, 0.0]);
            ModelViewMatrixRotate(-30, [0.0, 0.0, 1.0]);
        }
        if (face == 'B') {
            ModelViewMatrixRotate(30, [1.0, 0.0, 0.0]);
            ModelViewMatrixRotate(150, [0.0, 1.0, 0.0]);
        }
        if (face == 'R') {
            ModelViewMatrixRotate(30, [1.0, 0.0, 0.0]);
            ModelViewMatrixRotate(-120, [0.0, 1.0, 0.0]);
        }
        if (face == 'L') {
            ModelViewMatrixRotate(30, [1.0, 0.0, 0.0]);
            ModelViewMatrixRotate(60, [0.0, 1.0, 0.0]);
        }
    };


    this.setupLight = function()
    {
        gl.uniform1f(shaderProgram.materialShininessUniform, 10.0);

        gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, 1);

        gl.uniform3f(shaderProgram.ambientColorUniform, 1.0, 1.0, 1.0);
        gl.uniform3f(shaderProgram.pointLightingSpecularColorUniform,
                0.8, 0.8, 0.8);
        gl.uniform3f(shaderProgram.pointLightingDiffuseColorUniform,
                0.8, 0.8, 0.8);

        gl.uniform3f(shaderProgram.pointLightingLocationUniform,
                10, 10, 20);
    };
    var self = this;
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
            "images/webgl/rubik/pink_select_logo.png",
            "images/webgl/rubik/pink_pfeil.png",
            "images/webgl/rubik/gruen_pfeil.png",
            "images/webgl/rubik/orange_pfeil.png",
            "images/webgl/rubik/blau_pfeil.png",
            "images/webgl/rubik/rot_pfeil.png",
            "images/webgl/rubik/gelb_pfeil.png",
            "images/webgl/rubik/pink_pfeil.png");
}

function ModelViewMatrixRotate(angle, v) {
    var inRadians = angle * Math.PI / 180.0;
    mvMatrix = mvMatrix.x(Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4());
}

function PerspectivTranslate(v) {
    perspectiveMatrix = perspectiveMatrix.x(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}





