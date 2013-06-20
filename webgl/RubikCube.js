/*
 * RubikCube:
 * Datenhaltung und Status-Logik (gelöst/wo ist welche Farbe)
 * 
 */

function RubikCube($gl, $shaderProgram) {
    this.cubeNumber = 0;
    var self=this;
	self.cubeXYZ = [];	
	var ColorModel = new RubikColorModel($gl, $shaderProgram);
//	var cube;
    self.colorCache = [];
    // cubeXYZ init:
	this.initCube = function (){
		for (var x = 0; x < 3; x++) {
			self.cubeXYZ[x] = [];
			for (var y = 0; y < 3; y++) {
				self.cubeXYZ[x][y] = [];
				for (var z = 0; z < 3; z++) {
					//TODO: Cubes an die richtige Anfangsposition, texturieren
					self.cubeXYZ[x][y][z] = new Cube($gl, $shaderProgram, 0.95);
					self.cubeXYZ[x][y][z].setCubeNumber(this.cubeNumber);				
					self.cubeXYZ[x][y][z].initTexture(NewRubiksCubeTextures(x,y,z,ColorModel));
					self.cubeXYZ[x][y][z].translate([x - 1, y - 1, z - 1]);
					this.cubeNumber++;
				}
			}
		}
	};
	
	this.initCube();	 
	this.NewCubeSetting = function(layerNumber) {
	    this.initCube();
	//	console.log("paint new");
		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				for (var z = 0; z < 3; z++) {
					self.cubeXYZ[x][y][z].initTexture(NewRubiksCubeTextures(x,y,z,ColorModel));					
				}
			}
		}
	}
	
    //rotateLayer(x,1,90);
    //rotateLayer(z,3,-90);
	var angle = 0;
    this.rotateLayer = function(axis, layerNumber, direction) {
        angle += rotationAngle;
			var x;
			var y;
			var z;

			if (axis == "z")
				z = layerNumber;
			else if (axis == "x")
				x = layerNumber;
			else if (axis == "y")
				y = layerNumber;

        //Move cubes from tempLayer to CubeXYZ:
        for (var a = 0; a < 3; a++) {
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
				
			  if(axis == "z") {
				self.cubeXYZ[x][y][z].rotateOrigin(rotationAngle*direction,[0.0,0.0,1.0]);
			  } else if (axis == "x") {
				self.cubeXYZ[x][y][z].rotateOrigin(rotationAngle*direction,[1.0,0.0,0.0]);
			  } else if (axis == "y") {
				self.cubeXYZ[x][y][z].rotateOrigin(rotationAngle*direction,[0.0,1.0,0.0]);
			  }			  

            }
        }

		if(angle==90 || angle==(-90)) {
			angle = 0;
			ColorModel.update(axis,layerNumber,direction);
			this.NewCubeSetting(layerNumber);	
			this.checkState();			
		}
    };
		
    this.checkState = function() {
		var colors = ColorModel.getColorArray();
		var num_solved_faces = 0;
		for(var x= 0; x<= 5; x++) {
		     var firstArrayColor = colors[x][0][0];
			 var counter = 0;
		   for(var y = 0; y<= 2; y++) {
		      for(var z = 0; z<= 2; z++) {	
			        if((colors[0][y][z]=="logo")&(firstArrayColor=="weiss")) { counter++;}
					if(colors[x][y][z] == firstArrayColor)
					{
						counter++;
					}
			  }	
		   }
		  if(counter == 9) { num_solved_faces++;}
		}
		console.log("Solved faces: "+num_solved_faces);
		//if(num_solved_faces==6) { alert("Gewonnen"); }
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

function NewRubiksCubeTextures(x, y, z,model) {
		return model.getColors(x,y,z);
}

