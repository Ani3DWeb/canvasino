var canvas;
var gl;
var mvMatrix;
var shaderProgram;
var selected_game;
var Game = function(game_number) {
  this.init = function() {
		  canvas = document.getElementById("rubixcube_webgl");
		  
		  var randomnumber=Math.floor((Math.random()*4)+1);
		  
		  var backgroundimage = document.getElementById("backgound_image");  
		  backgroundimage.style.width = canvas.width;
		  backgroundimage.style.height = canvas.height;
		  backgroundimage.src = "Hintergrund/"+randomnumber+".png";

		  initWebGL(canvas);      // Initialize the GL context

		  
		  if (gl) {
			gl.clearColor(0.0, 0.0, 0.0, 0.0);  // Clear to black, fully opaque
			gl.clearDepth(1.0);                 // Clear everything
			gl.enable(gl.DEPTH_TEST);           // Enable depth testing
			gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
			
			// Initialize the shaders; this is where all the lighting for the
			// vertices and so forth is established.
			
			initShaders();
			this.start();
		  }
  }
  this.start = function() {
  			// Set up to draw the scene periodically.
			if(game_number==1)
			{
				alert("Slotmaschine");
				//selected_game = new SlotMaschine();
			} else if (game_number==2)
			{
				selected_game = new RubikCube();
				
			}
		initTextures(selected_game.getTextureNames());		
		setInterval(this.drawScene, 15);
  }
  this.drawScene = function() {
	  // Clear the canvas before we start drawing on it.

	  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	  
	  perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
	  
	  // Set the drawing position to the "identity" point, which is
	  // the center of the scene.
	  
		loadIdentity();
	  mvTranslate([cubeTranslationX, cubeTranslationY, -10.0]);
	  mvRotate(cubeRotationX, [1,0,0]);
	  mvRotate(cubeRotationY, [0,1,0]);
		if(selected_game) {
			selected_game.Init();
			selected_game.draw();
			//selected_game.play();
			//selected_game.animate();		
		}
  }
 
}
var angle =  0;
var angle2 = 0;
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
				selected_game.play(angle +=10,"z");
		  	break;
		case D:
				selected_game.play(angle2 +=10,"x");
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

