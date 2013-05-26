/*
 * WebGL initialisieren
 * Shader initialisieren
 * Game initialisieren: Game.js für jedes Spiel individuell....
 * game.drawScene()
 */
var gl;
var shaderProgram;
var game;

function initGL(canvas)
{
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    } catch (e) {
    }
    if (!gl)
    {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function main()
{
    var canvas = document.getElementById("webGLCanvas");
    initGL(canvas);
    initShaders();
    initGame();

    setInterval(game.drawScene, 50);
}


function initShaders()
            {
                var fragmentShader = getShader(gl, "shader-fs");
                var vertexShader = getShader(gl, "shader-vs");

                shaderProgram = gl.createProgram();
                gl.attachShader(shaderProgram, vertexShader);
                gl.attachShader(shaderProgram, fragmentShader);

                gl.linkProgram(shaderProgram);

                if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
                {
                    alert("Could not initialise shaders");
                }

                gl.useProgram(shaderProgram);
                shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
                shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
                gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
                gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

                shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

            }

function getShader(gl, id)
{
    var shader;

    var shaderScript = document.getElementById(id);
    if (!shaderScript)
        return null;


    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3)
            str += k.textContent;
        k = k.nextSibling;
    }

    if (shaderScript.type == "x-shader/x-fragment")
    {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


function initGame() {
    game = new RubikGame(gl, shaderProgram);
}

function MakePerspective(FOV, AspectRatio, Closest, Farest) {
    var YLimit = Closest * Math.tan(FOV * Math.PI / 360);
    var A = -(Farest + Closest) / (Farest - Closest);
    var B = -2 * Farest * Closest / (Farest - Closest);
    var C = (2 * Closest) / ((YLimit * AspectRatio) * 2);
    var D = (2 * Closest) / (YLimit * 2);
    return [
        C, 0, 0, 0,
        0, D, 0, 0,
        0, 0, A, -1,
        0, 0, B, 0
    ];
}
function MakeTransform(Object) {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -6, 1
    ];
}


//Steuerung initialisieren
function initControl(key) {

}