/*
 * Eigentliches Spiel: 
 *      
 * Logik für SlotMachine:
 *      keyPressed-> StartMachine
 *      Random, Geschwindigkeit, schneller/Langsamer werden
 *      
 *      
 */
function SlotGame($gl, $shaderProgram) {
    this.perspectiveMatrix = makePerspective(45, 640.0 / 480.0, 0.1, 100.0);
    this.rubik = new RubikCube($gl, $shaderProgram);
    var self = this;
    
    this.drawScene = function() {
        //Canvas leeren
        $gl.clear($gl.COLOR_BUFFER_BIT | $gl.DEPTH_BUFFER_BIT);
        $gl.enable($gl.DEPTH_TEST);
        $gl.depthFunc($gl.LEQUAL);

        //TODO: Perspektive einstellen
        this.perspectiveMatrix = MakePerspective(45, 1.0 / 1.0, -15.0, 100.0);
        var pUniform = $gl.getUniformLocation($shaderProgram, "uPMatrix");
        $gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.perspectiveMatrix));

        //Zeichne Rubik
        self.rubik.draw();
    };


    this.keyPressed = function(key) {
        //totate Layer von rubik aufrufen

    };
}




