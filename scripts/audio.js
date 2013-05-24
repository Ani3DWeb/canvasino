
$(document).ready( function() {

	var config = {}
	config.audio = {directory: 'audio/'}

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