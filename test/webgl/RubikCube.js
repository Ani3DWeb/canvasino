var lastCubeUpdateTime = 0;

var rotateDirection = [1,1,1];
var cubeRotationY = 20.0;
var cubeRotationX = 20.0;
var cubeTranslationX = 0.0;
var cubeTranslationY = 0.0;
var step = 0;
var animation = 0;
//
// generate all 27 cubes 
//
// Draw the scene.
//
var RubikCube = function() {
var cubeXYZ = [];
var cube, cube2;
var state, state1 = false;
	this.Init = function () {
		// this function is called only once at gamestart
		// to initial all Cubes at startposition
	  if(state==true)
		{
		  return 1;
		}
		state = true;
	  var cube_width = 1.0;	  
			for(var x=0; x<3; x++){
				cubeXYZ[x] = [];
				for(var y=0; y<3; y++){
					cubeXYZ[x][y] = [];
					for(var z=0; z<3; z++){
						var leCube = new Cube(gl,cube_width);
						leCube.create();
						leCube.changeColors(this.initColors(x,y,z)); 
						leCube.translate(x-1,y-1,(z-1));
					//	leCube.drawCube();
						cubeXYZ[x][y][z] = leCube;
					}
				}
			}  
	}
	var angle = 0.0;
	var angle2 = 360.0;
	this.play = function(){
			
			angle += 10;
			
			angle2 -= 10;
			
	// begin layer rotation test 	
	animation++;
	
	if(animation < 120)
	{			
			  for(var x = 0; x<3;x++) {
				cubeXYZ[x][0][0].rotate(angle,[0,0,1]);
				cubeXYZ[x][1][0].rotate(angle,[0,0,1]);   // back vertikal
				cubeXYZ[x][2][0].rotate(angle,[0,0,1]);
			  }	  
			  for(var x = 0; x<3;x++) {
				cubeXYZ[x][0][1].rotate(angle2,[0,0,1]);
				cubeXYZ[x][1][1].rotate(angle2,[0,0,1]);  // middle vertikal
				cubeXYZ[x][2][1].rotate(angle2,[0,0,1]);
			  } 	  
			  for(var x = 0; x<3;x++) {	  
				cubeXYZ[x][0][2].rotate(angle,[0,0,1]);
				cubeXYZ[x][1][2].rotate(angle,[0,0,1]);  // front vertikal
				cubeXYZ[x][2][2].rotate(angle,[0,0,1]);
			  }
	} else {	  
			  for(var x = 0; x<3;x++) {
				cubeXYZ[0][0][x].rotate(angle,[0,1,0]);
				cubeXYZ[1][0][x].rotate(angle,[0,1,0]);   // down horizontal
				cubeXYZ[2][0][x].rotate(angle,[0,1,0]);
			  }	  
			  for(var x = 0; x<3;x++) {
				cubeXYZ[0][1][x].rotate(angle2,[0,1,0]);
				cubeXYZ[1][1][x].rotate(angle2,[0,1,0]);   // middle horizontal
				cubeXYZ[2][1][x].rotate(angle2,[0,1,0]);
			  }	  
			  for(var x = 0; x<3;x++) {
				cubeXYZ[0][2][x].rotate(angle,[0,1,0]);
				cubeXYZ[1][2][x].rotate(angle,[0,1,0]);   // down horizontal
				cubeXYZ[2][2][x].rotate(angle,[0,1,0]);
			  }
	  
	}
	if(animation > 240) { animation = 0;}
	  // end layer rotation test
	  
	  // draw all cubes to Scene every Frame 
	  		for(var x=0; x<3; x++){
				for(var y=0; y<3; y++){
					for(var z=0; z<3; z++){
						cubeXYZ[x][y][z].drawCube();
					}
				}
			}  
	}
	this.getTextureNames = function() {
		return  Texturenames = new Array("RubiksCube/images/Flaeche_pink.png",
										 "RubiksCube/images/Flaeche_blau.png",
										 "RubiksCube/images/Flaeche_orange.png",
										 "RubiksCube/images/Flaeche_gruen.png",
										 "RubiksCube/images/Flaeche_rot.png",
										 "RubiksCube/images/Flaeche_gelb.png",
										 "RubiksCube/images/Flaeche_schwarz.png");
	}
	this.initColors = function(x,y,z) {
		var colorPositions = [];
		// top, front, left, back, right, down				
		if(y==2)
			colorPositions[0] = textureArray[0];	 // top pink
		else
			colorPositions[0] = textureArray[6];
		if(z==0)
			colorPositions[1] = textureArray[1];	 // front gruen
		else
			colorPositions[1] = textureArray[6];	
		if(x==0)
			colorPositions[2] = textureArray[2];	// left orange
		else
			colorPositions[2] = textureArray[6];
		if(z==2)
			colorPositions[3] = textureArray[3];		// back blau
		else
			colorPositions[3] = textureArray[6];
		if(x==2)
			colorPositions[4] = textureArray[4];		// right rot
		else
			colorPositions[4] = textureArray[6];
		if(y==0)
			colorPositions[5] = textureArray[5];	// down gelb
		else
			colorPositions[5] = textureArray[6];			
		
		return colorPositions;
	}

document.onkeypress = function(e) {
	var LEFT_KEY = 37;
	var TOP_KEY = 38;
	var RIGHT_KEY = 39;
	var BOTTOM_KEY = 40;
	
	var W = 119;
	var A = 97;
	var X = 120;
	var D = 100;
	
	var key = 0;
	
	if (e.keyCode === 0) {
		key = e.charCode;
	} else {
		key = e.keyCode;
	}
	
	console.log("X"+cubeRotationX+"Y"+cubeRotationY);	
	switch (key)
	{
		case LEFT_KEY:
			cubeXOffset -= xIncValue;
			break;
		case RIGHT_KEY:
		  	cubeXOffset += xIncValue;
		  	break;
		case TOP_KEY:
		  	cubeYOffset -= yIncValue;
		  	break;
		case BOTTOM_KEY:
		  	cubeYOffset += yIncValue;
		  	break;
		case A:
			rotateDirection = [1,1,0];
		  	cubeRotationY += 10;		  	
		  	break;
		case D:
		  	rotateDirection = [0,1,0];
		  	cubeRotationY -= 10;
		  	break;
		case W:
			rotateDirection = [0,1,0];
		  	cubeRotationX -= 10;
		  	break;
		case X:
			rotateDirection = [0,1,0];
		  	cubeRotationX += 10;
		  	break;
		
	} 
	}
	var direction = -1.0;
	this.animate = function() {
	
	// animation function for 
	// demo use only
	
	   step++;
	   console.log(step);
	     if(step<100)
		 {
			cubeTranslationX = cubeTranslationX + (0.1 * direction);
		 } else
		 {
			cubeTranslationY = cubeTranslationY + (0.1 * direction);
		 }
		if ((cubeTranslationX <= -3.0)||(cubeTranslationY <= -1.5))
		{
			direction = 1.0;
		} 
		if ((cubeTranslationX >= 3.0)||(cubeTranslationY >= 1.5))
		{
			direction = -1.0;
		}
		
		if(step > 200) step = 0;
		
		if(step % 2 == 0)
		{
			cubeRotationX += 1;
		}
		
		if(step % 3 == 0)
		{
			cubeRotationY += 1;
		}
		  if(step ==200)
		  {
		  var randomnumber=Math.floor((Math.random()*4)+1);
		  
		  var backgroundimage = document.getElementById("backgound_image");  
		  backgroundimage.style.width = canvas.width;
		  backgroundimage.style.height = canvas.height;
		  backgroundimage.src = "Hintergrund/"+randomnumber+".png";
		  }
			for(var x=0; x<3; x++){
				for(var y=0; y<3; y++){
					for(var z=0; z<3; z++){
						cubeXYZ[x][y][z].drawCube();
					}
				}
			}  
		
	}	
}
