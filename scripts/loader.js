var gamenumber;
$(document).ready( function() {
	var game = {	
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
			$('.back').fadeOut(200);
			this.animation('rewind');
		}
	}
	
	var controls = {
				
		init: function() {
			$('.canvasino, .back').hide();
			$('#game01, #game02').click(function() {		
			$(this).addClass('onFocus');
				gamenumber = $(this).attr('game');
				game.showIt();
			});
			$('.back').click(function() {
				game.hideIt();
			});

		} 
	}
	//game.hideIt();
	controls.init();
});