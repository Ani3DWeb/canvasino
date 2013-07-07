/*
 * WebGL initialisieren
 * Shader initialisieren
 * Game initialisieren: Game.js für jedes Spiel individuell....
 * game.drawScene()
 */
var gl;
var shaderProgram;
var game;
var canvasWidth;
var canvasHeight;
var canvas;

function initGL(canvas)
{
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);

        //    gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        canvasWidth = canvas.width;
        canvasHeight = canvas.height;


    } catch (e) {
    }
    if (!gl)
    {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function main()
{
    console.log("WEBGL wird gestartet...");
    canvas = document.getElementById("webGLCanvas");

    var randomnumber = Math.floor((Math.random() * 4) + 1);

    var backgroundimage = document.getElementById("backimage");
    backgroundimage.width = canvas.width;
    backgroundimage.height = canvas.height;
    backgroundimage.src = "images/webgl/background/" + randomnumber + ".png";

    initGL(canvas);
    console.log("Canvas initialisiert.");
    initShaders();
    console.log("Shader initialisiert.");
    initGame();
    initGameboyKeys();
    document.onkeydown = keyPressed;
    setInterval(game.drawScene, 50);
}


function initShaders()
{
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    // Create the shader program

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uniSampler");
    shaderProgram.rotationMatrixUniform = gl.getUniformLocation(shaderProgram, "uRotation");
    shaderProgram.coordinatesMatrixUniform = gl.getUniformLocation(shaderProgram, "uCoordinates");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

    shaderProgram.materialShininessUniform = gl.getUniformLocation(shaderProgram, "uMaterialShininess");
    shaderProgram.showSpecularHighlightsUniform = gl.getUniformLocation(shaderProgram, "uShowSpecularHighlights");

    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
    shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
    shaderProgram.pointLightingSpecularColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingSpecularColor");
    shaderProgram.pointLightingDiffuseColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingDiffuseColor");
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

    if (gamenumber == 1) {
        console.log("Lade Spiel #" + gamenumber);
        game = new SlotGame(gl, shaderProgram);
        console.log("Lade Spiel #" + gamenumber);
    } else if (gamenumber == 2) {
        game = new RubikGame(gl, shaderProgram);
        console.log("Lade Spiel #" + gamenumber);
    }
    // game = new RubikGame(gl, shaderProgram);
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
function initGameboyKeys() {

    $('#left, #right, #top, #bottom, #buttonA, #buttonB').click(
            function() {
                game.keyPressed(parseInt($(this).attr('data-key-id')));
            });
}

function keyPressed(event) {
    var keyCode = 0;
    if (!event)
        event = window.event;
    if (event.which) {
        keyCode = event.which;
    } else if (event.keyCode) {
        keyCode = event.keyCode;
    }
    game.keyPressed(keyCode);
    event.preventDefault();
}

//
// initTextures
//
var textureArray = new Array();
function initTextures(texturenames)
{
    var length = texturenames.length;
    for (var i = 0; i <= (length - 1); i++)
    {
        TextureLoader(i, texturenames);
    }
}

function TextureLoader(anz, texturenames) {
    // var anz = textureArray.length;
    textureArray[anz] = gl.createTexture();
    textureArray[anz].image = new Image();
    textureArray[anz].image.onload = function()
    {
        gl.bindTexture(gl.TEXTURE_2D, textureArray[anz]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureArray[anz].image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    textureArray[anz].image.src = texturenames[anz];
}