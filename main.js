
// code-form handler records a cassette from current form values
function recordHandler() {
	var cassette = Base64.encode( $('#code-form').serialize() );
	$('#share-group').removeClass('hidden');
	var link = (new URI()).search({c: cassette}).href()
	$('#test-link').attr('href', link);
	$('#share-link').val(link).focus().select(); // for easy copy-paste
	return false;
}
	
// simple private helper to find the center of an element
// relative to the window. returns a top/left object suitable
// for passing to .css() or .animate().
function center(el) {
	el = $(el);
	var p = el.offset();
	return {
		"top": p['top'] + el.height()/2,
		left: p.left + el.width()/2
	}
}

// int main(int argc, char* argv[]) {
$(function() {
	// see if there's a "cassette" (recorded session to play back) in the URL
	var uri = new URI(); // uses location.href
	var cassette = uri.search(true).c;

	if ( cassette ) { // playback mode
        // workaround for SimpleHTTPServer redirect behavior
        if ( cassette.slice(-1) == '/') cassette = cassette.slice(0, -1); 

		var formData = (new URI('?' + Base64.decode(cassette))).search(true);

		// prevent the user from actually clicking the button while in playback-mode
		$('#code-form').submit(function() { return false; });

        // don't animate the lang selection, just do it
		$('#lang').val(formData.lang || 'sql');

		// clear the form in preperation
		$('#cmd').val('');
		$('#code').val('');
		$('#csv-group').addClass('hidden');
		
		// create the fake mouse cursor and establish waypoints
		var mouse = $('<div class="mouse"/>').appendTo('body');
		var cmdPosition = center('#cmd');
		var codePosition = center('#code');
		var submitPosition = center('#submit');

        // make sure the steps column is visible but hide each step.
        $('[id^=step-]').hide(); // note: using hide() (instead of .hidden) so we can fadeIn() later
        $('#steps').removeClass('hidden');

		// intentionally set just slow enough to be annoying
		var mouseMoveTime = 1500; 
		var typingWPM = cassette.length > 1000 ? 250 : 150;
		var executionTime = 1500;

		// animate the playback of the cassette: the mouse moves to each field in turn,
		// and the typewriter animation "types in" the text. After the fields are filled out,
		// the mouse moves to the submit button and a progress bar shows the query "running"
		// and then the query results are shown. The "steps" fade in for each step.
        $('#step-cmd').fadeIn();
		mouse.animate(cmdPosition, mouseMoveTime).promise().done(function() { 
			$('#cmd').typewriter(formData.cmd, typingWPM).promise().done(function() {
                $('#step-code').fadeIn();
				mouse.animate(codePosition, mouseMoveTime).promise().done(function() { 
					$('#code').typewriter(formData.code, typingWPM).promise().done(function() {
                        $('#step-submit').fadeIn();
						mouse.animate(submitPosition, mouseMoveTime).promise().done(function() { 
		 					$('#result-group').removeClass('hidden');
		 					$('#progress-bar').animate({width: "100%"}, executionTime).promise().done(function() {
                                $('#progress-bar').parent('.progress').removeClass('active');
		 						$('#result').csv(formData.csv);
                                $('#step-done').fadeIn();
                                mouse.remove();
		 					});
						});
					});
				});
			});
		});

		// showing the results also exposes a "reset" link, which puts the page back
		// into record mode so the query and be modified and shared again.
		$('#reset').click(function() {
            $('#steps').addClass('hidden');
			$('#csv-group').removeClass('hidden');
			$('#csv').val(formData.csv);
			$('#result-group').hide();
			$('#code-form').submit(recordHandler);
			$('.mouse').remove();
			return false;
		});
	} else { // record mode
		$('#code-form').submit(recordHandler);
	}
});
// } // end main
