var gamenumber;
var counter = 0;
var time;
var gameoptions = {
		
	won: function() {
		$('#win_image').show();
		$('#win_image img').css("animation","flow 2s").css("-webkit-animation","flow 2s").css("-moz-animation","flow 2s");
		this.stopTime();
	},
	resetRotations: function() {
		counter = 0;
		$('#count_rotations').html(counter);
	},
	countRotations: function(status) {		
		if (status == "rotate")
		{	
			counter++;
		}
		else if (status == "win")
		{
			counter = 0;	
		}
		$('#count_rotations').html(counter);
	},
	stopTime: function() {
		clearInterval(time);
	},
	resetTime: function() {
		clearInterval(time);
		timer.reset();
	},
	startTime: function() {
		time = setInterval(timer.start, 1000);
	},		
	setCurrency: function(currency) {
		$('#currency_value').html(currency);	
		},
	
	hideWinImage: function()
	{
		$('#win_image').hide();
	},
	
	loose: function() {
		$('#game_over_image').show();
		$('#game_over_image img').css("animation","flow2 2s").css("-webkit-animation","flow2 2s").css("-moz-animation","flow2 2s");
	},
	
	hideLooseImage: function()
	{
		$('#game_over_image').hide();
	},
	showBoxRestart: function() {
	 $('#restart_cube').fadeIn(3000);
	},	
	hideBoxRestart: function() {
	 $('#restart_cube').fadeOut(500);
	}
}
var timer = {
	
	second:1,
	minute: 0,
	hour: 0,
	reset: function() {
		timer.second = 1;
		timer.minute = 0;
		timer.hour = 0;
		$('#second').html('00');
		$('#minute').html('00');
		
	},
	start: function() {
		$('#timer').show();
		//bei einer Ziffer 0 davor anzeigen
		if (timer.second < 10)
		{
			$('#second').html('0' + timer.second);
		}
		else
		{
			$('#second').html(timer.second);
		}
		
		// bei der 60. Sekunde Minute hochz�hlen und Sekunde zur�cksetzen
		if ((timer.second % 60) == 0)
		{
			timer.second = 0;
			timer.minute++;
	
		if (timer.second < 10)
			{
				$('#second').html('0' + timer.second);
			}
		else
			{
				$('#second').html(timer.second);
			}
	
		if (timer.minute < 10)
			{
				$('#minute').html('0' + timer.minute);
			}
		else
			{
				$('#minute').html(timer.minute);
			}
		}
		if (timer.minute == 59)
		{
			timer.minute = 0;
		}
		timer.second = timer.second + 1;
	}
}	

$(document).ready( function() {
	
	
	
	var gameCanvas = {	
		animation: function(direction) {
			var rows = 11; /* Zeilen innheralb von gameboy.png */
			var columns = 3; /* Spalten innerhalb von gameboy.png */
			var speed = 100; /* Geschwindigkeit in ms mit der das sprite durchlaufen wird */
			var grid = new Array();
			var pic = new Array();
			pic['width'] = $('.gameboy').width();
			pic['height'] = $('.gameboy').height();
			
			function initGrid() {		
				for(var x = 0; x < columns; x++) {
					grid[x] = new Array();
					for(var y = 0; y < rows; y++) {
						grid[x][y] = new Array();
						grid[x][y]['x'] = -x * pic['width'];
						grid[x][y]['y'] = -y * pic['height'];
					}
				}	
				return grid;
			}
			initGrid();
			
			var x = 0;
			var y = 0;
			var timeout = null;
			
			var xRev = columns-1;
			var yRev = rows-1;

			var forward = function() {
				$('.gameboy').css({ 'background-position' : grid[x][y].x  + 'px '+ grid[x][y].y +'px' });	
				timeout = setTimeout(forward, speed);
				if( x++ == columns-1 ) {
					x = 0;
					if( y++ == rows-1 ) {	
						clearTimeout(timeout);
						$('.canvasino').show();
						$('#footer').show();
						if(gamenumber == 2) {
							$('#currency').hide();
						} else if (gamenumber == 1) {
							gameoptions.setCurrency('500');
							$('#currency').show();
							$('#controls #top').hover(
								function(){$(this).css({'background': 'none'})}
							);		
						}
						main();
					}
				}
			}
			var backward = function() {
				$('.gameboy').css({ 'background-position' : grid[xRev][yRev].x  + 'px '+ grid[xRev][yRev].y +'px' });	
				timeout = setTimeout(backward, speed);
				if( xRev-- == 1 ) {
					xRev = columns-1;
					if( yRev-- == 1 ) {	
						clearTimeout(timeout);
						$('.back').show();
						$('.screen .gameboy').css({'z-index': 0});
					}
				}
				if(xRev==2&yRev==0) {location.reload();}
			}	
			if(direction === 'forward') { 
				forward();
			} else {
				$('.canvasino').hide();
				backward();
			}			
		},
		showIt: function() {
			$('.screen .gameboy').css({'z-index': 100});
			this.animation('forward');
			$('.back').show();           
		},
		hideIt: function() {
			if(gamenumber == 1) {
				//soundsSlot.stopTheme();	
			} else {
				//soundsRubik.stopTheme();
			}
			$('.back').fadeOut(200);
			$('#footer').hide();
			this.animation('rewind');
		}
	}
	
	var controls = {
				
		init: function() {
			$('.canvasino, .back').hide();
			$('#game01').click(function() {		
			$(this).addClass('onFocus');
				gamenumber = $(this).attr('data-gamenumber');
				gameCanvas.showIt();
				$('#timer, #rotations').hide();
				soundsSlot.loadFiles();
			});
			
			$('#game02').click(function() {		
			$(this).addClass('onFocus');
				gamenumber = $(this).attr('data-gamenumber');
				gameCanvas.showIt();
				soundsRubik.loadFiles();
			});

			$('.back').click(function() {
				gameCanvas.hideIt();
				audio.stop();	
			});
			
			$('#win_image').hide();
			$('#game_over_image').hide();
			$('#restart_cube').hide();
		} 
	}
	//game.hideIt();
	controls.init();	
});


