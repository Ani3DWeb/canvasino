
function RubikColorModel($gl, $shaderProgram) {	
 	this.CubeColors = [
		[["weiss","weiss","weiss"], ["weiss","logo","weiss"], ["weiss","weiss","weiss"]],  // top
		[["green","green","green"], ["green","green","green"], ["green","green","green"]],  // front	
		[["orange","orange","orange"], ["orange","orange","orange"], ["orange","orange","orange"]],  // left
		[["blue","blue","blue"], ["blue","blue","blue"], ["blue","blue","blue"]],  // back
		[["red","red","red"], ["red","red","red"], ["red","red","red"]],  // right
		[["yellow","yellow","yellow"], ["yellow","yellow","yellow"], ["yellow","yellow","yellow"]]  // down;		
	];
	this.getColorAtPosition = function(x,y,a) {
			return this.CubeColors[a][x][y];
	};
	
	this.texturize = function(tex) {
	    var texture = tex;
		if(texture=="weiss") {
		   return textureArray[0];
		} else if(texture=="green") {
		   return textureArray[1]
		} else if(texture=="orange") {
		   return textureArray[2]
		} else if(texture=="blue") {
		   return textureArray[3]
		} else if(texture=="red") {
		   return textureArray[4]
		} else if(texture=="yellow") {
		   return textureArray[5]
		} else if(texture=="logo") {
		   return textureArray[7]
		}
		return textureArray[6];
		
	};
    this.texturizeSelected = function(tex) {
	    var texture = tex;
		if(texture=="weiss") {
		   return textureArray[8];
		} else if(texture=="green") {
		   return textureArray[9]
		} else if(texture=="orange") {
		   return textureArray[10]
		} else if(texture=="blue") {
		   return textureArray[11]
		} else if(texture=="red") {
		   return textureArray[12]
		} else if(texture=="yellow") {
		   return textureArray[13]
		} else if(texture=="logo") {
		   return textureArray[14]
		}
		return textureArray[6];
		
	};
    this.texturizeRotate = function(tex) {
	    var texture = tex;
		if(texture=="weiss") {
		   return textureArray[15];
		} else if(texture=="green") {
		   return textureArray[16]
		} else if(texture=="orange") {
		   return textureArray[17]
		} else if(texture=="blue") {
		   return textureArray[18]
		} else if(texture=="red") {
		   return textureArray[19]
		} else if(texture=="yellow") {
		   return textureArray[20]
		} else if(texture=="logo") {
		   return textureArray[21]
		}
		return textureArray[6];
		
	};
	this.getColors = function(x,y,z){
	 var colorPositions = [];
		for(var i=0; i<=textureArray.length;i++) {
			colorPositions[i] = textureArray[6];
		}
		if(z==0){
		//	console.log("back"+this.getModelColors(x,y,z,3));
			colorPositions[3] = this.texturize(this.getColorAtPosition(x,y,3));
                        colorPositions[9] = this.texturizeSelected(this.getColorAtPosition(x,y,3));
                        colorPositions[15]= this.texturizeRotate(this.getColorAtPosition(x,y,3));
		}		
		if(z==2){
		//	console.log("front"+this.getModelColors(x,y,z,1));
			colorPositions[1] = this.texturize(this.getColorAtPosition(x,y,1));
                        colorPositions[7] = this.texturizeSelected(this.getColorAtPosition(x,y,1));
                        colorPositions[13] = this.texturizeRotate(this.getColorAtPosition(x,y,1));
		}
		if(x==0) {
		 //  console.log("left"+this.getModelColors(y,z,z,2));
		   colorPositions[2] = this.texturize(this.getColorAtPosition(z,y,2));
                   colorPositions[8] = this.texturizeSelected(this.getColorAtPosition(z,y,2));
                   colorPositions[14] = this.texturizeRotate(this.getColorAtPosition(z,y,2));
		}
		if(x==2) {
		 //  console.log("right"+this.getModelColors(y,z,z,4));
		   colorPositions[4] = this.texturize(this.getColorAtPosition(z,y,4));
                   colorPositions[10] = this.texturizeSelected(this.getColorAtPosition(z,y,4));
                   colorPositions[16] = this.texturizeRotate(this.getColorAtPosition(z,y,4));
		}	
		if(y==0){
		//	console.log("down"+this.getModelColors(x,z,y,5));
			colorPositions[5] = this.texturize(this.getColorAtPosition(x,z,5));
                        colorPositions[11] = this.texturizeSelected(this.getColorAtPosition(x,z,5));
                        colorPositions[17] = this.texturizeRotate(this.getColorAtPosition(x,z,5));
		}				
		if(y==2){
		 //  console.log("top"+this.getModelColors(x,z,y,0));
		   colorPositions[0] = this.texturize(this.getColorAtPosition(x,z,0));
                   colorPositions[6] = this.texturizeSelected(this.getColorAtPosition(x,z,0));
                   colorPositions[12] = this.texturizeRotate(this.getColorAtPosition(x,z,0));
		}		
		return colorPositions;
	};
	this.update = function(axis, layerNumber, direction)
	{
		var ColorCache = [2];
		if(axis=='x') {
				  // front face to cache
     			  ColorCache[0] = this.CubeColors[1][layerNumber][0];
				  ColorCache[1] = this.CubeColors[1][layerNumber][1];
				  ColorCache[2] = this.CubeColors[1][layerNumber][2];
				if(direction==1){
				  // top --> front 
				  this.CubeColors[1][layerNumber][2] = this.CubeColors[0][layerNumber][0];
				  this.CubeColors[1][layerNumber][1] = this.CubeColors[0][layerNumber][1];
				  this.CubeColors[1][layerNumber][0] = this.CubeColors[0][layerNumber][2];
				  // back --> top
				  this.CubeColors[0][layerNumber][2] = this.CubeColors[3][layerNumber][2];
				  this.CubeColors[0][layerNumber][1] = this.CubeColors[3][layerNumber][1];
				  this.CubeColors[0][layerNumber][0] = this.CubeColors[3][layerNumber][0];				  
				  // down --> back
				  this.CubeColors[3][layerNumber][2] = this.CubeColors[5][layerNumber][0];
				  this.CubeColors[3][layerNumber][1] = this.CubeColors[5][layerNumber][1];
				  this.CubeColors[3][layerNumber][0] = this.CubeColors[5][layerNumber][2];
				  // cache --> down
				  this.CubeColors[5][layerNumber][2] = ColorCache[2];
				  this.CubeColors[5][layerNumber][1] = ColorCache[1];
				  this.CubeColors[5][layerNumber][0] = ColorCache[0];
				   if(layerNumber==2) {
				        // switch right colors +90
						ColorCache[0] = this.CubeColors[4][0][0]; // 0
						ColorCache[1] = this.CubeColors[4][0][1]; // 7	
						/*  face numbers
						   -------------
						   | 2 | 6 | 3 |
						   -------------
						   | 5 | 8 | 7 |
						   -------------
						   | 1 | 4 | 0 |
						   -------------  */						   
						// 1 --> 0
						this.CubeColors[4][0][0] = this.CubeColors[4][2][0];
						// 2 --> 1
						this.CubeColors[4][2][0] = this.CubeColors[4][2][2];
                        // 3 --> 2
						this.CubeColors[4][2][2] = this.CubeColors[4][0][2];
						// cache --> 3
						this.CubeColors[4][0][2] = ColorCache[0];
						// 4 --> 7
						this.CubeColors[4][0][1] = this.CubeColors[4][1][0];
						// 5 --> 4
						this.CubeColors[4][1][0] = this.CubeColors[4][2][1];
						// 6 --> 5
						this.CubeColors[4][2][1] = this.CubeColors[4][1][2];
						// cache --> 6
						this.CubeColors[4][1][2] = ColorCache[1];						
				   } else if(layerNumber==0) {
				        // switch left colors +90
						ColorCache[0] = this.CubeColors[2][2][0]; // 0
						ColorCache[1] = this.CubeColors[2][2][1]; // 7	
						/*  face numbers
						   -------------
						   | 2 | 6 | 3 |
						   -------------
						   | 5 | 8 | 7 |
						   -------------
						   | 1 | 4 | 0 |
						   -------------  */						   
						// 3 --> 0
						this.CubeColors[2][2][0] = this.CubeColors[2][2][2];
						// 2 --> 3
						this.CubeColors[2][2][2] = this.CubeColors[2][0][2];
                        // 1 --> 2
						this.CubeColors[2][0][2] = this.CubeColors[2][0][0];
						// cache --> 1
						this.CubeColors[2][0][0] = ColorCache[0];
						// 6 --> 7
						this.CubeColors[2][2][1] = this.CubeColors[2][1][2];
						// 5 --> 6
						this.CubeColors[2][1][2] = this.CubeColors[2][0][1];
						// 4 --> 5
						this.CubeColors[2][0][1] = this.CubeColors[2][1][0];
						// cache --> 4
						this.CubeColors[2][1][0] = ColorCache[1];		   
				   }
				}else {
				  // down --> front
				  this.CubeColors[1][layerNumber][2] = this.CubeColors[5][layerNumber][2];
				  this.CubeColors[1][layerNumber][1] = this.CubeColors[5][layerNumber][1];
				  this.CubeColors[1][layerNumber][0] = this.CubeColors[5][layerNumber][0];
				  // back --> down
				  this.CubeColors[5][layerNumber][2] = this.CubeColors[3][layerNumber][0];
				  this.CubeColors[5][layerNumber][1] = this.CubeColors[3][layerNumber][1];
				  this.CubeColors[5][layerNumber][0] = this.CubeColors[3][layerNumber][2];				  
				  // top --> back 
				  this.CubeColors[3][layerNumber][2] = this.CubeColors[0][layerNumber][2];
				  this.CubeColors[3][layerNumber][1] = this.CubeColors[0][layerNumber][1];
				  this.CubeColors[3][layerNumber][0] = this.CubeColors[0][layerNumber][0];	
				  // cache --> top
				  this.CubeColors[0][layerNumber][2] = ColorCache[0];
				  this.CubeColors[0][layerNumber][1] = ColorCache[1];
				  this.CubeColors[0][layerNumber][0] = ColorCache[2];
				   if(layerNumber==2) {
				        // switch right colors -90
						ColorCache[0] = this.CubeColors[4][0][0]; // 0
						ColorCache[1] = this.CubeColors[4][0][1]; // 7	
						/*  face numbers
						   -------------
						   | 2 | 6 | 3 |
						   -------------
						   | 5 | 8 | 7 |
						   -------------
						   | 1 | 4 | 0 |
						   -------------  */						   
						// 3 --> 0
						this.CubeColors[4][0][0] = this.CubeColors[4][0][2];
						// 2 --> 3
						this.CubeColors[4][0][2] = this.CubeColors[4][2][2];
                        // 1 --> 2
						this.CubeColors[4][2][2] = this.CubeColors[4][2][0];
						// cache --> 1
						this.CubeColors[4][2][0] = ColorCache[0];
						// 6 --> 7
						this.CubeColors[4][0][1] = this.CubeColors[4][1][2];
						// 5 --> 6
						this.CubeColors[4][1][2] = this.CubeColors[4][2][1];
						// 4 --> 5
						this.CubeColors[4][2][1] = this.CubeColors[4][1][0];
						// cache --> 4
						this.CubeColors[4][1][0] = ColorCache[1];
				   } else if(layerNumber==0) {
				        // switch left colors -90
						ColorCache[0] = this.CubeColors[2][2][0]; // 0
						ColorCache[1] = this.CubeColors[2][2][1]; // 7	
						/*  face numbers
						   -------------
						   | 2 | 6 | 3 |
						   -------------
						   | 5 | 8 | 7 |
						   -------------
						   | 1 | 4 | 0 |
						   -------------  */						   
						// 1 --> 0
						this.CubeColors[2][2][0] = this.CubeColors[2][0][0];
						// 2 --> 1
						this.CubeColors[2][0][0] = this.CubeColors[2][0][2];
                        // 3 --> 2
						this.CubeColors[2][0][2] = this.CubeColors[2][2][2];
						// cache --> 3
						this.CubeColors[2][2][2] = ColorCache[0];
						// 4 --> 7
						this.CubeColors[2][2][1] = this.CubeColors[2][1][0];
						// 5 --> 4
						this.CubeColors[2][1][0] = this.CubeColors[2][0][1];
						// 6 --> 5
						this.CubeColors[2][0][1] = this.CubeColors[2][1][2];
						// cache --> 6
						this.CubeColors[2][1][2] = ColorCache[1];						
				   }				  
				}
		}
		if(axis=='y') {
		     	  ColorCache[0] = this.CubeColors[1][0][layerNumber];
				  ColorCache[1] = this.CubeColors[1][1][layerNumber];
				  ColorCache[2] = this.CubeColors[1][2][layerNumber];
			    if(direction==1){
				  // left --> front
				  this.CubeColors[1][2][layerNumber] = this.CubeColors[2][2][layerNumber];
				  this.CubeColors[1][1][layerNumber] = this.CubeColors[2][1][layerNumber];
				  this.CubeColors[1][0][layerNumber] = this.CubeColors[2][0][layerNumber];				  
			      // back --> left
				  this.CubeColors[2][2][layerNumber] = this.CubeColors[3][0][layerNumber];
				  this.CubeColors[2][1][layerNumber] = this.CubeColors[3][1][layerNumber];
				  this.CubeColors[2][0][layerNumber] = this.CubeColors[3][2][layerNumber];	
				  // right --> back
				  this.CubeColors[3][2][layerNumber] = this.CubeColors[4][2][layerNumber];
				  this.CubeColors[3][1][layerNumber] = this.CubeColors[4][1][layerNumber];
				  this.CubeColors[3][0][layerNumber] = this.CubeColors[4][0][layerNumber];
				  // cache --> right;
				  this.CubeColors[4][2][layerNumber] = ColorCache[0];
				  this.CubeColors[4][1][layerNumber] = ColorCache[1];
				  this.CubeColors[4][0][layerNumber] = ColorCache[2];
				   if(layerNumber==2) {
				        // switch top colors +90
						ColorCache[0] = this.CubeColors[0][2][2]; // 0
						ColorCache[1] = this.CubeColors[0][2][1]; // 7			
						/*  face numbers
						   -------------
						   | 2 | 6 | 3 |
						   -------------
						   | 5 | 8 | 7 |
						   -------------
						   | 1 | 4 | 0 |
						   -------------  */						   
						// 1 --> 0
						this.CubeColors[0][2][2] = this.CubeColors[0][0][2];
						// 2 --> 1
						this.CubeColors[0][0][2] = this.CubeColors[0][0][0];
                        // 3 --> 2
						this.CubeColors[0][0][0] = this.CubeColors[0][2][0];
						// cache --> 3
						this.CubeColors[0][2][0] = ColorCache[0];
						// 4 --> 7
						this.CubeColors[0][2][1] = this.CubeColors[0][1][2];
						// 5 --> 4
						this.CubeColors[0][1][2] = this.CubeColors[0][0][1];
						// 6 --> 5
						this.CubeColors[0][0][1] = this.CubeColors[0][1][0];
						// cache --> 6
						this.CubeColors[0][1][0] = ColorCache[1];	
				   } else if(layerNumber==0) {
				        // switch down colors +90
						ColorCache[0] = this.CubeColors[5][2][2]; // 0
						ColorCache[1] = this.CubeColors[5][2][1]; // 7			
						/*  face numbers
						   -------------
						   | 2 | 6 | 3 |
						   -------------
						   | 5 | 8 | 7 |
						   -------------
						   | 1 | 4 | 0 |
						   -------------  */						   
						// 1 --> 0
						this.CubeColors[5][2][2] = this.CubeColors[5][0][2];
						// 2 --> 1
						this.CubeColors[5][0][2] = this.CubeColors[5][0][0];
                        // 3 --> 2
						this.CubeColors[5][0][0] = this.CubeColors[5][2][0];
						// cache --> 3
						this.CubeColors[5][2][0] = ColorCache[0];
						// 4 --> 7
						this.CubeColors[5][2][1] = this.CubeColors[5][1][2];
						// 5 --> 4
						this.CubeColors[5][1][2] = this.CubeColors[5][0][1];
						// 6 --> 5
						this.CubeColors[5][0][1] = this.CubeColors[5][1][0];
						// cache --> 6
						this.CubeColors[5][1][0] = ColorCache[1];				   
				   }				  
               }else {
				  // right --> front
				  this.CubeColors[1][2][layerNumber] = this.CubeColors[4][0][layerNumber];
				  this.CubeColors[1][1][layerNumber] = this.CubeColors[4][1][layerNumber];
				  this.CubeColors[1][0][layerNumber] = this.CubeColors[4][2][layerNumber];
				  // back --> right
				  this.CubeColors[4][0][layerNumber] = this.CubeColors[3][0][layerNumber];
				  this.CubeColors[4][1][layerNumber] = this.CubeColors[3][1][layerNumber];
				  this.CubeColors[4][2][layerNumber] = this.CubeColors[3][2][layerNumber];	
				  // left --> back
				  this.CubeColors[3][0][layerNumber] = this.CubeColors[2][2][layerNumber];
				  this.CubeColors[3][1][layerNumber] = this.CubeColors[2][1][layerNumber];
				  this.CubeColors[3][2][layerNumber] = this.CubeColors[2][0][layerNumber];	
				  // cache --> left
				  this.CubeColors[2][2][layerNumber] = ColorCache[2];
				  this.CubeColors[2][1][layerNumber] = ColorCache[1];
				  this.CubeColors[2][0][layerNumber] = ColorCache[0];
				   if(layerNumber==2) {
				        // switch top colors -90
						ColorCache[0] = this.CubeColors[0][2][2]; 
						ColorCache[1] = this.CubeColors[0][2][1];			
						/*  face numbers
						   -------------
						   | 2 | 6 | 3 |
						   -------------
						   | 5 | 8 | 7 |
						   -------------
						   | 1 | 4 | 0 |
						   -------------  */						   
						// 3 --> 0
						this.CubeColors[0][2][2] = this.CubeColors[0][2][0];
						// 2 --> 3
						this.CubeColors[0][2][0] = this.CubeColors[0][0][0];
                        // 1 --> 2
						this.CubeColors[0][0][0] = this.CubeColors[0][0][2];
						// cache --> 1
						this.CubeColors[0][0][2] = ColorCache[0];
						// 6 --> 7
						this.CubeColors[0][2][1] = this.CubeColors[0][1][0];
						// 5 --> 6
						this.CubeColors[0][1][0] = this.CubeColors[0][0][1];
						// 4 --> 5
						this.CubeColors[0][0][1] = this.CubeColors[0][1][2];
						// cache --> 4
						this.CubeColors[0][1][2] = ColorCache[1];
				   } else if(layerNumber==0) {
				        // switch down colors -90
						ColorCache[0] = this.CubeColors[5][2][2]; 
						ColorCache[1] = this.CubeColors[5][2][1];			
						/*  face numbers
						   -------------
						   | 2 | 6 | 3 |
						   -------------
						   | 5 | 8 | 7 |
						   -------------
						   | 1 | 4 | 0 |
						   -------------  */						   
						// 3 --> 0
						this.CubeColors[5][2][2] = this.CubeColors[5][2][0];
						// 2 --> 3
						this.CubeColors[5][2][0] = this.CubeColors[5][0][0];
                        // 1 --> 2
						this.CubeColors[5][0][0] = this.CubeColors[5][0][2];
						// cache --> 1
						this.CubeColors[5][0][2] = ColorCache[0];
						// 6 --> 7
						this.CubeColors[5][2][1] = this.CubeColors[5][1][0];
						// 5 --> 6
						this.CubeColors[5][1][0] = this.CubeColors[5][0][1];
						// 4 --> 5
						this.CubeColors[5][0][1] = this.CubeColors[5][1][2];
						// cache --> 4
						this.CubeColors[5][1][2] = ColorCache[1];
				   }
				}
		}
		if(axis=='z') {
				  // left face to cache
     			  ColorCache[0] = this.CubeColors[2][layerNumber][0];
				  ColorCache[1] = this.CubeColors[2][layerNumber][1];
				  ColorCache[2] = this.CubeColors[2][layerNumber][2];
			    if(direction==1){
				  // top --> left
				  this.CubeColors[2][layerNumber][0] = this.CubeColors[0][0][layerNumber];
				  this.CubeColors[2][layerNumber][1] = this.CubeColors[0][1][layerNumber];
				  this.CubeColors[2][layerNumber][2] = this.CubeColors[0][2][layerNumber];
                  // right --> top	
				  this.CubeColors[0][0][layerNumber] = this.CubeColors[4][layerNumber][2];
				  this.CubeColors[0][1][layerNumber] = this.CubeColors[4][layerNumber][1];
				  this.CubeColors[0][2][layerNumber] = this.CubeColors[4][layerNumber][0];	
				  // down --> right
				  this.CubeColors[4][layerNumber][0] = this.CubeColors[5][0][layerNumber];
				  this.CubeColors[4][layerNumber][1] = this.CubeColors[5][1][layerNumber];
				  this.CubeColors[4][layerNumber][2] = this.CubeColors[5][2][layerNumber];	
				  // cache --> down
				  this.CubeColors[5][0][layerNumber] = ColorCache[2];
				  this.CubeColors[5][1][layerNumber] = ColorCache[1];
				  this.CubeColors[5][2][layerNumber] = ColorCache[0];
				   if(layerNumber==2) {
				        // switch front colors +90
						ColorCache[0] = this.CubeColors[1][2][0]; // 0
						ColorCache[1] = this.CubeColors[1][2][1]; // 7	
						/*  face numbers
						   -------------
						   | 2 | 6 | 3 |
						   -------------
						   | 5 | 8 | 7 |
						   -------------
						   | 1 | 4 | 0 |
						   -------------  */						   
						// 1 --> 0
						this.CubeColors[1][2][0] = this.CubeColors[1][0][0];
						// 2 --> 1
						this.CubeColors[1][0][0] = this.CubeColors[1][0][2];
                        // 3 --> 2
						this.CubeColors[1][0][2] = this.CubeColors[1][2][2];
						// cache --> 3
						this.CubeColors[1][2][2] = ColorCache[0];
						// 4 --> 7
						this.CubeColors[1][2][1] = this.CubeColors[1][1][0];
						// 5 --> 4
						this.CubeColors[1][1][0] = this.CubeColors[1][0][1];
						// 6 --> 5
						this.CubeColors[1][0][1] = this.CubeColors[1][1][2];
						// cache --> 6
						this.CubeColors[1][1][2] = ColorCache[1];	
				   } else if(layerNumber==0) {
				        // switch back colors +90
						ColorCache[0] = this.CubeColors[3][0][0]; // 0
						ColorCache[1] = this.CubeColors[3][0][1]; // 7	
						/*  face numbers
						   -------------
						   | 2 | 6 | 3 |
						   -------------
						   | 5 | 8 | 7 |
						   -------------
						   | 1 | 4 | 0 |
						   -------------  */						   
						// 3 --> 0
						this.CubeColors[3][0][0] = this.CubeColors[3][0][2];
						// 2 --> 3
						this.CubeColors[3][0][2] = this.CubeColors[3][2][2];
                        // 1 --> 2
						this.CubeColors[3][2][2] = this.CubeColors[3][2][0];
						// cache --> 1
						this.CubeColors[3][2][0] = ColorCache[0];
						// 6 --> 7
						this.CubeColors[3][0][1] = this.CubeColors[3][1][2];
						// 5 --> 6
						this.CubeColors[3][1][2] = this.CubeColors[3][2][1];
						// 4 --> 5
						this.CubeColors[3][2][1] = this.CubeColors[3][1][0];
						// cache --> 4
						this.CubeColors[3][1][0] = ColorCache[1];						
				   }
				}else {
				  // down --> left 
				  this.CubeColors[2][layerNumber][0] = this.CubeColors[5][2][layerNumber];
				  this.CubeColors[2][layerNumber][1] = this.CubeColors[5][1][layerNumber];
				  this.CubeColors[2][layerNumber][2] = this.CubeColors[5][0][layerNumber];
                  //right --> down
				  this.CubeColors[5][0][layerNumber] = this.CubeColors[4][layerNumber][0];
				  this.CubeColors[5][1][layerNumber] = this.CubeColors[4][layerNumber][1];
				  this.CubeColors[5][2][layerNumber] = this.CubeColors[4][layerNumber][2];	
				  // top --> right	
				  this.CubeColors[4][layerNumber][0] = this.CubeColors[0][2][layerNumber];
				  this.CubeColors[4][layerNumber][1] = this.CubeColors[0][1][layerNumber];
				  this.CubeColors[4][layerNumber][2] = this.CubeColors[0][0][layerNumber];	
				  // cache --> top
				  this.CubeColors[0][2][layerNumber] = ColorCache[2];  
				  this.CubeColors[0][1][layerNumber] = ColorCache[1];
				  this.CubeColors[0][0][layerNumber] = ColorCache[0];	
				   if(layerNumber==2) {
				        // switch front colors -90
						ColorCache[0] = this.CubeColors[1][2][0]; // 0
						ColorCache[1] = this.CubeColors[1][2][1]; // 7	
						/*  face numbers
						   -------------
						   | 2 | 6 | 3 |
						   -------------
						   | 5 | 8 | 7 |
						   -------------
						   | 1 | 4 | 0 |
						   -------------  */						   
						// 3 --> 0
						this.CubeColors[1][2][0] = this.CubeColors[1][2][2];
						// 2 --> 3
						this.CubeColors[1][2][2] = this.CubeColors[1][0][2];
                        // 1 --> 2
						this.CubeColors[1][0][2] = this.CubeColors[1][0][0];
						// cache --> 1
						this.CubeColors[1][0][0] = ColorCache[0];
						// 6 --> 7
						this.CubeColors[1][2][1] = this.CubeColors[1][1][2];
						// 5 --> 6
						this.CubeColors[1][1][2] = this.CubeColors[1][0][1];
						// 4 --> 5
						this.CubeColors[1][0][1] = this.CubeColors[1][1][0];
						// cache --> 4
						this.CubeColors[1][1][0] = ColorCache[1];						
				   } else if(layerNumber==0) {
				        // switch back colors -90
						ColorCache[0] = this.CubeColors[3][0][0]; // 0
						ColorCache[1] = this.CubeColors[3][0][1]; // 7	
						/*  face numbers
						   -------------
						   | 2 | 6 | 3 |
						   -------------
						   | 5 | 8 | 7 |
						   -------------
						   | 1 | 4 | 0 |
						   -------------  */						   
						// 1 --> 0
						this.CubeColors[3][0][0] = this.CubeColors[3][2][0];
						// 2 --> 1
						this.CubeColors[3][2][0] = this.CubeColors[3][2][2];
                        // 3 --> 2
						this.CubeColors[3][2][2] = this.CubeColors[3][0][2];
						// cache --> 3
						this.CubeColors[3][0][2] = ColorCache[0];
						// 4 --> 7
						this.CubeColors[3][0][1] = this.CubeColors[3][1][0];
						// 5 --> 4
						this.CubeColors[3][1][0] = this.CubeColors[3][2][1];
						// 6 --> 5
						this.CubeColors[3][2][1] = this.CubeColors[3][1][2];
						// cache --> 6
						this.CubeColors[3][1][2] = ColorCache[1];						
				   }
				}
		}
	};	
	this.getColorArray = function() {
		return this.CubeColors;
	};
}
 