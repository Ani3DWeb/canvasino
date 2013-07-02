$(document).ready( function() {

	var config = {}
	config.audio = {directory: 'audio/', cubeDirectory: 'audio/Cube/', wheelDirectory: 'audio/Wheel/'}

	var audio = {
	
		loadFile: function(file) {
			// Audioelement erstellen
			var audioElement = new Audio("");
			
			// im DOM einfügen, sonst wird es nicht abgespielt
			document.body.appendChild(audioElement);
			
			// herausfinden welcher Medientyp abgespielt werden kann
			var canPlayType = audioElement.canPlayType("audio/ogg");
			if(canPlayType.match(/maybe|probably/i)){
				audioElement.src = file + '.ogg';
			} else {
				audioElement.src = file + '.mp3';
			}
			return audioElement;
			
		},
		playFile: function(audioElement) {
			audioElement.addEventListener('canplay', function() {
				audioElement.loop = true;
				audioElement.play();			
			});
		},
		getRandom: function(audiofiles) {
			var random = Math.floor(Math.random() * audiofiles.length);
			return audiofiles[random];
		},
	}
	soundsRubik = {
		loadFiles: function() {
			cubeTheme = audio.loadFile(config.audio.cubeDirectory + 'CubeTheme');
			cubeSelect = audio.loadFile(config.audio.cubeDirectory + 'CubeSelect1'), 			
			cubeSwitch = audio.loadFile(config.audio.cubeDirectory + 'CubeSelect2');
			cubeTurn = [
				audio.loadFile(config.audio.cubeDirectory + 'CubeTurn1'),
				audio.loadFile(config.audio.cubeDirectory + 'CubeTurn2'),
				audio.loadFile(config.audio.cubeDirectory + 'CubeTurn3'),
				audio.loadFile(config.audio.cubeDirectory + 'CubeTurn4')
				];
			cubeWin = audio.loadFile(config.audio.cubeDirectory + 'CubeWin');
		},
		
		playTheme: function() {
			cubeTheme.load();
			cubeTheme.play();
		},
		stopTheme: function() {
			cubeTheme.load();	
		},
		playSelect: function() {
			cubeSelect.load();
			cubeSelect.play();
		},
		playSwitch: function() {
			cubeSwitch.load();
			cubeSwitch.play();	
		},
		playTurn: function() {
			file=audio.getRandom(cubeTurn);
			file.load();
			file.play();
		},
		playWin: function() {
			cubeWin.play();
		}
		
	}
	soundsSlot = {
		loadFiles: function() {
			wheelTheme = audio.loadFile(config.audio.wheelDirectory + 'WheelTheme');
			wheelArm = audio.loadFile(config.audio.wheelDirectory + 'WheelArm');
			wheelCoin = [
				audio.loadFile(config.audio.wheelDirectory + 'WheelCoin1'),
				audio.loadFile(config.audio.wheelDirectory + 'WheelCoin2'),
				audio.loadFile(config.audio.wheelDirectory + 'WheelCoin3'),
				audio.loadFile(config.audio.wheelDirectory + 'WheelCoin4')
				];
			wheelLose = audio.loadFile(config.audio.wheelDirectory + 'WheelLose'); 
			wheelSpinning = audio.loadFile(config.audio.wheelDirectory + 'WheelSpinning');
			wheelStop = [
				audio.loadFile(config.audio.wheelDirectory + 'WheelStop1'),
				audio.loadFile(config.audio.wheelDirectory + 'WheelStop2'),
				audio.loadFile(config.audio.wheelDirectory + 'WheelStop3'),
				];	
			wheelWin = audio.loadFile(config.audio.wheelDirectory + 'WheelWin');
		},
		playTheme: function() {
			wheelTheme.load();
			wheelTheme.play();
		},
		stopTheme: function(){
			wheelTheme.load();
		},
		playArm: function() {
			wheelArm.load();
			wheelArm.play();
		},
		playCoin: function() {
			file=audio.getRandom(WheelCoin);
			file.load();
			file.play();
		},
		playLose: function() {
			wheelLose.load();
			wheelLose.play();
		},
		playSpinning: function() {
			wheelSpinning.load();
			wheelSpinning.play();
		},
		playStop: function() {
			file=audio.getRandom(WheelStop);
			file.load();
			file.play();
		},
		playWin: function() {
			wheelWin.load();
			wheelWin.play();
		}
	}
	
	var controls = {
	
		init: function( ) {
			$('.controls').hide();
			$('.start').show();
						
			// start 
			$('.start').click(function() {
			
				var audioElement = audio.loadFile(config.audio.directory + 'audio1');
				audio.playFile(audioElement);
				$('.pause, .volume, .volume-value').show();
				$('.start').hide();
				
				// pause
				$('.pause').click(function() {
					$(this).hide();		
					$('.play').show();
					audioElement.pause();
					return false;
				});
			
				// play
				$('.play').click(function() {
					$(this).hide();		
					$('.pause').show();		
					audioElement.play();
					return false;
				});
				
				// volume
				$( ".volume" ).slider({
					range: "min",
					value:  50,
					min: 0,
					max: 100,
					slide: function(event, ui) {
						audioElement.volume = ui.value/100;
						$( ".volume-value" ).text( ui.value );
					}
			    });
			    $( ".volume-value" ).text( $( ".volume" ).slider( "value" ) );
			});
		} 
	}
	
	controls.init();
});