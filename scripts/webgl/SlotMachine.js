var cubeXOffset;
var cubeYOffset;
var cubeZOffset;
var cubeRotation;
var grad;
var circle;
var wheel;
var lastCubeUpdateTime = 0;
var randomFront;			//Front pro Rad für Drehung
var randomCircular;			//Umdrehungen pro Rad für Drehung
var countReady=0;			//Anzahl der stehenden Räder
var countReadyFirst = true;	//erstes mal 3 Räder stopp nach Drehung
var rotationNr=0;			//Anzahl der bereits ausgeführten Umdrehungen
var winner = false;			//Gewinner ja, nein
var start = true;			//erster Aufruf der Slotmachine

function SlotMachine($gl) {
    //TODO:
    wheel = new Array (3);
	cubeXOffset = new Array (3);
	cubeYOffset = new Array (3);
	cubeZOffset = new Array (3);
	cubeRotation = new Array (3);
	grad = new Array (3);
	circle = new Array (3);
	randomFront = new Array (3);
	randomCircular = new Array (3);
	rotationNr = new Array (3);
	
    for (var w=0; w <= 3; w++) {
        wheel[w]=new Array (8);
		cubeXOffset[w] = new Array (8);
		cubeYOffset[w] = new Array (8);
		cubeZOffset[w] = new Array (8);
		cubeRotation[w] = new Array (8);
		grad[w] = new Array (8);
		circle[w] = new Array (8);
		randomFront[w] = 0;
		randomCircular[w] = 0;
		rotationNr[w] = 0;
		
        for (var c=0; c <= 8; c++) {
            wheel[w][c] = new Cube(gl, shaderProgram, 0.25);
			//wheel[w][c].changeLogicColors(initColors(w,c))
			wheel[w][c].initTexture(initCubeTextures(w,c));
			cubeXOffset[w][c] = -0.33 + w/3;
			cubeYOffset[w][c] = 0.0;
			cubeZOffset[w][c] = 0.0;
			cubeRotation[w][c] = 0.0;
			grad[w][c] = (360/8)*c;
			circle[w][c] = (2*Math.PI/8)*(c-1)+4*Math.PI;
			randomFront[0] = 1;
			randomFront[1] = 1;
			randomFront[2] = 1;
        }
    }
	
	lastCubeUpdateTime = (new Date).getTime();

    //rotateLayer(x,1,90);
    //rotateLayer(z,3,-90);
    this.rotateWheel = function(wheelNumber,delta) {
		//
		//console.log(randomCircular[wheelNumber] + " " + grad[wheelNumber][randomFront[wheelNumber]]);
		if (rotationNr[wheelNumber]==randomCircular[wheelNumber])
		{
			$SlotMachine.stopRotation(wheelNumber);
		}
		else{
			//console.log(circle[wheelNumber][randomFront[wheelNumber]]+ " "+rotationNr[wheelNumber] + " " +randomCircular[wheelNumber]);
			for (var c=0; c <= 8; c++) {
					
					
					circle[wheelNumber][c] -= delta / 800.0*(randomCircular[wheelNumber]+0.5);
					grad[wheelNumber][c] = -(360/(2 * Math.PI))*circle[wheelNumber][c];					
					cubeRotation[wheelNumber][c] = grad[wheelNumber][c];
					cubeYOffset[wheelNumber][c] = yIncValue* Math.sin(circle[wheelNumber][c]);
					cubeZOffset[wheelNumber][c] = zIncValue* Math.cos(circle[wheelNumber][c]);
					
					if (circle[wheelNumber][c]<2 * Math.PI){
							circle[wheelNumber][c] +=2 * Math.PI;
							if (c == randomFront[wheelNumber])
								rotationNr[wheelNumber]++;
						}
					
					wheel[wheelNumber][c].save();
					
					wheel[wheelNumber][c].translate([cubeXOffset[wheelNumber][c], cubeYOffset[wheelNumber][c], cubeZOffset[wheelNumber][c]]);	
					wheel[wheelNumber][c].rotate(cubeRotation[wheelNumber][c], [1, 0, 0]);
					wheel[wheelNumber][c].draw();
					
					wheel[wheelNumber][c].revert();

					//console.log(cubeXOffset[wheelNumber][c] + " " +cubeYOffset[wheelNumber][c] +" " + cubeZOffset[wheelNumber][c]);
				}
			
		}
			//console.log("ich bin da und drehe");
		 
		 
			
    };

	this.stopRotation = function(wheelNumber){
		countReady++;
		rotationNr[wheelNumber]=0;
		randomCircular[wheelNumber]=0;
		if (lastCubeUpdateTime) {
				var delta = 0;
				for (var c=0; c <= 8; c++) {
					
					var ausgleich = Math.round(circle[wheelNumber][c]/((2 * Math.PI)/8));
					circle[wheelNumber][c] = ausgleich*((2 * Math.PI)/8);//delta / 1000.0;
					grad[wheelNumber][c] = -(360/(2 * Math.PI))*circle[wheelNumber][c];
					cubeRotation[wheelNumber][c] = grad[wheelNumber][c];
					cubeYOffset[wheelNumber][c] = yIncValue* Math.sin(circle[wheelNumber][c]);
					cubeZOffset[wheelNumber][c] = zIncValue* Math.cos(circle[wheelNumber][c]);
					
					wheel[wheelNumber][c].save();
					
					wheel[wheelNumber][c].translate([cubeXOffset[wheelNumber][c], cubeYOffset[wheelNumber][c], cubeZOffset[wheelNumber][c]]);	
					wheel[wheelNumber][c].rotate(cubeRotation[wheelNumber][c], [1, 0, 0]);
					wheel[wheelNumber][c].draw();
					
					wheel[wheelNumber][c].revert();

					//console.log(cubeXOffset[wheelNumber][c] + " " +cubeYOffset[wheelNumber][c] +" " + cubeZOffset[wheelNumber][c]);
				}
			   //buhlscher randomGen
			}
		if (countReady==3&&countReadyFirst==true){
			console.log("stop spinning");
			soundsSlot.stopSpinning();
			$SlotMachine.checkState();
			}
		
	};
	
	this.start = function(){
	
		if ((grad[0][randomFront[0]]>randomCircular[0]*360
			&& grad[1][randomFront[1]]>randomCircular[1]*360
			&& grad[2][randomFront[2]]>randomCircular[2]*360)
			||
			randomCircular[0]==0
			&&randomCircular[1]==0
			&&randomCircular[2]==0
			){
			}
		};
	
    this.checkState = function() {
		if (start ==true){
			start=false;
			money=1000;
			gameoptions.setCurrency(money);
			}
		else if (randomFront[0]==randomFront[1]
			&&randomFront[1]==randomFront[2]){
				console.log("Winner " + randomFront[2]);
				soundsSlot.playWin();
				money=money+$SlotMachine.MoneyPayed(randomFront[2]);
				gameoptions.setCurrency(money);
				gameoptions.won();
		}
		/*else if (randomFront[0]==randomFront[1]
			||randomFront[1]==randomFront[2]
			||randomFront[0]==randomFront[2]){
				console.log("Winner");
				soundsSlot.playWin();
				money=money+$SlotMachine.MoneyPayed(randomFront[2])/2;
				gameoptions.setCurrency(money);
				gameoptions.won();
		}*/
		else{
			soundsSlot.playLose();
			console.log("Looser");
			if (money==0)
				money=0;//TODO: Gameover
		}
		countReadyFirst=false;
		
    };

    this.randomize = function() {
		for (var i = 0; i<3;i++){
				var temp=randomCircular[i];
				randomFront[i] = Math.floor(Math.random()*8);
				randomCircular[i] = Math.round(Math.random()*1)+1;
				var front=$SlotMachine.getFrontName(randomFront[i]);
				console.log("Wheel " + (i+1) + ": Front:"+randomFront[i]+" "+ front + " Umdrehungen: " + (randomCircular[i]-temp));
				countReadyFirst=true;
		}
		
    };
	
	this.randomizeSingle = function(wheelNumber) {
		var preCircular = randomCircular[wheelNumber];
		randomFront[wheelNumber] = Math.floor(Math.random()*8);
		randomCircular[wheelNumber] = Math.round(Math.random()*1)+1;
		countReadyFirst=true;
		var front=$SlotMachine.getFrontName(randomFront[wheelNumber]);
		console.log("Wheel " + (wheelNumber+1) + ": Front:"+ front + " Umdrehungen: " + (randomCircular[wheelNumber]-preCircular));
    };

    this.control = function() {
			console.log("Ich warte");
    };
	
	this.getFrontName = function(frontNr){
		var front;
		switch (frontNr){
					case 0:
						front="Diamant";
						break;
					case 1:
						front="Kirsche";
						break;
					case 2:
						front="Pflaume";
						break;
					case 3:
						front="Zitrone";
						break;
					case 4:
						front="Orange";
						break;
					case 5:
						front="Melone";
						break;
					case 6:
						front="Kleeblatt";
						break;
					case 7:
						front="7";
						break;
				}
		return front;
	};
	
	this.MoneyPayed = function(frontNr){
		var payed;
		switch (frontNr){
					case 0:
						payed=1000;
						break;
					case 1:
						payed=200;
						break;
					case 2:
						payed=300;
						break;
					case 3:
						payed=400;
						break;
					case 4:
						payed=500;
						break;
					case 5:
						payed=600;
						break;
					case 6:
						payed=800;
						break;
					case 7:
						payed=900;
						break;
				}
		return payed;
	};

}

function initCubeTextures(w,c) {
		var colorPositions = [];		
		switch (c){
			case 1:
				colorPositions[1] = textureArray[0];
				break;
			case 2:
				colorPositions[1] = textureArray[1];
				break;	
			case 3:
				colorPositions[1] = textureArray[2];
				break;	
			case 4:
				colorPositions[1] = textureArray[3];
				break;	
			case 5:
				colorPositions[1] = textureArray[4];
				break;	
			case 6:
				colorPositions[1] = textureArray[5];
				break;	
			case 7:
				colorPositions[1] = textureArray[6];
				break;	
			case 8:
				colorPositions[1] = textureArray[7];
				break;	
		}
		
		colorPositions[0] = textureArray[11];
		colorPositions[2] = textureArray[9];
		colorPositions[3] = textureArray[8];
		colorPositions[4] = textureArray[12];
		colorPositions[5] = textureArray[13];
		return colorPositions;
}