/*
 * RubikGame.js
 * Rotation and Selection Logic behind Rubik'Cube
 * 
 * Controller
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

function RubikGame($gl, $shaderProgram) {
    console.log("Starte RubikGame...");
    soundsRubik.playTheme();
    initTextures(getCubeTextureNames());
    this.initialized = 0;
    //Number of initial Random Turns:
    this.randomDifficulty = 5;
    //Model:
    this.rubik = new RubikCube($gl, $shaderProgram, this);

    //initial Selection
    this.selectedX = 1;
    this.selectedY = 1;
    this.selectedZ = 2;

    //rotation axis
    var vecX = Vector.create([1, 0, 0]);
    var vecY = Vector.create([0, 1, 0]);
    //needed for reselect in controlMode==2
    var vecZ = Vector.create([0, 0, 1]);
    //-1: Startup, til Cube randomized, 0: Selection, 1: Rotate, 2: Free Rotation View, 3: Win
    this.controlMode = -1;


    this.drawScene = function() {
        //empty canvas
        $gl.clear($gl.COLOR_BUFFER_BIT | $gl.DEPTH_BUFFER_BIT);
        $gl.enable($gl.DEPTH_TEST);
        $gl.depthFunc($gl.LEQUAL);
        self.setupLight();
        //adjust perspective
        perspectiveMatrix = makePerspective(45, canvasWidth / canvasHeight, 0.1, 100.0);
        PerspectivTranslate([0.0, 0.0, -8.0]);

        //cubes initial view:
        if (initState) {
            initState = false;
            ModelViewMatrixRotate(30, Vector.create([1.0, 0.0, 0.0]));
            ModelViewMatrixRotate(-30, Vector.create([0.0, 1.0, 0.0]));
        }

        var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

        //Rotate Layer if needed:
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
        //Rotate whole Cube:
        if (rotateFree) {
            if (FreeRotationAngle < 90) {
                if (FreeRotationAngle === 0) {
                    //Rotation arround z-axis causes bug:
                    if (Math.abs(axisVec.elements[2]) === 1) {
                        console.log("Wrong Move! Forbidden!!!");
                        rotateFree = false;
                    }
                    else {
                        soundsRubik.playSpin();
                        FreeRotationAngle += rotationAngle;
                        ModelViewMatrixRotate(rotationAngle * FreeDirection, axisVec);
                    }
                }
                else {
                    FreeRotationAngle += rotationAngle;
                    ModelViewMatrixRotate(rotationAngle * FreeDirection, axisVec);
                }
            } else {
                FreeRotationAngle = 0;
                //Recalculate direction vectors
                vecX = vecX.rotate(FreeDirection * Math.PI / 2, Line.create([0, 0, 0], axisVec));
                vecX = Vector.create([Math.round(vecX.elements[0]), Math.round(vecX.elements[1]), Math.round(vecX.elements[2])]);
                console.log(vecX);
                vecY = vecY.rotate(FreeDirection * Math.PI / 2, Line.create([0, 0, 0], axisVec));
                vecY = Vector.create([Math.round(vecY.elements[0]), Math.round(vecY.elements[1]), Math.round(vecY.elements[2])]);
                console.log(vecY);
                vecZ = vecZ.rotate(FreeDirection * Math.PI / 2, Line.create([0, 0, 0], axisVec));
                vecZ = Vector.create([Math.round(vecZ.elements[0]), Math.round(vecZ.elements[1]), Math.round(vecZ.elements[2])]);
                rotateFree = false;
                //reselect sub-cube if in free
                if (self.controlMode === 2) {
                    console.log(vecZ);
                    self.selectedX = 1 - vecZ.elements[0];
                    self.selectedY = 1 - vecZ.elements[1];
                    self.selectedZ = 1 + vecZ.elements[2];
                    console.log("new Selection:" + self.selectedX + " " + self.selectedY + " " + self.selectedZ);
                }
            }
        }
        //random if not finished initial rotations
        if (self.initialized < self.randomDifficulty && !rotate) {
            self.randomize();
            self.initialized++;
        }
        //allow moving after initialized
        else if (self.initialized === self.randomDifficulty && self.controlMode === -1) {
            self.controlMode = 0;
            gameoptions.startTime();
        }
        //shows cube selection 
        if (self.controlMode === 0) {
            self.rubik.selectCube(self.selectedX, self.selectedY, self.selectedZ);
        }
        //shows cube rotate selection texture
        else if (self.controlMode === 1) {
            self.rubik.selectCubeForRotation(self.selectedX, self.selectedY, self.selectedZ);

        }
        //no selection in FreeRotation mode
        else if (self.controlMode === 2) {
            self.rubik.hideSelection();

        }
        //draw cube:
        self.rubik.draw();

    }
    ;

    //rotates random Layer in random direction
    this.randomize = function() {
        var tempAxis = ['x', 'y', 'z'];
        var tAxis = axis;
        var tLayer = layer;
        //nie 2mal gleiche achse/layer:
        do {
            axis = tempAxis[Math.floor(Math.random() * 3)];
        }
        while (tAxis === axis);
        do {
            layer = Math.floor(Math.random() * 3);
        }
        while (tLayer === layer);

        if (Math.random() < 0.5) {
            direction = 1;
        }
        else {
            direction = -1;
        }
        rotate = true;
        soundsRubik.playTurn();
    };

    //check for key interactions
    this.keyPressed = function(key) {
        PerspectivRotate(90, [0.0, 1.0, 0.0]);
        if (rotate || rotateFree) {
            //wait until rotation is finished
        }
        else if (this.controlMode === 0) {
            switch (key) {
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
                    soundsRubik.playSelect();
                    this.controlMode = 1;
                    break;
                case 66:
                case 89: //B-Key (or Y)
                    //switch to Free Rotation
                    this.controlMode = 2;
                    break;
            }
            this.checkForNescRotation();
        }
        else if (this.controlMode === 1) {
            switch (key) {
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
                    //no function
                    break;
                case 66:
                case 89: //B-Key (or Y)
                    //switch back To Selection-Mode
                    this.controlMode = 0;
                    break;
                    break;
            }
        }
        else if (this.controlMode === 2) {
            switch (key) {
                case 37: //Left-Key
                    //free Rotation
                    this.rotateFreeLeftRight(-1);
                    rotateFree = true;
                    break;
                case 38: //Up-Key
                    //Free Rotation
                    this.rotateFreeUpDown(1);
                    rotateFree = true;
                    break;
                case 39: //Right-Key
                    //Free Rotation
                    this.rotateFreeLeftRight(1);
                    rotateFree = true;
                    break;
                case 40: //Down-Key
                    //Free Rotation
                    this.rotateFreeUpDown(-1);
                    rotateFree = true;
                    break;
                case 65: //A-Key
                    //switch Back To Selection-Mode
                    this.controlMode = 0;
                    break;
                case 66:
                case 89: //B-Key (or Y)
                    //no function
                    break;
            }
        }
        else if (this.controlMode === 3) {
            switch (key) {
                
                case 66:
                case 89: //B-Key (or Y)
                    //reset Timer & # of Rotations
                    gameoptions.hideWinImage();
                    gameoptions.hideBoxRestart();
                    gameoptions.resetTime();
                    gameoptions.resetRotations();
                    //set mode =-1
                    this.controlMode = -1;
                    //set initialized =0;
                    this.initialized = 0;
                    break;
            }
        }
    };
    //move cursor on vecX
    this.moveLeftRight = function(direction) {
        this.selectedX += vecX.elements[0] * direction;
        this.selectedY += vecX.elements[1] * direction;
        this.selectedZ -= vecX.elements[2] * direction;
        axisVec = vecY;
        FreeDirection = -direction;
        console.log("dir: " + FreeDirection);
    };
    //moves cursor on vecY
    this.moveUpDown = function(direction) {
        this.selectedX += vecY.elements[0] * direction;
        this.selectedY += vecY.elements[1] * direction;
        this.selectedZ -= vecY.elements[2] * direction;
        axisVec = vecX;
        FreeDirection = direction;
        console.log("dir: " + FreeDirection);
    };
    //rotate layer around vecY
    this.rotateLeftRight = function(dir) {
        direction = dir * (vecY.elements[0] + vecY.elements[1] + vecY.elements[2]);
        if (Math.abs(vecY.elements[0]) === 1) {
            axis = 'x';
        }
        else if (Math.abs(vecY.elements[1]) === 1) {
            axis = 'y';
        }
        else {
            axis = 'z';
            direction *= -1;
        }
        layer = Math.abs(this.selectedX * vecY.elements[0] + this.selectedY * vecY.elements[1] + this.selectedZ * vecY.elements[2]);
        rotate = true;
        soundsRubik.playTurn();
        gameoptions.countRotations('rotate');
        this.controlMode = 0;
    };
    //rotate layer around vecX
    this.rotateUpDown = function(dir) {
        direction = dir * (vecX.elements[0] + vecX.elements[1] + vecX.elements[2]);
        if (Math.abs(vecX.elements[0]) === 1) {
            axis = 'x';
        }
        else if (Math.abs(vecX.elements[1]) === 1) {
            axis = 'y';
        }
        else {
            axis = 'z';
            direction *= -1;
        }
        layer = Math.abs(this.selectedX * vecX.elements[0] + this.selectedY * vecX.elements[1] + this.selectedZ * vecX.elements[2]);
        rotate = true;
        soundsRubik.playTurn();
        gameoptions.countRotations('rotate');
        this.controlMode = 0;
    };
    //rotate cube around vecY
    this.rotateFreeLeftRight = function(dir) {
        FreeDirection = dir;
        axisVec = vecY;
    };
    //rotate cube around vecX
    this.rotateFreeUpDown = function(dir) {
        FreeDirection = dir;
        axisVec = vecX;
    };



    //checks cursor position, resets pos and initiates rotation
    this.checkForNescRotation = function() {
        var playRotationSound= false;
        console.log("checked:" + this.selectedX + " " + this.selectedY + " " + this.selectedZ);
        if (this.selectedX < 0 || this.selectedX > 2) {
            switch (this.selectedX) {
                case -1:
                    this.selectedX = 0;
                    break;
                case 3:
                    this.selectedX = 2;
                    break;
            }
            rotateFree = true;
        }
        else if (this.selectedY < 0 || this.selectedY > 2) {
            switch (this.selectedY) {
                case -1:
                    this.selectedY = 0;
                    break;
                case 3:
                    this.selectedY = 2;
                    break;
            }
            rotateFree = true;
        }
        else if (this.selectedZ < 0 || this.selectedZ > 2) {
            switch (this.selectedZ) {
                case -1:
                    this.selectedZ = 0;
                    break;
                case 3:
                    this.selectedZ = 2;
                    break;
            }
            rotateFree = true;
        }
        if(rotateFree){
            
        }
        else{
            soundsRubik.playSwitch();
        }
    };

    //light vars
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
//needed textures
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
//rotates mvMatrix (Cube Rotation)
function ModelViewMatrixRotate(angle, v) {
    var inRadians = angle * Math.PI / 180.0;
    mvMatrix = mvMatrix.x(Matrix.Rotation(inRadians, v).ensure4x4());
}


function PerspectivTranslate(v) {
    perspectiveMatrix = perspectiveMatrix.x(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}


