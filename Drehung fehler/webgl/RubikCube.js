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
	this.play = function(angle,axis){
			if(axis == "z") {
			  for(var x = 0; x<3;x++) {	  
				cubeXYZ[x][0][2].rotate(angle,[0,0,1]);
				cubeXYZ[x][1][2].rotate(angle,[0,0,1]);  // front vertikal
				cubeXYZ[x][2][2].rotate(angle,[0,0,1]);
			  }
			}
			if(axis == "x") {
			  for(var x = 0; x<3;x++) {	  
				cubeXYZ[0][2][x].rotate(angle,[0,1,0]);
				cubeXYZ[1][2][x].rotate(angle,[0,1,0]);  // front vertikal
				cubeXYZ[2][2][x].rotate(angle,[0,1,0]);
			  }
			}
	}
	this.draw = function(){
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
