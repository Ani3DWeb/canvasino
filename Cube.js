function Cube($gl, width) {
	var colorPositions = []; // top, front, left, back, right, down

    width /= 2;
    var triangleVerticesIndicesArray = [
        4, 5, 1, 4, 1, 0, // T
        0, 1, 2, 0, 2, 3, // F
        4, 0, 3, 4, 3, 7, // L 
        5, 4, 7, 5, 7, 6, // B 
        1, 5, 6, 1, 6, 2, // R
        3, 2, 6, 3, 6, 7   // D
    ];
    var triangleVerticesPostionArray = [
        width, width, width,
        -width, width, width,
        -width, -width, width,
        width, -width, width,
        width, width, -width,
        -width, width, -width,
        -width, -width, -width,
        width, -width, -width
    ];
    var triangleVertexPositionBuffer = gl.createBuffer();
    $gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerticesPostionArray), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 8;
    var triangleVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleVertexIndexBuffer);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleVerticesIndicesArray), gl.STATIC_DRAW);
    triangleVertexIndexBuffer.itemSize = 1;
    triangleVertexIndexBuffer.numItems = 36;
    
    this.rotate = function(ang, v){
	var arad = ang * Math.PI / 180.0;
	//TODO: mvMatrix = Matrix.Rotation(arad, $V([v[0], v[1], v[2]])).ensure4x4();
    };
    
    this.translate = function(x,y,z){
        
    };
    
    this.scale = function(){
        
    };
    
    this.texturize = function(){
        
    };
    
    
    this.propagateMatrixUniforms= function() {
	$gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, new Float32Array(mvMatrix.flatten()));
    }
   var mvMatrixStack = [];
 
function mvPushMatrix(m) {
  if (m) {
    mvMatrixStack.push(m.dup());
    mvMatrix = m.dup();
  } else {
    mvMatrixStack.push(mvMatrix.dup());
  }
}
 
function mvPopMatrix() {
  if (!mvMatrixStack.length) {
    throw("Can't pop from an empty matrix stack.");
  }
   
  mvMatrix = mvMatrixStack.pop();
  return mvMatrix;
}

	this.changeColors =  function(newColorPositions) {
		colorPositions = newColorPositions;
	}
}
