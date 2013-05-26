/*
 * RubikCube:
 * Datenhaltung und Status-Logik (gelöst/wo ist welche Farbe)
 * 
 */
function RubikCube($gl, $shaderProgram) {
    var self=this;
	self.cubeXYZ = [];
	
    // cubeXYZ init:
    for (var x = 0; x < 3; x++) {
        self.cubeXYZ[x] = [];
        for (var y = 0; y < 3; y++) {
            self.cubeXYZ[x][y] = [];
            for (var z = 0; z < 3; z++) {
                //TODO: Cubes an die richtige Anfangsposition, texturieren
                self.cubeXYZ[x][y][z] = new Cube($gl, $shaderProgram, 0.95);
				self.cubeXYZ[x][y][z].translate([x - 1, y - 1, z - 1]);
            }
        }
    }

    //rotateLayer(x,1,90);
    //rotateLayer(z,3,-90);
    this.rotateLayer = function(axis, layerNumber, angle) {
        var tempLayer = [];
        var x;
        var y;
        var z;

        if (axis == "z")
            z = layerNumber;
        else if (axis == "x")
            x = layerNumber;
        else if (axis == "y")
            y = layerNumber;



        for (var a = 0; a < 3; a++) {
            tempLayer[a] = [];
            for (var b = 0; b < 3; b++) {
                if (axis == "z") {
                    x = a;
                    y = b;
                } else if (axis == "x") {
                    z = a;
                    y = b;
                } else if (axis == "y") {
                    x = a;
                    z = b;
                }
                var tempCube = self.cubeXYZ[x][y][z];
                changeCubeColors(tempCube, axis, angle);
                var tempArray = getCubeChangeAfter90DegreeRotation(axis, angle, x, y, z);

                tempLayer[tempArray[0]][tempArray[1]] = tempCube;
            }
        }

        //Move cubes from tempLayer to CubeXYZ:
        for (a = 0; a < 3; a++) {
            for (b = 0; b < 3; b++) {
                if (axis == "z") {
                    x = a;
                    y = b;
                } else if (axis == "x") {
                    z = a;
                    y = b;
                } else if (axis == "y") {
                    x = a;
                    z = b;
                }
                cubeXYZ[x][y][z] = tempLayer[a][b];
//				cubeXYZ[x][y][z].rotate();
            }
        }

        checkState();
    };


    this.checkState = function() {
        var tempColor;
        var wrong = false;

        // Front (z==0) and Back (z==2):
        var z = 0;
        do {
            if (z == 0)
                colPos = 1; // front
            else if (z == 2)
                colPos = 3; // back

            tempColor = self.cubeXYZ[0][0][z].colorPositions[colPos];
            for (var x = 0; x < 3; x++) {
                for (var y = 1; y < 3; y++) {
                    if (self.cubeXYZ[x][y][z].colorPositions[colPos] != tempColor) {
                        wrong = true;
                        break;
                    }
                }
                if (wrong)
                    break;
            }
            if (z < 2)
                z = 2;
            else
                break;
        } while (!wrong);

        // If front- and back-colors are in the right order:
        if (!wrong) {
            // Left (x==0) and Right (x==2):
            x = 0;
            do {
                if (x == 0)
                    colPos = 2; // left
                else if (x == 2)
                    colPos = 4; // right

                tempColor = self.cubeXYZ[x][0][0].colorPositions[colPos];
                for (var y = 0; y < 3; y++) {
                    for (var z = 1; z < 3; z++) {
                        if (self.cubeXYZ[x][y][z].colorPositions[colPos] != tempColor) {
                            wrong = true;
                            break;
                        }
                    }
                    if (wrong)
                        break;
                }
                if (x < 2)
                    x = 2;
                else
                    break;
            } while (!wrong);

            // If front-, back-, left- and right-colors are in the right order:
            if (!wrong) {
                // Top (y==2):
                y = 2;
                colPos = 0; // top

                tempColor = self.cubeXYZ[0][y][0].colorPositions[colPos];
                for (var x = 0; x < 3; x++) {
                    for (var z = 1; z < 3; z++) {
                        if (self.cubeXYZ[x][y][z].colorPositions[colPos] != tempColor) {
                            wrong = true;
                            break;
                        }
                    }
                    if (wrong)
                        break;
                }
            }
        }

        if (!wrong) {
            // WIN WIN WIN
        }
    };

    this.randomize = function() {

    };

    this.control = function() {

    }


    this.draw = function() {
        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
                for (var z = 0; z < 3; z++) {
                    self.cubeXYZ[x][y][z].draw();
                }
            }
        }
    }
}

