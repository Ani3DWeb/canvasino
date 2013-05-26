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
    this.visible = true;
    width /= 2;
    this.triangleVerticesIndicesArray = [
        4, 5, 1, 4, 1, 0, // T
        0, 1, 2, 0, 2, 3, // F
        4, 0, 3, 4, 3, 7, // L 
        5, 4, 7, 5, 7, 6, // B 
        1, 5, 6, 1, 6, 2, // R
        3, 2, 6, 3, 6, 7   // D
    ];
    this.triangleVerticesPostionArray = [
        width, width, width,
        -width, width, width,
        -width, -width, width,
        width, -width, width,
        width, width, -width,
        -width, width, -width,
        -width, -width, -width,
        width, -width, -width
    ];

    this.triangleVerticesColorArray = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0
    ];
    //Positionen
    this.triangleVertexPositionBuffer = $gl.createBuffer();
    $gl.bindBuffer($gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
    $gl.bufferData($gl.ARRAY_BUFFER, new Float32Array(this.triangleVerticesPostionArray), $gl.STATIC_DRAW);
    this.triangleVertexPositionBuffer.itemSize = 3;
    this.triangleVertexPositionBuffer.numItems = 8;

    // Farben
    this.triangleVertexColorBuffer = $gl.createBuffer();
    $gl.bindBuffer($gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
    $gl.bufferData($gl.ARRAY_BUFFER, new Float32Array(this.triangleVerticesColorArray), $gl.STATIC_DRAW);
    this.triangleVertexColorBuffer.itemSize = 4;
    this.triangleVertexColorBuffer.numItems = 8;



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

    this.translate = function(v) {
        var m = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
        this.mvMatrix = this.mvMatrix.x(m);
    };

    this.scale = function() {
        //TODO
    };

    this.texturize = function() {
        //TODO
    };

    this.draw = function() {
        if (this.visible) {
            this.propagateMatrixUniforms();
            $gl.bindBuffer($gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
            $gl.vertexAttribPointer($shaderProgram.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, $gl.FLOAT, false, 0, 0);

            $gl.bindBuffer($gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
            $gl.vertexAttribPointer($shaderProgram.vertexColorAttribute, this.triangleVertexColorBuffer.itemSize, $gl.FLOAT, false, 0, 0);

            $gl.bindBuffer($gl.ELEMENT_ARRAY_BUFFER, this.triangleVertexIndexBuffer);
            $gl.drawElements($gl.TRIANGLES, this.triangleVertexIndexBuffer.numItems, $gl.UNSIGNED_SHORT, 0);
        }
    }

    this.propagateMatrixUniforms = function() {
        $gl.uniformMatrix4fv($shaderProgram.mvMatrixUniform, false, new Float32Array(this.mvMatrix.flatten()));
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

    this.changeColors = function(newColorPositions) {
        this.colorPositions = newColorPositions;
    }

    this.save = function() {
        this.mvPushMatrix(this.mvMatrix);
    };
    this.revert = function() {
        this.mvMatrix = this.mvPopMatrix();
    }
    this.save();
}
