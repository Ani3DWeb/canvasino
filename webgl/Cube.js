/*
 * Erzeugt einen Würfel
 * Parameter: WebGL-Instanz, Anzuwendendes Shader-Programm, Kantenlänge
 * 
 * Beispiel:
 * 
 * cube1 = new Cube(gl, shaderProgram, 0.5);
 * cube1.translate([0.5, -0.5, 0]);
 * 
 * Damit der Cube auch gezeichnet wird, muss in der drawScene()-Methode
 * 
 * cube1.draw();
 * 
 * aufgerufen werden.
 * 
 * um den Cube temporär zu verstecken:
 * 
 * cube1.visible=false;
 * 
 * 
 */
function Cube($gl, $shaderProgram, width) {
    this.colorPositions = []; // top, front, left, back, right, down
    this.mvMatrix = Matrix.I(4);
	this.CenterRotationMatrix = Matrix.I(4);
    this.visible = true;
    width /= 2;
    this.triangleVerticesIndicesArray = [
			0,  1,  2,      0,  2,  3,    // front
			4,  5,  6,      4,  6,  7,    // back
			8,  9,  10,     8,  10, 11,   // top
			12, 13, 14,     12, 14, 15,   // bottom
			16, 17, 18,     16, 18, 19,   // right
			20, 21, 22,     20, 22, 23    // left
    ];
    this.triangleVerticesPostionArray = [
			// Front face
			-width, -width,  width,
			 width, -width,  width,
			 width,  width,  width,
			-width,  width,  width,
			
			// Back face
			-width, -width, -width,
			-width,  width, -width,
			 width,  width, -width,
			 width, -width, -width,
			
			// Top face
			-width,  width, -width,
			-width,  width,  width,
			 width,  width,  width,
			 width,  width, -width,
			
			// Bottom face
			-width, -width, -width,
			 width, -width, -width,
			 width, -width,  width,
			-width, -width,  width,
			
			// Right face
			 width, -width, -width,
			 width,  width, -width,
			 width,  width,  width,
			 width, -width,  width,
			
			// Left face
			-width, -width, -width,
			-width, -width,  width,
			-width,  width,  width,
			-width,  width, -width
    ];

  /*  this.triangleVerticesColorArray = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0
    ];*/
    //Positionen
    this.triangleVertexPositionBuffer = $gl.createBuffer();
    $gl.bindBuffer($gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
    $gl.bufferData($gl.ARRAY_BUFFER, new Float32Array(this.triangleVerticesPostionArray), $gl.STATIC_DRAW);
    this.triangleVertexPositionBuffer.itemSize = 3;
    this.triangleVertexPositionBuffer.numItems = 8;

  /*  // Farben
    this.triangleVertexColorBuffer = $gl.createBuffer();
    $gl.bindBuffer($gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
    $gl.bufferData($gl.ARRAY_BUFFER, new Float32Array(this.triangleVerticesColorArray), $gl.STATIC_DRAW);
    this.triangleVertexColorBuffer.itemSize = 4;
    this.triangleVertexColorBuffer.numItems = 8;*/

    //Indizes
    this.triangleVertexIndexBuffer = $gl.createBuffer();
    $gl.bindBuffer($gl.ELEMENT_ARRAY_BUFFER, this.triangleVertexIndexBuffer);

    $gl.bufferData($gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triangleVerticesIndicesArray), $gl.STATIC_DRAW);
    this.triangleVertexIndexBuffer.itemSize = 1;
    this.triangleVertexIndexBuffer.numItems = 36;

    this.rotate = function(ang, v) {
        var arad = ang * Math.PI / 180.0;
        var m = Matrix.Rotation(arad, $V([v[0], v[1], v[2]])).ensure4x4();
        this.mvMatrix = this.mvMatrix.x(m);
    };
	
	this.rotateCenter = function(ang, v) {
		this.mvPushMatrixRotation();	
        var arad = ang * Math.PI / 180.0;
	    this.CenterRotationMatrix = Matrix.Translation($V([0, 0, 0])).ensure4x4();		
        var m = Matrix.Rotation(arad, $V([v[0], v[1], v[2]])).ensure4x4();
		this.CenterRotationMatrix = this.CenterRotationMatrix.x(m); 
	    this.mvPushMatrixRotation();		
	}
    this.translate = function(v) {
        var m = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
        this.mvMatrix = this.mvMatrix.x(m);
    };

    this.scale = function() {
        //TODO
    };

    this.texturize = function() {
		  // Map the texture onto the cube's faces.
		  var textureCoordAttribute;
		  cubeVerticesTextureCoordBuffer = gl.createBuffer();
		  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
		  
		  var textureCoordinates = [
			// Front
			0.0,  0.0,
			1.0,  0.0,
			1.0,  1.0,
			0.0,  1.0,
			// Back
			0.0,  0.0,
			1.0,  0.0,
			1.0,  1.0,
			0.0,  1.0,
			// Top
			0.0,  0.0,
			1.0,  0.0,
			1.0,  1.0,
			0.0,  1.0,
			// Bottom
			0.0,  0.0,
			1.0,  0.0,
			1.0,  1.0,
			0.0,  1.0,
			// Right
			0.0,  0.0,
			1.0,  0.0,
			1.0,  1.0,
			0.0,  1.0,
			// Left
			0.0,  0.0,
			1.0,  0.0,
			1.0,  1.0,
			0.0,  1.0
		  ];

		  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
						gl.STATIC_DRAW);
		  // Set the texture coordinates attribute for the vertices.
		  
		  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
		  gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
		  // Specify the texture to map onto the faces.
		  // top, front, left, back, right, down	
				  // Draw front face
					gl.bindTexture(gl.TEXTURE_2D, this.colorPositions[3]);
					gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

					// Draw  back face 
					gl.bindTexture(gl.TEXTURE_2D, this.colorPositions[1]);
					gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 12);

					// Draw top face 
					gl.bindTexture(gl.TEXTURE_2D, this.colorPositions[0]);
					gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 24);

					// Draw down face 
					gl.bindTexture(gl.TEXTURE_2D, this.colorPositions[5]);
					gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 36);

					// Draw right face
					gl.bindTexture(gl.TEXTURE_2D, this.colorPositions[4]);
					gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 48);

					// Draw left face 
					gl.bindTexture(gl.TEXTURE_2D, this.colorPositions[2]);
					gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 60);
					gl.uniform1i(shaderProgram.samplerUniform, 0);			
    };

    this.draw = function() {
        if (this.visible) {
            this.propagateMatrixUniforms();
            $gl.bindBuffer($gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
            $gl.vertexAttribPointer($shaderProgram.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, $gl.FLOAT, false, 0, 0);

        /*    $gl.bindBuffer($gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
            $gl.vertexAttribPointer($shaderProgram.vertexColorAttribute, this.triangleVertexColorBuffer.itemSize, $gl.FLOAT, false, 0, 0);
*/
            $gl.bindBuffer($gl.ELEMENT_ARRAY_BUFFER, this.triangleVertexIndexBuffer);
            $gl.drawElements($gl.TRIANGLES, this.triangleVertexIndexBuffer.numItems, $gl.UNSIGNED_SHORT, 0);
			this.texturize();
        }
    }

    this.propagateMatrixUniforms = function() {
        $gl.uniformMatrix4fv($shaderProgram.mvMatrixUniform, false, new Float32Array(this.mvMatrix.flatten()));
        $gl.uniformMatrix4fv($shaderProgram.rotationMatrixUniform, false, new Float32Array(this.CenterRotationMatrix.flatten()));		
    }
    this.mvMatrixStack = [];

    this.mvPushMatrix = function(m) {
        if (m) {
            this.mvMatrixStack.push(m.dup());
            this.mvMatrix = m.dup();
        } else {
            this.mvMatrixStack.push(this.mvMatrix.dup());
        }
    }

    this.mvPopMatrix = function() {
        if (!this.mvMatrixStack.length) {
            throw("Can't pop from an empty matrix stack.");
        }

        this.mvMatrix = this.mvMatrixStack.pop();
        return this.mvMatrix;
    }
	
	 this.mvMatrixStackRotation = [];
	
	this.mvPushMatrixRotation = function() {
			 this.mvMatrixStackRotation.push(this.CenterRotationMatrix);	
	};
		
	this.mvPopMatrixRotation = function() {
			if (this.mvMatrixStackRotation.length == 0) {
				throw "Invalid popMatrix!";
			}
			return this.CenterRotationMatrix = this.mvMatrixStackRotation.pop();
	};	

    this.changeColors = function(newColorPositions) {	
        this.colorPositions = newColorPositions;
    };
	
    this.save = function() {
        this.mvPushMatrix(this.mvMatrix);
    };
    this.revert = function() {
        this.mvMatrix = this.mvPopMatrix();
    };
    this.save();
}