function getCubeChangeAfter90DegreeRotation(axis, angle, x, y, z) {
    if (axis == "z") {
        var a = x;
        var b = y;
    } else if (axis == "x") {
        var a = z;
        var b = y;
    } else if (axis == "y") {
        var a = x;
        var b = z;
    }

    // Change a and b to new coordinates:
    if ((angle > 0 && (a == 0 && b == 0)) || (angle < 0 && (a == 2 && b == 0))) {
        b += 2;
    } else if ((angle > 0 && (a == 1 && b == 0)) || (angle < 0 && (a == 2 && b == 1))) {
        a -= 1;
        b += 1
    } else if ((angle > 0 && (a == 2 && b == 0)) || (angle < 0 && (a == 2 && b == 2))) {
        a -= 2;
    } else if ((angle > 0 && (a == 0 && b == 1)) || (angle < 0 && (a == 1 && b == 0))) {
        a += 1;
        b += 1;
    } else if (angle > 0 && (a == 1 && b == 1)) {
        // do nothing
    } else if ((angle > 0 && (a == 2 && b == 1)) || (angle < 0 && (a == 1 && b == 2))) {
        a -= 1;
        b -= 1;
    } else if ((angle > 0 && (a == 0 && b == 2)) || (angle < 0 && (a == 0 && b == 0))) {
        a += 2;
    } else if ((angle > 0 && (a == 1 && b == 2)) || (angle < 0 && (a == 0 && b == 1))) {
        a += 1;
        b -= 1;
    } else if ((angle > 0 && (a == 0 && b == 2)) || (angle < 0 && (a == 0 && b == 2))) {
        b -= 2;
    }

    /*	var arrayXYZ = [];
     if(axis == "z") {
     array[0] = a;	// x
     array[1] = b;	// y
     array[2] = z;	// z
     } else if (axis == "x") {
     array[0] = x;	// x
     array[1] = b;	// y
     array[2] = a;	// z
     } else if (axis == "y") {
     var a = x;
     var b = z;
     array[0] = a;	// x
     array[1] = y;	// y
     array[2] = b;	// z
     } */

    var arrayAB = [];
    arrayAB[0] = a;
    arrayAB[1] = b;

    return arrayAB;
}



function changeCubeColors(cube, axis, angle) {
    var colorPositions = cube.colorPositions;
    var newColorPositions = [];

    if (axis == "z") {
        if (angle > 0) {
            colorPositions[0] = newColorPositions[4]; // top	>>> right
            colorPositions[4] = newColorPositions[5]; // right	>>> down
            colorPositions[5] = newColorPositions[2]; // down 	>>> left
            colorPositions[2] = newColorPositions[0]; // left 	>>> top
        } else if (angle < 0) {
            colorPositions[0] = newColorPositions[2]; // top	>>> left
            colorPositions[2] = newColorPositions[5]; // left	>>> down
            colorPositions[5] = newColorPositions[4]; // down 	>>> right
            colorPositions[4] = newColorPositions[0]; // right 	>>> top
        }
    } else if (axis == "x") {
        if (angle > 0) {
            colorPositions[0] = newColorPositions[1]; // top	>>> front
            colorPositions[1] = newColorPositions[5]; // front	>>> down
            colorPositions[5] = newColorPositions[3]; // down 	>>> back
            colorPositions[3] = newColorPositions[0]; // back 	>>> top
        } else if (angle < 0) {
            colorPositions[0] = newColorPositions[3]; // top	>>> back
            colorPositions[3] = newColorPositions[5]; // back	>>> down
            colorPositions[5] = newColorPositions[1]; // down 	>>> front
            colorPositions[1] = newColorPositions[0]; // front 	>>> top
        }
    } else if (axis == "y") {
        if (angle > 0) {
            colorPositions[1] = newColorPositions[4]; // front	>>> right
            colorPositions[4] = newColorPositions[3]; // right	>>> back
            colorPositions[3] = newColorPositions[2]; // back 	>>> left
            colorPositions[2] = newColorPositions[1]; // left 	>>> front
        } else if (angle < 0) {
            colorPositions[1] = newColorPositions[2]; // front	>>> left
            colorPositions[2] = newColorPositions[3]; // left	>>> back
            colorPositions[3] = newColorPositions[4]; // back 	>>> right
            colorPositions[4] = newColorPositions[1]; // right 	>>> front
        }
    }

    cube.changeColors(newColorPositions);




}

