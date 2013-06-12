var cubeXOffset;
var cubeYOffset;
var cubeZOffset;
var cubeRotation;
var grad;
var circle;
var wheel;
var lastCubeUpdateTime = 0;
var randomFront;
var randomCircular;

function SlotMachine($gl) {
    //TODO:
    wheel = new Array (3);
	cubeXOffset = new Array (3);
	cubeYOffset = new Array (3);
	cubeZOffset = new Array (3);
	cubeRotation = new Array (3);
	grad = new Array (3);
	circle = new Array (3);
	randomFront = new Array (3);
	randomCircular = new Array (3);
	
	
    for (var w=0; w <= 3; w++) {
        wheel[w]=new Array (8);
		cubeXOffset[w] = new Array (8);
		cubeYOffset[w] = new Array (8);
		cubeZOffset[w] = new Array (8);
		cubeRotation[w] = new Array (8);
		grad[w] = new Array (8);
		circle[w] = new Array (8);
		randomFront[w] = 0;
		randomCircular[w] = 0;
		
        for (var c=0; c <= 8; c++) {
            wheel[w][c] = new Cube(gl, shaderProgram, 0.25);
			//wheel[w][c].changeLogicColors(initColors(w,c))
			wheel[w][c].initTexture(initCubeTextures(w,c));
			cubeXOffset[w][c] = -0.33 + w/3;
			cubeYOffset[w][c] = 0.0;
			cubeZOffset[w][c] = 0.0;
			cubeRotation[w][c] = 0.0;
			grad[w][c] = (360/8)*c;
			circle[w][c] = (2*Math.PI/8)*(c-1);
        }
    }
	
	lastCubeUpdateTime = (new Date).getTime();

    //rotateLayer(x,1,90);
    //rotateLayer(z,3,-90);
    this.rotateWheel = function(wheelNumber) {
	
		var currentTime = (new Date).getTime();
		console.log(randomCircular[wheelNumber] + " " + grad[wheelNumber][randomFront[wheelNumber]]);
		if (grad[wheelNumber][randomFront[wheelNumber]]>randomCircular[wheelNumber]*360)
		{
			if (lastCubeUpdateTime) {
				var delta = 0;
				for (var c=0; c <= 8; c++) {
					
					
					circle[wheelNumber][c] -= delta / 1000.0;
					grad[wheelNumber][c] = -(360/(2 * Math.PI))*circle[wheelNumber][c];
					cubeRotation[wheelNumber][c] = grad[wheelNumber][c];
					cubeYOffset[wheelNumber][c] = yIncValue* Math.sin(circle[wheelNumber][c]);
					cubeZOffset[wheelNumber][c] = zIncValue* Math.cos(circle[wheelNumber][c]);
					
					//wheel[wheelNumber][c].save();
					wheel[wheelNumber][c].translate([cubeXOffset[wheelNumber][c], cubeYOffset[wheelNumber][c], cubeZOffset[wheelNumber][c]]);	
					wheel[wheelNumber][c].rotate(cubeRotation[wheelNumber][c], [1, 0, 0]);
					wheel[wheelNumber][c].draw();
					
					wheel[wheelNumber][c].revert();
					wheel[wheelNumber][c].revert();
					wheel[wheelNumber][c].revert();
					wheel[wheelNumber][c].revert();
					//console.log(cubeXOffset[wheelNumber][c] + " " +cubeYOffset[wheelNumber][c] +" " + cubeZOffset[wheelNumber][c]);
				}
			   //buhlscher randomGen
			}
		}
		else{
			if (lastCubeUpdateTime) {
				var delta = currentTime - lastCubeUpdateTime;
				for (var c=0; c <= 8; c++) {
					
					
					circle[wheelNumber][c] -= delta / 1000.0;
					grad[wheelNumber][c] = -(360/(2 * Math.PI))*circle[wheelNumber][c];					
					cubeRotation[wheelNumber][c] = grad[wheelNumber][c];
					cubeYOffset[wheelNumber][c] = yIncValue* Math.sin(circle[wheelNumber][c]);
					cubeZOffset[wheelNumber][c] = zIncValue* Math.cos(circle[wheelNumber][c]);
					
					//wheel[wheelNumber][c].save();
					wheel[wheelNumber][c].translate([cubeXOffset[wheelNumber][c], cubeYOffset[wheelNumber][c], cubeZOffset[wheelNumber][c]]);	
					wheel[wheelNumber][c].rotate(cubeRotation[wheelNumber][c], [1, 0, 0]);
					wheel[wheelNumber][c].draw();
					
					wheel[wheelNumber][c].revert();
					wheel[wheelNumber][c].revert();
					wheel[wheelNumber][c].revert();
					wheel[wheelNumber][c].revert();
					//console.log(cubeXOffset[wheelNumber][c] + " " +cubeYOffset[wheelNumber][c] +" " + cubeZOffset[wheelNumber][c]);
				}
			   //buhlscher randomGen
			}
		}
			//console.log("ich bin da und drehe");
		 lastCubeUpdateTime = currentTime;
		 
			
    };

	this.stopRotation = function(wheelNumber){
		
		for (var c=0; c <= 8; c++) {
			wheel[wheelNumber][c].translate([cubeXOffset[wheelNumber][c], cubeYOffset[wheelNumber][c], cubeZOffset[wheelNumber][c]]);	
			wheel[wheelNumber][c].rotate(cubeRotation[wheelNumber][c], [1, 0, 0]);
			wheel[wheelNumber][c].draw();
			wheel[wheelNumber][c].revert();
			wheel[wheelNumber][c].revert();
			wheel[wheelNumber][c].revert();
			wheel[wheelNumber][c].revert();
			//console.log(cubeXOffset[wheelNumber][c] + " " +cubeYOffset[wheelNumber][c] +" " + cubeZOffset[wheelNumber][c]);
		}
	};
	
	this.start = function(){
		if ((grad[0][randomFront[0]]>randomCircular[0]*360
			&& grad[1][randomFront[1]]>randomCircular[1]*360
			&& grad[2][randomFront[2]]>randomCircular[2]*360)
			||
			randomCircular[0]==0
			&&randomCircular[1]==0
			&&randomCircular[2]==0
			){
				for (var i = 0; i<3;i++){
				randomFront[i] = Math.round(Math.random()*8);
				randomCircular[i] += Math.round(Math.random()*2)
			}
		}
	};
	
    this.checkState = function() {

    };

    this.randomize = function() {

    };

    this.control = function() {

    };

}

function initCubeTextures(w,c) {
		var colorPositions = [];		
		switch (c){
			case 1:
				colorPositions[3] = textureArray[0];
				break;
			case 2:
				colorPositions[3] = textureArray[1];
				break;	
			case 3:
				colorPositions[3] = textureArray[2];
				break;	
			case 4:
				colorPositions[3] = textureArray[3];
				break;	
			case 5:
				colorPositions[3] = textureArray[4];
				break;	
			case 6:
				colorPositions[3] = textureArray[5];
				break;	
			case 7:
				colorPositions[3] = textureArray[6];
				break;	
			case 8:
				colorPositions[3] = textureArray[7];
				break;	
		}
		
		return colorPositions;
}