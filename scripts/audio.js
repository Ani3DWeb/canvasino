$(document).ready( function() {
	var allSounds;
	var volume = 1;
	var config = {}
	config.audio = {directory: 'audio/', cubeDirectory: 'audio/Cube/', wheelDirectory: 'audio/Wheel/'}

	audio = {
	
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
		playFile: function(audioElement, loop) {
			audioElement.load();
			audioElement.addEventListener('canplay', function() {
				audioElement.loop = loop;
				audioElement.play();			
			});
		},
		getRandom: function(audiofiles) {
			var random = Math.floor(Math.random() * audiofiles.length);
			return audiofiles[random];
		},
		off: function() {
			$.each( allSounds, function( key, file ) {
				file.volume = 0;
			});
		},
		on: function() {
			$.each( allSounds, function( key, file ) {
				file.volume = volume;
			});
		},
		stop: function() {
			$.each( allSounds, function( key, file ) {
				file.volume = 0;
			});
		}
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
			cubeSpin = [
				audio.loadFile(config.audio.cubeDirectory + 'CubeSpin1'),
				audio.loadFile(config.audio.cubeDirectory + 'CubeSpin2'),
				audio.loadFile(config.audio.cubeDirectory + 'CubeSpin3'),
			];
			cubeWin = audio.loadFile(config.audio.cubeDirectory + 'CubeWin');
			allSounds = [
				cubeTheme, cubeSelect, cubeSwitch, 
				cubeTurn[0], cubeTurn[1], cubeTurn[2], cubeTurn[3], 
				cubeSpin[0], cubeSpin[1], cubeSpin[2], cubeWin
			];
		},
		
		playTheme: function() {
			audio.playFile(cubeTheme, true);
		},
		/*stopTheme: function() {
			cubeTheme.load();	
		},*/
		playSelect: function() {
			audio.playFile(cubeSelect, false);
		},
		playSwitch: function() {
			audio.playFile(cubeSwitch, false);	
		},
		playTurn: function() {
			file=audio.getRandom(cubeTurn);
			audio.playFile(file, false);
		},
		playWin: function() {
			audio.playFile(cubeWin, false);	
		},
		playSpin: function() {
			file=audio.getRandom(cubeSpin);
			audio.playFile(file, false);
		}
		
	}
	soundsSlot = {
		loadFiles: function() {
			wheelTheme = audio.loadFile(config.audio.wheelDirectory + 'WheelTheme');
			wheelArm = audio.loadFile(config.audio.wheelDirectory + 'WheelArm');
			wheelArmSingle = audio.loadFile(config.audio.wheelDirectory + 'WheelArmSingle');
			wheelLose = audio.loadFile(config.audio.wheelDirectory + 'WheelLose'); 
			wheelSpinning = audio.loadFile(config.audio.wheelDirectory + 'WheelSpinning2');
			wheelStop = [
				audio.loadFile(config.audio.wheelDirectory + 'WheelStop1'),
				audio.loadFile(config.audio.wheelDirectory + 'WheelStop2'),
				audio.loadFile(config.audio.wheelDirectory + 'WheelStop3'),
				];	
			wheelWin = audio.loadFile(config.audio.wheelDirectory + 'WheelWin');
			allSounds = [
				wheelTheme, wheelArm, wheelArmSingle,
				wheelLose, wheelSpinning, wheelStop[0], wheelStop[1], 
				wheelStop[2], wheelWin
				];
		},
		playTheme: function() {
			audio.playFile(wheelTheme, true);	
		},
		/*stopTheme: function(){
			wheelTheme.load();
		},*/
		playArm: function() {
			audio.playFile(wheelArm, false);	
		},
		playArmSingle: function() {
			audio.playFile(wheelArm, false);	
		},
		playLose: function() {
			audio.playFile(wheelLose, false);	
		},
		playSpinning: function() {
			audio.playFile(wheelSpinning, true);	
		},
		stopSpinning: function() {
			wheelSpinning.pause();	
		},
		playStop: function() {
			file=audio.getRandom(wheelStop);
			audio.playFile(file, false);	
		},
		playWin: function() {
			audio.playFile(wheelWin, false);	
		}
	}
	
	var controls = {
	
		init: function( ) {

			// pause
			$('.sound').click(function() {
				if($(this).hasClass('mute'))
				{
					audio.on();
					$(this).removeClass('mute');
				} else {
					$(this).addClass('mute');
					audio.off();
				}					
				return false;
			});
		
			// volume
			$( ".volume" ).slider({
				range: "min",
				value:  volume*100,
				min: 0,
				max: 100,
				slide: function(event, ui) {
					$.each( allSounds, function( key, file ) {
						$('.sound').removeClass('mute');
						volume = ui.value/100;
						file.volume = volume;
					});
					$( ".volume-value" ).text( ui.value );
				}
		    });
		    $( ".volume-value" ).text( $( ".volume" ).slider( "value" ) );
		
		} 
	}
	
	controls.init();
});