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
           //     shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
				
				textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
				gl.enableVertexAttribArray(textureCoordAttribute);
				
                gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
              //  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
				
				//samplerUniform = gl.getUniformLocation(shaderProgram, "uniSampler");

                shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
				shaderProgram.rotationMatrixUniform = gl.getUniformLocation(shaderProgram, "uRotation");

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

//
// initTextures
//
var  textureArray = new Array();
function initTextures(texturenames)
{
	for (var i = 0; i<=6 ;i++)
	{
		TextureLoader(i,texturenames);
	}
}

function TextureLoader(anz,texturenames) {
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
  textureArray[anz].image.src = texturenames[anz];
}