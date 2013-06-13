var canvas;
var gl;

var lastCubeUpdateTime = 0;

var rotateDirection = [1,1,1];
var cubeRotationY = 0.0;
var cubeRotationX = 0.0;

var mvMatrix;
var shaderProgram;

var vertexPositionAttribute;
var textureCoordAttribute;
var perspectiveMatrix;

//
// initTextures
//
// Initialize the textures we'll be using, then initiate a load of
// the texture images. The handleTextureLoaded() callback will finish
// the job; it gets called each time a texture finishes loading.
//
var  textureArray= new Array();
function initTextures()
{
	for (var i = 0; i<=6;i++)
	{
		TextureLoader(i);
	}
}

function TextureLoader(anz) {

 // var anz = textureArray.length;
  textureArray[anz] = gl.createTexture();
  textureArray[anz].image = new Image();
  textureArray[anz].image.onload = function()    
  {
		  gl.bindTexture(gl.TEXTURE_2D, textureArray[anz]);		  
		  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureArray[anz].image);
		  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		  gl.generateMipmap(gl.TEXTURE_2D);
		  gl.bindTexture(gl.TEXTURE_2D, null);
  }
  textureArray[anz].image.src = "RubiksCube/images/"+anz+".png";
}
//
// drawScene
//
// Draw the scene.
//
function drawScene() {
  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
  
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  
  loadIdentity();
  
  // Now move the drawing position a bit to where we want to start
  // drawing the cube.
  
  // rotate whole scene
  mvTranslate([0.0, 0.0, -5.0]);
  mvRotate(cubeRotationY, [0,1,0]);
  mvRotate(cubeRotationX, [1,0,0]);
  
  var cube_width = 0.5;

}
/*
document.onkeypress = function(e) {
	var LEFT_KEY = 37;
	var TOP_KEY = 38;
	var RIGHT_KEY = 39;
	var BOTTOM_KEY = 40;
	
	var W = 119;
	var A = 97;
	var S = 115;
	var D = 100;
	
	var key = 0;
	
	if (e.keyCode === 0) {
		key = e.charCode;
	} else {
		key = e.keyCode;
	}
	console.log(cubeRotationX);	
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
			rotateDirection = [0,1,0];
		  	cubeRotationX += 10;		  	
		  	break;
		case D:
		  	rotateDirection = [0,1,0];
		  	cubeRotationX -= 10;
		  	break;
		case W:
			rotateDirection = [1,0,0];
		  	cubeRotationY += 10;
		  	break;
		case S:
			rotateDirection = [1,0,0];
		  	cubeRotationY -= 10;
		  	break;
		
	} 
}*/

