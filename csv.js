$.fn.csv = function(data) {
	if ( data ) { // set 
		var table = $('<table class="table table-condensed table-striped"/>').appendTo(this);
		var lines = data.split("\n");
		var cellTag = '<th/>'; // th on first row, td ever after
		for (var i = 0; i < lines.length; i++) {
			var cells = lines[i].split(',');
			var row = $('<tr/>').appendTo(table);
			for (var j=0; j < cells.length; j++ ) {
				// .text() escapes all HTML, prevents XSS
				$(cellTag).appendTo(row).text(cells[j]);
			}
			cellTag = '<td/>';
		}
	} else { // get
		// TODO html to CSV
	}
}
