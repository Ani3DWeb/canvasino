  
var Cube = function ($gl,$shaderProgram,width){

 var cubeVerticesPositionBuffer;
 var cubeVerticesTextureCoordBuffer;
 var cubeVerticesIndexBuffer;
 var cubeVertexIndices;
 var cubeVerticesNormalBuffer;
 var textureInitPositions = [];
 this.colorLogic = [];
 this.selectedOffset=0;
 this.mvMatrixStackCoordinate = [];
 this.mvMatrixStackRotation = [];
 
 this.CubeCoordMatrix = Matrix.I(4) ;
 this.CubeRotationMatrix = Matrix.I(4);
 var cubenumber = 0;
 
 var CubeCoordinaten = Matrix.I(4);

		  width = width / 2;
		  this.CubeCoordMatrix = Matrix.Translation($V([0, 0, 0])).ensure4x4();
		  this.CubeRotationMatrix = Matrix.Translation($V([0, 0, 0])).ensure4x4();
		  // Create a buffer for the cube's vertices.
		  
		  cubeVerticesPositionBuffer = $gl.createBuffer();
		  
		  // Select the cubeVerticesBuffer as the one to apply vertex
		  // operations to from here out.
		  
		  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesPositionBuffer);
		  
		  // Now create an array of vertices for the cube.
		  
		  var vertices = [
			// Front face
			-width, width,  width,
			 width, width,  width,
			 width, -width,  width,
			-width, -width,  width,
			
			// Back face
			-width, -width, -width,
			-width,  width, -width,
			 width,  width, -width,
			 width, -width, -width,
			
			// Top face
			-width,  width, width,
			-width,  width, -width,
			width,  width,  -width,
			width,  width, width,
			
			// Bottom face
			-width, -width, -width,
			 width, -width, -width,
			 width, -width,  width,
			-width, -width,  width,
			
			// Right face
			 width, width, -width,
			 width, -width, -width,
			 width, -width,  width,
			 width, width,  width,
			
			// Left face
			-width, width, -width,
			-width, width,  width,
			-width, -width,  width,
			-width, -width, -width
		  ];
		  
		  // Now pass the list of vertices into WebGL to build the shape. We
		  // do this by creating a Float32Array from the JavaScript array,
		  // then use it to fill the current vertex buffer.
		  
		  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		  gl.vertexAttribPointer($shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		  // Build the element array buffer; this specifies the indices
		  // into the vertex array for each face's vertices.
		  
		  cubeVerticesIndexBuffer = gl.createBuffer();
		  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
		  
		  // This array defines each face as two triangles, using the
		  // indices into the vertex array to specify each triangle's
		  // position.
		  
		   cubeVertexIndices = [
			0,  1,  2,      0,  2,  3,    // front
			4,  5,  6,      4,  6,  7,    // back
			8,  9,  10,     8,  10, 11,   // top
			12, 13, 14,     12, 14, 15,   // bottom
			16, 17, 18,     16, 18, 19,   // right
			20, 21, 22,     20, 22, 23    // left
		  ];
		  
		  // Now send the element array to GL
		  
		  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);	
		  gl.vertexAttribPointer($shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		  
		  cubeVerticesNormalBuffer = gl.createBuffer();
		  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);
		  
		  var vertexNormals = [
				// Front
				 0.0,  0.0,  1.0,
				 0.0,  0.0,  1.0,
				 0.0,  0.0,  1.0,
				 0.0,  0.0,  1.0,
				
				// Back
				 0.0,  0.0, -1.0,
				 0.0,  0.0, -1.0,
				 0.0,  0.0, -1.0,
				 0.0,  0.0, -1.0,
				
				// Top
				 0.0,  1.0,  0.0,
				 0.0,  1.0,  0.0,
				 0.0,  1.0,  0.0,
				 0.0,  1.0,  0.0,
				
				// Bottom
				 0.0, -1.0,  0.0,
				 0.0, -1.0,  0.0,
				 0.0, -1.0,  0.0,
				 0.0, -1.0,  0.0,
				
				// Right
				 1.0,  0.0,  0.0,
				 1.0,  0.0,  0.0,
				 1.0,  0.0,  0.0,
				 1.0,  0.0,  0.0,
				
				// Left
				-1.0,  0.0,  0.0,
				-1.0,  0.0,  0.0,
				-1.0,  0.0,  0.0,
				-1.0,  0.0,  0.0
			  ];
			  
			  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
			  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);
			  gl.vertexAttribPointer($shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);		  
  
		//this.setTexture = function(front, back, top, bottom, right, left)
		this.texturize = function()
		{
		  // Map the texture onto the cube's faces.
		  
		  cubeVerticesTextureCoordBuffer = gl.createBuffer();
		  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
		  
		  var textureCoordinates = [
          // Front face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,

          // Back face
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          // Top face
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,

          // Bottom face
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,

          // Right face
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          // Left face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0
		  ];

		  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
						gl.STATIC_DRAW);
		  // Set the texture coordinates attribute for the vertices.
		  
		  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
		  gl.vertexAttribPointer($shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
		  // Specify the texture to map onto the faces.
		  // top, front, left, back, right, down	

					// Draw top face 
					gl.bindTexture(gl.TEXTURE_2D, textureInitPositions[0+ this.selectedOffset]);
					gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 24);		  
		  
				  // Draw front face
					gl.bindTexture(gl.TEXTURE_2D, textureInitPositions[1+ this.selectedOffset]);
					gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);					

					// Draw left face 
					gl.bindTexture(gl.TEXTURE_2D, textureInitPositions[2+ this.selectedOffset]);
					gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 60);

					// Draw  back face 
					gl.bindTexture(gl.TEXTURE_2D, textureInitPositions[3+ this.selectedOffset]);
					gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 12);					

					// Draw right face
					gl.bindTexture(gl.TEXTURE_2D, textureInitPositions[4+ this.selectedOffset]);
					gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 48);

					// Draw down face 
					gl.bindTexture(gl.TEXTURE_2D, textureInitPositions[5+ this.selectedOffset]);
					gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 36);

					gl.uniform1i($shaderProgram.samplerUniform, 0);				
		};	
		
		this.draw = function(){
		 // Draw the cube push object into shaders 
			this.propagateMatrixUniforms();
			this.texturize();
		};
		this.translate = function(v){
			  var m = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
			  this.CubeCoordMatrix = this.CubeCoordMatrix.x(m);
		};
		
		this.rotate = function(ang,v) {
				var arad = ang * Math.PI / 180.0;
				var m = Matrix.Rotation(arad, $V([v[0], v[1], v[2]])).ensure4x4();
				this.CubeCoordMatrix = this.CubeCoordMatrix.x(m);
		};
		
		this.rotateOrigin = function(ang,v) {
				var arad = ang * Math.PI / 180.0;
				var m = Matrix.Rotation(arad, $V([v[0], v[1], v[2]])).ensure4x4();
				this.CubeRotationMatrix = this.CubeRotationMatrix.x(m);
		};
		
		this.scale = function(){
        
		};
		
		this.changeLogicColors =  function(newColorLogic) {	
			colorLogic = newColorLogic;
		};
		
		this.initTexture =  function(newtextureInitPositions) {
			textureInitPositions = newtextureInitPositions;
		};
		

		this.getColors = function() {
			return colorLogic;
		};
		this.setCubeNumber = function(num) {
			cubenumber = num;
		};
		this.getCubeNumber = function() {
			return cubenumber;
		};	
                
                this.rotationMode = function(){
                    this.selectedOffset=12;
                };
                
                this.select = function(){
                    this.selectedOffset=6;
                };
                this.unselect = function(){
                    this.selectedOffset=0;
                };
		this.propagateMatrixUniforms = function()
		{
			  var pUniform = gl.getUniformLocation($shaderProgram, "uPMatrix");
			  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
			  
			  var coordinatesMatrixUniform = gl.getUniformLocation($shaderProgram, "uCoordinates");
			  gl.uniformMatrix4fv(coordinatesMatrixUniform, false, new Float32Array(this.CubeCoordMatrix.flatten()));
			  
			  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
			  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
			  
			  var rotationMatrixUniform = gl.getUniformLocation($shaderProgram, "uRotation");
			  gl.uniformMatrix4fv(rotationMatrixUniform, false, new Float32Array(this.CubeRotationMatrix.flatten()));
			  
			var normalMatrix = mvMatrix.inverse();
			//normalMatrix = mvMatrix.inverse();
			normalMatrix = normalMatrix.transpose();
			var nUniform = $gl.getUniformLocation($shaderProgram, "uNormalMatrix");
			gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
			  
		};
		
		this.mvPushMatrixCoordinate = function() {
			 this.mvMatrixStackCoordinate.push(this.CubeCoordMatrix);	
		};
		
		this.mvPopMatrixCoordinate = function() {
			if (this.mvMatrixStackCoordinate.length === 0) {
				throw "Invalid popMatrix!";
			}
			return this.CubeCoordMatrix = this.mvMatrixStackCoordinate.pop();
		};	
		this.save = function() {
			this.mvPushMatrixCoordinate(this.CubeCoordMatrix);
		};
		this.revert = function() {
			this.CubeCoordMatrix = this.mvPopMatrixCoordinate();
		};
		this.save();		
};