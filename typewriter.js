// animates "typing" of 'text' into the given input at a rate of 'wpm' word-per-minute
$.fn.typewriter = function(text, wpm) {
	if ( !wpm ) wpm = 120;

	if ( text && text.length ) {
		$(this).focus().animate({
            // progress() isn't called unless at least one property is defined. :(
			zIndex: 0 
		}, {
			duration: Math.floor(text.length * 1e4 / wpm),
			progress: function(anim, progress, remaining) {
				var typedLength = Math.floor(progress * text.length);
				var partialText = text.slice(0, typedLength);
				$(this).val(partialText);
                // keep the textarea scrolled all the way to the bottom
                $(this).scrollTop($(this)[0].scrollHeight);

			},
			complete: function() {
				$(this).val(text);
			}
		});
	}
	return $(this);
}

// TODO: the typing animation is too regular, it doesn't look like a human is
// typing. It needs some randomness, to be a little faster on english words
// than symbols, and to treat four spaces as a single character.
