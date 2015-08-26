$(document).ready(function () {
	homeFadeIn();
	clickMenus();
	colorPageElements();
	gifIsotope();
	tagManager();
	showAddForm();
	gifGrabber();
	clickOrHover();
	copyUrl();
	addTags();
	selectTagToRemove();
	bulkOperations();
	showInnerNav();
	deleteProfile();
	gridView();
	partyModeToggle();
	clickValidate();
});

// Global color variables
var COLORS = ['#25B972', '#498FBD', '#ff6767', '#FFA533', '#585ec7', '#FF8359'];
var HOME_COLORS = ['#498FBD', '#ff6767', '#585ec7', '#FF8359'];
var GIF_COLORS = ['#25B972', '#498FBD', '#ff6767', '#585ec7', '#FF8359'];

// Fades in elements on the splash page
function homeFadeIn() {
	lazyGifs();
	setTimeout(function() {
		$('.main-logo-gif, .main-logo-cache').css({
			'opacity': '1.0'
		});
	}, 1200);
	setTimeout(function() {
		$('.slogan, .home-links-wrapper, .home-arrow').css({
			'opacity': '1.0'
		});
	}, 1600);
	landingColorShuffle();
	setTimeout(function() {
		$('.lightest').css({
			'opacity': '1.0'
		});
	}, 500);
	setTimeout(function() {
		$('.lighter').css({
			'opacity': '1.0'
		});
	}, 600);
	setTimeout(function() {
		$('.darker').css({
			'opacity': '1.0'
		});
	}, 700);
}

// Loads in landing-page gifs when viewport his certain elements
// Cuts down on initial bandwidth load
function lazyGifs() {
	$(document).scroll(function() {
		if ($('.startup-icon').visible()) {
			$('#gif1 img').attr('src', '/static/img/gifcache_gif1.gif');
			$('#gif2 img').attr('src', '/static/img/gifcache_gif2.gif');
			$('#gif3 img').attr('src', '/static/img/gifcache_gif3.gif');
		}
		if ($('.home-demo').visible()) {
			$('#gif4 img').attr('src', '/static/img/gifcache_gif4.gif');
		}
		if ($('.chrome-extension-section .code-link-wrapper').visible()) {
			$('#gif5 img').attr('src', '/static/img/gifcache_gif5.gif');
		}
		if ($('#gif5').visible()) {
			$('#gif6 img').attr('src', '/static/img/gifcache_gif6.gif');
		}
		if ($('#gif6').visible()) {
			$('#gif7 img').attr('src', '/static/img/gifcache_gif7.gif');
		}
	});
}

// Colors three 'shade' divs placed inside certain containers
function landingColorShuffle() {
    var randomnumber = (Math.random() * (COLORS.length -1) ) << 0;
    var counter = randomnumber;
    setInterval(function() {
        if (counter > COLORS.length - 1) {
            counter = 0;
        }
        var color = COLORS[counter];
        var shade1 = shadeColor2(color, -0.15);
	    var shade2 = shadeColor2(color, -0.3);
        setTimeout(function() {
    		$('.lightest').css({
    			'background-color': color
    		});
    	}, 500);
    	setTimeout(function() {
    		$('.lighter').css({
    			'background-color': shade1
    		});
    	}, 600);
    	setTimeout(function() {
    		$('.darker').css({
    			'background-color': shade2
    		});
    	}, 700);
    	counter += 1
    }, 3000);
    setInterval(function() {
    	shrinkGrowImage();
    }, 8000);
}

// Controls huge initial GIF animation on landing page
function shrinkGrowImage() {
	// Function to return correct vendor prefix for CSS animation
	function whichAnimationEvent(){
		var t,
		el = document.createElement("fakeelement");
		var animations = {
			"animation"      : "animationend",
			"OAnimation"     : "oAnimationEnd",
			"MozAnimation"   : "animationend",
			"WebkitAnimation": "webkitAnimationEnd"
		}
		for (t in animations) {
			if (el.style[t] !== undefined){
			return animations[t];
			}
		}
	}
	var animationEvent = whichAnimationEvent();
	var element = $('.main-logo-img');
	var baseUrl = 'http://www.gifcache.com/static/img/';
	element.addClass('shrink').removeClass('grow');
	// Uses previous function to determine the end of a CSS animation keyframe
	element.one(animationEvent, function(e) {
		// 17 comes from 18 (total number of Home GIFs - 1)
		var randomnumber = (Math.random() * (17) ) << 0;
		var gif = baseUrl + randomnumber + '.gif';
		$(this).css('transform', 'scale(0)').children('img').attr('src', gif);
		$(this).addClass('grow').removeClass('shrink').css('transform', 'scale(1)');
	});
}

// Picks colors and applies them to various elements on page load
function colorPageElements() {
	var randomnumber = (Math.random() * (COLORS.length - 0 + 1) ) << 0;
	var counter = randomnumber;
	$('.loading i').css({'color': COLORS[randomnumber]});
	$('.nav-logo-circle').css({
		'background-color': COLORS[randomnumber]
	});
	$('.bulk-option').each(function() {
		var bulkOptionColor = COLORS[Math.floor(Math.random() * COLORS.length)];
		$(this).css({
			'border-top': '.15em solid ' + bulkOptionColor
		});
	});
	var colorChoice = '';
	var numLoops = 1;
	var secondColor = '';
	$('.home-section').each(function() {
		if (counter > HOME_COLORS.length - 1 ) {
			counter = 0;
		}
		var homeColor = HOME_COLORS[counter];
		if ($(this).attr('id') === 'landing-page') {
			colorChoice = homeColor;
		}
		else if (numLoops >= 2) {
			secondColor = homeColor;
			$(this).css({
				'background-color': homeColor
			});
		} else {
		    $(this).css({
				'background-color': homeColor
			});
		}
		counter += 1
		numLoops += 1
	});
	var shade1 = shadeColor2(colorChoice, -0.15);
	var shade2 = shadeColor2(colorChoice, -0.3);
	$('.lightest').css('background-color', colorChoice);
	$('.lighter').css('background-color', shade1);
	$('.darker').css('background-color', shade2);
	$('.nav-links a, .profile-nav-link').each(function() {
		var classes = ['red', 'yellow', 'purple', 'peach'];
		if (counter > classes.length - 1 ) {
			counter = 0;
		}
		var dynamicClass = classes[counter] + '-border';
		$(this).addClass(dynamicClass);
		counter += 1
	});
	$('.startup-icon').each(function() {
		if (counter > COLORS.length - 1 ) {
			counter = 0;
		}
		var color = COLORS[counter];
		$(this).css({
			'background-color': color
		});
		counter += 1
	});
	$('.features-section .feature-title').each(function() {
		if (counter > COLORS.length - 1 ) {
			counter = 0;
		}
		var color = COLORS[counter];
		$(this).css({
			'color': color
		});
		counter += 1
	});
	var randomnumber = (Math.random() * (COLORS.length - 0 + 1) ) << 0;
	$('.home-whatsnew-title, .home-plug-link').css('color', secondColor);
	$('.home-whatsnew-notes').css('border-top', '.1em solid ' + secondColor);
	$('.home-whatsnew-version').css('background-color', secondColor);
	colorMainForm();
	colorProfile();
}

// Colors the border-bottom CSS property of the main form elements
function colorMainForm() {
	var randomnumber = (Math.random() * (GIF_COLORS.length - 1) ) << 0
	var counter = randomnumber;
	$('.main-form, .main-form h1, .title, .suggestions-title').css({
		'background-color': GIF_COLORS[counter]
	});
	counter += 1;
	$('.main-field').each(function() {
		if (counter > COLORS.length - 1 ) {
			counter = 0;
		}
		var color = COLORS[counter];
		$(this).css({
			'border-bottom': '.3em solid ' + color
		});
		counter += 1
	});
	$('select').css({
		'border-bottom': '.3em solid ' + COLORS[counter]
	});
}

// Colors elements of the profile view page
function colorProfile() {
	var randomnumber = (Math.random() * (COLORS.length - 0 + 1) ) << 0
	var counter = randomnumber;
	var profileInfoColor = COLORS[Math.floor(Math.random() * COLORS.length)];
	$('.profile-info').css({
		'background-color': profileInfoColor
	});
	$('.profile-avatar img, .profile-avatar video').css({
		'background-color': profileInfoColor
	});
	$('.nav-setting-icon').each(function() {
		if (counter > COLORS.length - 1 ) {
			counter = 0;
		}
		$(this).css('background-color', COLORS[counter]);
		counter += 1
	});
	$('.tag-group').each(function() {
		if (counter > COLORS.length - 1 ) {
			counter = 0;
		}
		var color = COLORS[counter];
		$(this).css({
			'background-color': color
		});
		$(this).find('.tag-manager-options .title, .tag-manager-section-title, .tag-manager-options-title').css({
			'background-color': color
		});
		$(this).find('.tag-title').css('background-color', color);
		$(this).find('.tag-settings-icon, .gif-count').css('background-color', color);
		$(this).find('.tag-manager-options').css('background-color', color);
		$(this).find('.tag-manager-form form').each(function(){
			$(this).css('background-color', color);
		});
		counter += 1
	});
	reColorProfile();
}

// Called when the 'shufle colors' button is clicked
function reColorProfile() {
	$('.color-btn').on('click', function() {
		colorProfile();
	})
}

// Shows additional menus after clicking certain elements, for mobile accessibility
function clickMenus() {
	var isMobile = jQuery.browser.mobile;
	if (isMobile) {
    	$('.profile-nav-link').on('click', function() {
    		$(this).children('.profile-nav-extra').toggleClass('hidden');
    	});
    	$('.nav-links-small').on('click', function(e) {
    		var target = $(e.target);
    		if (!target.is('.small-nav-icon')) {
    			// Nothing
    		} else {
    			$(this).children('.small-nav-container').toggleClass('hidden');
    		}
    	});
    	$('.nav-settings-icon').on('click', function(e) {
    		var target = $(e.target);
    		if (!target.is('.nav-setting-icon')) {
    			$(this).children('.nav-settings').toggleClass('hidden');
    			$(this).toggleClass('nav-settings-icon-selected');
    		} else {
    			$(this).children('.nav-settings').toggleClass('hidden');
    			$(this).toggleClass('nav-settings-icon-selected');
    		}
    	});
    	$('.inner-nav-tags').on('click', function(e) {
    		var target = $(e.target);
    		if (!target.is('.inner-nav-tags.btn')) {
    			$(this).toggleClass('purple-btn-selected');
    			$(this).children('.inner-tag-nav').toggleClass('hidden');
    		} else {
    			$(this).toggleClass('purple-btn-selected');
    			$(this).children('.inner-tag-nav').toggleClass('hidden');
    		}
    	});
    	$('.sort').on('click', function(e) {
    		var target = $(e.target);
    		if (!target.is('.sort.btn')) {
    			$(this).toggleClass('peach-btn-selected');
    			$(this).children('.sort-options').toggleClass('hidden');
    		} else {
    			$(this).toggleClass('peach-btn-selected');
    			$(this).children('.sort-options').toggleClass('hidden');
    		}
    	});
	}
}

// Handles the Isotope grids and sorting
function gifIsotope() {
	// Grids within tag groups and sorting options
	var grid = $('.tag-group').isotope({
		itemSelector: '.gif-grid-element',
		masonry: {
			columnWidth: 100,
			isFitWidth: true
		},
		getSortData: {
			label: '.gif-label'
		}
	});
	var labelClicked = false;
	$('.sort-label').on('click', function() {
		$(this).toggleClass('green-btn-selected');
		$('.tag-sort-title').removeClass('green-btn-selected');
		$('.sort-date, .tag-sort-date').removeClass('blue-btn-selected');
		if (labelClicked === false) {
			labelClicked = true;
			grid.isotope({
				sortBy: 'label',
				sortAscending: true
			});
		} else {
			labelClicked = false;
			grid.isotope({
				sortBy: 'label',
				sortAscending: false
			});
		}
	});
	var dateClicked = true;
	$('.sort-date').on('click', function() {
		$(this).toggleClass('blue-btn-selected');
		$('.tag-sort-date').removeClass('blue-btn-selected');
		$('.sort-label, .tag-sort-title').removeClass('green-btn-selected');
		if (dateClicked === false) {
			dateClicked = true;
			grid.isotope({
				sortBy: 'original-order',
				sortAscending: true
			});
		} else {
			dateClicked = false;
			grid.isotope({
				sortBy: 'original-order',
				sortAscending: false
			});
		}
	});
	$('.sort-random').on('click', function() {
		$('.sort-label, .tag-sort-title').removeClass('green-btn-selected');
		$('.sort-date, .tag-sort-date').removeClass('blue-btn-selected');
		grid.isotope('shuffle');
	});
	// Grid of tag groups and sorting options
	var taggedGrid = $('#tagged-gif-grid').isotope({
		itemSelector: '.tag-group',
		layoutMode: 'packery',
		packery: {
			isFitWidth: true
		},
		getSortData: {
			title: '.tag-title'
		}
	});
	var titleClicked = false;
	$('.tag-sort-title').on('click', function() {
		$(this).toggleClass('green-btn-selected');
		$('.sort-label').removeClass('green-btn-selected');
		$('.tag-sort-date, .sort-date').removeClass('blue-btn-selected');
		if (titleClicked === false) {
			titleClicked = true;
			taggedGrid.isotope({
				sortBy: 'title',
				sortAscending: true
			});
		} else {
			titleClicked = false;
			taggedGrid.isotope({
				sortBy: 'title',
				sortAscending: false
			});
		}
	});
	var tagDateClicked = true;
	$('.tag-sort-date').on('click', function() {
		$(this).toggleClass('blue-btn-selected');
		$('.sort-date').removeClass('blue-btn-selected');
		$('.tag-sort-title, .sort-title').removeClass('green-btn-selected');
		if (tagDateClicked === false) {
			tagDateClicked = true;
			taggedGrid.isotope({
				sortBy: 'original-order',
				sortAscending: true
			});
		} else {
			tagDateClicked = false;
			taggedGrid.isotope({
				sortBy: 'original-order',
				sortAscending: false
			});
		}
	});
	$('.tag-sort-random').on('click', function() {
		$('.tag-sort-title, .sort-title').removeClass('green-btn-selected');
		$('.tag-sort-date, .sort-date').removeClass('blue-btn-selected');
		taggedGrid.isotope('shuffle');
	});
	$('.tag-group-refresh').on('click', function() {
		taggedGrid.isotope('layout');
	});
}

// Shows/hides the tag manager forms
function tagManager() {
	$('.tag-settings-icon').on('click', function() {
		$(this).siblings('.tag-manager').toggleClass('hidden');
		$(this).toggleClass('tag-settings-icon-clicked');
	});
	$('.rename').on('click', function() {
		var form = $(this).parents('.tag-manager-options').siblings('.tag-manager-form').children('.rename-tag-form');
		form.toggleClass('hidden');
		$(this).toggleClass('green-btn-selected');
	});
	$('.delete').on('click', function() {
		var form2 = $(this).parents('.tag-manager-options').siblings('.tag-manager-form').children('.delete-tag-form');
		form2.toggleClass('hidden');
		$(this).toggleClass('red-btn-selected');
	});
}

// Show/hide main Add GIF form
function showAddForm() {
	$('.add-gif-form-button').on('click', function() {
		$(this).toggleClass('green-btn-selected');
		$('.add-gif-form').toggleClass('hidden');
		setTimeout(function() {
			colorMainForm();
		}, 1);
	});
	$('.add-gif-form').on('click', function(e) {
		e.preventDefault();
		var target = $(e.target);
		if (target.is('#add-gif-submit')) {
			colorPageElements();
			loadingScreen();
			$(this).children('form').submit();
		} else if (target.is('form, input, h1')) {
			// Nothing
		} else {
			$(this).toggleClass('hidden');
			$('.add-gif-form-button').toggleClass('green-btn-selected');
		}
	});
}

// Reusable full-screen loading animation
function loadingScreen() {
	var counter = 1;
	var blurbs = [
		'Processing, one moment please...',
		'Processing...',
		'Just a moment...',
		'Almost done...'
	];
	var html = '<div class="lightbox loading-wrapper main-loading hidden">' +
				'<div class="loading"><i class="fa fa-spinner fa-pulse"></i>' +
				'<div id="loading-blurb" class="animate">Processing, one moment please...</div></div>' +
				'</div>';
	$('body').append(html);
	$('.main-loading').toggleClass('hidden');
	setInterval(function() {
		counter += 1
		if (counter > blurbs.length) {
			counter = 0;
		}
		$('#loading-blurb').css('opacity', 0.0);
		setTimeout(function() {
			$('#loading-blurb').text(blurbs[counter]);
			$('#loading-blurb').css('opacity', 1.0);
		}, 800);
	}, 6000);
}

// Show/Hide GifGrabber form, handles logic for the submit button
function gifGrabber() {
	gifGrabberSuggestions();
	$('.gifgrabber-btn').on('click', function() {
		gifGrabberAjax();
		$(this).toggleClass('red-btn-selected');
		$('.gifgrabber-form-wrapper').toggleClass('hidden');
		setTimeout(function() {
			colorMainForm();
		}, 1);
	});
	$('.gifgrabber-form-wrapper').on('click', function(e) {
		e.preventDefault();
		var target = $(e.target);
		// Defining elements that can be clicked on
		if (!target.is('.gifgrabber-form-wrapper')) {
			// Nothing
		} else {
			$(this).toggleClass('hidden');
			$('.gifgrabber-btn').toggleClass('red-btn-selected');
		}
	});
	$('.grabber-new-search').on('click', function() {
		gifGrabberTeardown();
	});
	// Submit
	$('.grabber-add-gifs-btn').on('click', function(e) {
		e.preventDefault();
		updateGrabberValues();
		if ($('#gifgrabber-values').val() === '') {
			// Nothing
		} else {
			loadingScreen();
			$('#grabber-add-form').submit();
		}
	});
}

// Fades in subreddit suggestions for GifGrabber
function gifGrabberSuggestions() {
	var alreadyExists = $('.subreddit-suggestions').length;
	if (alreadyExists) {
		// Nothing
	} else {
		var container = '<div class="subreddit-suggestions animate">' +
						'<div class="suggestions-title">Subreddit Suggestions</div>' +
						'<div class="suggestions"></div></div>';
		$('.gifgrabber-form').prepend(container);
	}
	function clickSuggestions() {
		$('.suggestion').on('click', function() {
			$('.subreddit-field').val('');
			$('.subreddit-field').val($(this).text());
		});
	}
	var suggestions = ['gifs', 'gifrequests', 'makemeagif', 'physicsgifs', 'perfectloops',
						'reactiongifs', 'mechanical_gifs', 'surrealgifs', 'spacegifs',
						'interestinggifs', 'highqualitygifs', 'naturegifs', 'behindthegifs',
						'educationalgifs', 'michaelbaygifs', 'gifextra', 'combinedgifs',
						'wastedgifs'];
	choices = shuffle(suggestions);
	var choice1 = '<div class="suggestion animate-fast">' + choices[0] + '</div>';
	var choice2 = '<div class="suggestion animate-fast">' + choices[1] + '</div>';
	var choice3 = '<div class="suggestion animate-fast">' + choices[2] + '</div>';
	var html = choice1 + choice2 + choice3;
	$('.suggestions').fadeOut('slow', function() {
		$(this).empty();
		$(this).append(html);
		var randomnumber = (Math.random() * (COLORS.length - 0 + 1) ) << 0
		var counter = randomnumber;
		$('.suggestion').each(function() {
			if (counter > COLORS.length - 1 ) {
				counter = 0;
			}
			var color = COLORS[counter];
			$(this).css('background-color', color);
			counter += 1
		});
		$(this).fadeIn('slow');
		clickSuggestions();
	});
	setTimeout(function() {
		gifGrabberSuggestions();
	}, 8000);
}

// Logic for when Grabber result is clicked (hidden fields/feedback elements updated)
function clickGrabberElements(element) {
	$(element).on('click', function(e) {
		var innerElement = $(this).children('.grabber-results-element-inner');
		var isHidden = $(innerElement).hasClass('hidden');
		var target = $(e.target);
		if (target.is('.grabber-expand')) {
			// Expand the GIF
			var url = $(target).siblings('.grabber-gif').attr('src');
			var title = $(target).siblings('.grabber-results-element-inner').children('.inner-label').val();
			grabberLightbox(url, title);
		}
		else if (target.is('.short-link, .short-link i')) {
			// Opening short-link in new tab if icon clicked
			var link = $(target).parent().attr('href');
			window.open(link, '_blank');
		}
		else if (isHidden) {
			innerElement.toggleClass('hidden');
			updateSelectedGifs();
		} else {
			if (target.is('.grabber-inner-cancel, .grabber-inner-cancel i, .grabber-inner-cancel div')) {
				innerElement.toggleClass('hidden');
				updateGrabberValues();
				updateSelectedGifs();
			}
		}
	});
}

// 'Expands' gif results from Grabber
function grabberLightbox(url, title) {
	console.log(url);
	var lastPeriod = url.lastIndexOf('.');
	var extension = url.slice(lastPeriod + 1, url.length);
	if (extension === 'gif') {
		var element = '<img class="grabber-expanded" src="' + url + '">';
	} else if (extension === 'mp4') {
		var element = '<video src="' + url + '" autoplay loop class="grabber-expanded" poster="../static/img/preload.gif"></video>';
	}
	var title = '<div class="label grabber-lightbox-label">' + title + '</div>';
	var html = element + title;
	$('.grabber-lightbox').append(html);
	$('.grabber-lightbox').removeClass('hidden');
	$('.grabber-lightbox').on('click', function() {
		$(this).addClass('hidden');
		$(this).empty();
	});
}

// Updates hidden input containing GifGrabber results to be sent to the DB
function updateGrabberValues() {
	var valuesInput = $('#gifgrabber-values');
	var finalValues = '';
	valuesInput.val('');
	$('.grabber-results-element-inner').each(function() {
		var isHidden = $(this).hasClass('hidden');
		if (isHidden) {
			// Nothing
		} else {
			var url = $(this).siblings('.grabber-hidden-url').val();
			var label = $(this).children('.inner-label').val();
			var tags = $(this).children('.inner-tags').val();
			var values = url + '*' + label + '*' + tags;
			finalValues += values + '|';
		}
	});
	valuesInput.val(finalValues);
}

// Function to hide/update element showing how many GifGrabber results have
// been selected for addition to cache by user
function updateSelectedGifs() {
	var selectedCount = 0;
	$('.grabber-results-element-inner').each(function() {
		var isHidden = $(this).hasClass('hidden');
		if (isHidden) {
			// Nothing
		} else {
			selectedCount += 1
		}
	});
	if (selectedCount > 0) {
		$('.grabber-selected-gifs').removeClass('hidden');
		$('.selected-gifs-number').text(selectedCount);
		var color = COLORS[(Math.random() * (COLORS.length - 0 + 1) ) << 0];
		$('.selected-gifs-number').css('background-color', color);
	} else {
		$('.grabber-selected-gifs').addClass('hidden');
	}
}

// Hides form, loading screen, shows results page
function gifGrabberSetup() {
	$('#grabber-loading').remove();
	$('.gifgrabber-form').addClass('hidden');
	$('.gifgrabber-container').addClass('gifgrabber-expanded');
	$('.gifgrabber-results').removeClass('hidden');
}

// Hides GifGrabber results, empties divs with dynamic content
function gifGrabberTeardown() {
	$('.holder').empty();
	$('#grabber-results').empty();
	$('#grabber-error').empty();
	$('.gifgrabber-results').addClass('hidden');
	$('#grabber-error').addClass('hidden');
	$('.gifgrabber-container').removeClass('gifgrabber-expanded');
	$('#grabber-results').css({'min-height': '5em'});
	$('.gifgrabber-form').removeClass('hidden');
}

// Handles AJAX call when GifGrabber form is submitted
function gifGrabberAjax() {
	$('.gifgrabber-submit').on('click', function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		gifGrabberTeardown();
		$('#grabber-add-form').addClass('hidden');
		var subreddit = $(this).siblings('.subreddit-field').val();
		var sort = $(this).siblings('.sort-field').val();
		if (subreddit === '') {
			// Nothing
		} else {
			var html = '<div id="grabber-loading" class="lightbox hidden">' +
						'<div class="loading"><i class="fa fa-spinner fa-pulse"></i>' +
						'<div>Processing, one moment please...</div>' +
						'</div></div>';
			$('.gifgrabber-container').append(html);
			colorPageElements();
			$('#grabber-loading').removeClass('hidden');
			ajaxCSRF();
			$.ajax({
				url: '/u/gifgrabber/',
				type: 'POST',
				data: {
					'subreddit': subreddit,
					'sort': sort
				},
				success: function(json) {
					var shuffledColors = shuffle(COLORS);
					var counter = 0;
					var allowed = ['.gifv', '.mp4', '.webm'];
					var gifNumber = '<div class="grabber-data gif-number animate" style="background-color: ' + shuffledColors[0] + '">' + json['number_gifs'] + '<div class="grabber-data-label">GIFs Found</div></div>';
					var subreddit = '<div class="grabber-data subreddit-name animate" style="background-color: ' + shuffledColors[1] + '">' + json['subreddit'] + '<div class="grabber-data-label">Subreddit</div></div>';
					var sortType = '<div class="grabber-data sort-type animate" style="background-color: ' + shuffledColors[2] + '">' + json['sort'] + '<div class="grabber-data-label">Sort</div></div>';
					var grabberData = '<div class="grabber-data-container">' + gifNumber + subreddit + sortType + '</div>';
					for (i=0; i<json['gifs'].length; i++) {
						var url = json['gifs'][i][0];
						var ext = json['gifs'][i][1];
						if ($.inArray(ext, allowed) > -1) {
							lastPeriod = url.lastIndexOf('.');
							url = url.substring(0, lastPeriod) + '.mp4';
							var img = '<video class="grabber-gif" src="' + url + '" autoplay loop poster="../static/img/preload.gif"></video>';
						} else if (url.indexOf('gfycat') > -1) {
							var lastForwardSlash = url.lastIndexOf('/');
							var gfyname = url.slice(lastForwardSlash + 1, url.length);
							formattedUrl = 'http://giant.gfycat.com/' + gfyname + '.mp4';
							ext = 'gfycat';
							var img = '<video class="grabber-gif" src="' + formattedUrl + '" autoplay loop poster="../static/img/preload.gif"></video>';
						} else {
							var img = '<img class="grabber-gif" src="' + json['gifs'][i][0] + '">';
						}
						var titleText = json['gifs'][i][2];
						if (titleText.length > 40) {
							titleText = titleText.slice(0, 40) + '...';
						}
						var extension = '<div class="grabber-results-extension">' + ext + '</div>';
						var title = '<div class="grabber-results-title">' + titleText + '</div>';
						var shortLink = '<a class="short-link animate-fast" href="' + json['gifs'][i][3] + '"><i class="fa fa-reddit"></i></a>';
						var expandIcon = '<i class="grabber-expand fa fa-expand animate-fast"></i>'
						var hiddenUrl = '<input type="text" class="grabber-hidden-url hidden" value="' + json['gifs'][i][0] + '">';

						var innerCancel = '<div class="grabber-inner-cancel"><i class="fa fa-minus-circle"></i><div>Cancel</div></div>';
						var innerLabelInput = '<input type="text" class="gif-label-field inner-label" value="' + json['gifs'][i][2] + '">';
						var innerLabelLabel = '<div class="label">Label</div>';
						var innerTagsInput = '<input type="text" class="gif-label-field inner-tags" placeholder="Comma Separated Tags">';
						var innerTagsLabel = '<div class="label">Tags</div>';

						var innerHtml = '<div class="grabber-results-element-inner hidden">' + innerCancel + innerLabelInput + innerLabelLabel + innerTagsInput + innerTagsLabel + '</div>';
						var html = '<div id="grabber-gif-' + counter + '" class="grabber-results-element animate-fast">' + hiddenUrl + img + extension + title + shortLink + expandIcon + innerHtml + '</div>';
						$('.grabber-results-grid').append(html);
						var elementId = '#grabber-gif-' + counter;
						clickGrabberElements(elementId);
						counter += 1
					}
					$('.grabber-data-container').empty().append(grabberData);
					gifGrabberSetup();
					if (json['gifs'].length === 0) {
						$('.grabber-results-grid').text('No GIFs found!');
					} else {
						$('#grabber-add-form').removeClass('hidden');
						$(function() {
							$('.holder').jPages({
								containerID: 'grabber-results',
								perPage: 4,
								callback: function(pages, items) {
									items.showing.find('img, video').trigger('turnPage')
									items.oncoming.find('img, video').trigger('turnPage')
								}
							});
						});
					}
				},
				error: function(xhr, errmsg, err) {
					console.log('Error!');
					console.log(errmsg);
					console.log(xhr.status + ': ' + xhr.responseText);
					var errorMsg = 'There was a problem with that subreddit, please try another';
					gifGrabberSetup();
					$('#grabber-error').removeClass('hidden');
					$('#grabber-error').text(errorMsg);

				}
			});
		}
	});
}

// Adding hover classes to elements if desktop
function clickOrHover() {
	var isMobile = jQuery.browser.mobile;
	if (isMobile) {
		// Nothing
	} else {
		hoverGifs();
		$('.inner-nav-tags, .sort, .nav-settings-icon, .profile-nav-link').addClass('desktop-hover');
	}
}

// Adds HTML element containing full GIF and lays it on top of thumbnail
function hoverGifs() {
	$('.gif-grid-element').each(function() {
		$(this).addClass('gif-desktop');
	});
	$('.gif-grid-element').on({
		mouseenter: function() {
			var gif = $(this).find('.img-wrapper');
			var thumbnail = $(this).children('.gif-grid-thumbnail');
			var gifUrl = $(this).children('.display-url').val();
			var lastPeriod = gifUrl.lastIndexOf('.');
			var extension = gifUrl.slice(lastPeriod + 1, gifUrl.length);
			// Check what kind of URL we have
			var isGfycat = gifUrl.includes('gfycat');
			var isGifv = gifUrl.lastIndexOf('.gifv') == gifUrl.length - '.gifv'.length;
			var isMp4 = gifUrl.lastIndexOf('.mp4') == gifUrl.length - '.mp4'.length;
			var isWebm = gifUrl.lastIndexOf('.webm') == gifUrl.length - '.webm'.length;
			if (extension === 'gif') {
				var html = '<div class="img-wrapper animate"><img src="' + gifUrl + '"></div>'
			}
			else if (isGifv || isMp4 || isWebm || isGfycat) {
				var html = '<div class="img-wrapper animate"><video src="' + gifUrl + '" autoplay loop poster="../static/img/preload.gif"></video></div>'
			}
			if ($(this).hasClass('focused') || gif.hasClass('expanded')) {
				gifExpand($(this));
			} else {
				thumbnail.css({
				'opacity': 0.0
				});
				$(this).prepend(html);
				gifExpand($(this));
			}
		},
		mouseleave: function() {
			var gif = $(this).find('.img-wrapper');
			if ($(this).hasClass('focused') || gif.hasClass('expanded')) {
				gifExpand($(this));
			} else {
				var thumbnail = $(this).children('.gif-grid-thumbnail');
				thumbnail.css({
					'opacity': 1.0
				});
				$(this).children('.img-wrapper').remove();
				gifExpand($(this));
			}
		}
	});
}

// Add focus class to GIF elements and show/hide GIF editing options
function clickGifElements(logged_in) {
	var isMobile = jQuery.browser.mobile;
	$('.gif-grid-thumbnail').on('click', function() {
		var parent = $(this).parent();
		// If mobile, hover won't work so do the image append on 'click'
		if (isMobile) {
			var gif = $(parent).find('.img-wrapper');
			var thumbnail = $(parent).children('.gif-grid-thumbnail');
			var gifUrl = $(parent).children('.display-url').val();
			var lastPeriod = gifUrl.lastIndexOf('.');
			var extension = gifUrl.slice(lastPeriod + 1, gifUrl.length);
			parent.toggleClass('tapped');
			if (parent.hasClass('tapped')) {
				// Check what kind of URL we have
				var isGfycat = gifUrl.includes('gfycat');
				var isGifv = gifUrl.lastIndexOf('.gifv') == gifUrl.length - '.gifv'.length;
				var isMp4 = gifUrl.lastIndexOf('.mp4') == gifUrl.length - '.mp4'.length;
				var isWebm = gifUrl.lastIndexOf('.webm') == gifUrl.length - '.webm'.length;
				// Being selected, add the image element
				if (extension === 'gif') {
					var html = '<div class="img-wrapper animate"><img src="' + gifUrl + '"></div>'
				}
				else if (isGifv || isMp4 || isWebm || isGfycat) {
					var html = '<div class="img-wrapper animate"><video src="' + gifUrl + '" autoplay loop poster="../static/img/preload.gif"></video></div>'
				}
				thumbnail.css({
					'opacity': 0.0,
					'visibility': 'hidden'
				});
				$(parent).prepend(html);
				$(parent).find('.img-wrapper').on('click', function(e) {
					parent.removeClass('tapped');
					parent.children('.gif-form .edit-form').addClass('hidden');
					parent.children('.img-wrapper').remove();
					thumbnail.css({
						'opacity': 1.0,
						'visibility': 'visible'
					});
					toggleFocus(parent, logged_in);
				});
			}
		}
		toggleFocus(parent, logged_in);
	});
}

// Handles coloring/decoloring elements after 'focus' class is applied
function toggleFocus(parent, logged_in) {
	// Adding some extra positoning for logged-in menus
	if (logged_in === 'True') {
		parent.toggleClass('focused');
		if (parent.hasClass('focused')) {
			parent.css({
				'top': '-=150px'
			});
		} else {
			parent.css({
				'top': '+=150px'
			});
		}
	} else {
		parent.toggleClass('focused');
	}
	parent.children('.gif-form.edit-form').toggleClass('hidden');
	if (parent.hasClass('focused')) {
		var color  = GIF_COLORS[Math.floor(Math.random() * GIF_COLORS.length)];
		parent.css({
			'background-color': color
		});
		parent.find('.gif-form-title').css({
			'background-color': color
		});
		parent.find('.gif-label').css({
			'color': 'white'
		});
	} else {
		parent.css({
			'border': 'none',
			'background-color': '#e6e6e6'
		});
		parent.find('.gif-label').css({
			'color': '#4c4c4c'
		});
	}
}

// Scales up GIF once expand icon is clicked
function gifExpand(parent, logged_in) {
	$(parent).find('.gif-expand').on('click', function(e) {
		$(this).siblings('.img-wrapper').toggleClass('expanded');
	});
	$(parent).find('.img-wrapper').on('click', function(e) {
		$(this).toggleClass('expanded');
	});
}

// Displays text input containing the GIF url
function copyUrl() {
	$('.copy-url').on('click', function() {
		$(this).siblings('.gif-url').toggleClass('hidden');
	});
}

// Handles bulk tasks functionality
function bulkOperations() {
	$('.bulk-gif-button').on('click', function() {
		showBulkOptions();
		$(this).toggleClass('blue-btn-selected');
		$('.gif-grid-element').each(function() {
			$(this).children('.bulk-wrapper').toggleClass('hidden');
		});
		$('#bulk-operations').toggleClass('hidden');
		bulkSelect();
		$('#bulk-operations .submit').on('click', function(e) {
			e.preventDefault();
			grabBulkValues();
			var values = $('#bulk-operations').find('.bulk-values').val();
			if (values === '') {
				// Nothing
				console.log('Nothing selected!');
			} else {
				loadingScreen();
				$(this).parent().submit();
			}
		});
	});
	var html = '<div class="bulk-selected-gifs pulse hidden">' +
		'<div class="bulk-selected-gifs-number animate"></div>' +
		'</div>';
	$('#bulk-operations').prepend(html);
}

// Shows/hides various bulk task forms
function showBulkOptions() {
	$('#bulk-delete-btn').on('click', function() {
		$(this).toggleClass('red-btn-selected');
		$(this).siblings('#bulk-operations-delete').toggleClass('hidden');
	});
	$('#bulk-add-tags-btn').on('click', function() {
		$(this).toggleClass('green-btn-selected');
		$(this).siblings('#bulk-operations-add-tags').toggleClass('hidden');
	});
	$('#bulk-remove-tags-btn').on('click', function() {
		$(this).toggleClass('blue-btn-selected');
		$(this).siblings('#bulk-operations-remove-tags').toggleClass('hidden');
	});
}

// 'Selects' element by altering CSS class
function bulkSelect() {
	$('.bulk-wrapper').on('click', function() {
		$(this).children('i').toggleClass('fa-circle-o, fa-circle');
		updateBulkValue();
	});
}

// Scans for elements with 'selected' CSS class, records them in a text field
function grabBulkValues() {
	var ids = [];
	$('.bulk-wrapper').each(function() {
		var gifID = $(this).children('input').val();
		if ($(this).children('i').hasClass('fa-circle')) {
			ids.push(gifID);
		} else {
			// Nothing
		}
	});
	$('#bulk-operations').find('.bulk-values').each(function(){
		$(this).val(ids.join());
	});
}

// Updates visual feedback for how many GIFs selected for bulk operations
function updateBulkValue() {
	var selected = 0;
	$('.bulk-wrapper').each(function() {
		if ($(this).children('i').hasClass('fa-circle')) {
			selected += 1
		} else {
			// Nothing
		}
	});
	if (selected > 0) {
		// Show selected GIFs
		$('.bulk-selected-gifs').removeClass('hidden');
	} else {
		$('.bulk-selected-gifs').addClass('hidden');
	}
	var randomnumber = (Math.random() * (COLORS.length - 0 + 1) ) << 0;
	$('.bulk-selected-gifs-number').css('background-color', COLORS[randomnumber]);
	$('.bulk-selected-gifs-number').text(selected);
}

// Records tag ID in text field, applies CSS class for UX feedback
function selectTagToRemove() {
	$('.tag').children('.delete-tag').on('click', function() {
		var tagName = $(this).siblings('.tag-name').text();
		var selected = $(this).siblings('.remove-tag-input').val();
		if (selected == tagName) {
			$(this).parent().removeClass('warning');
			$(this).removeClass('icon-selected');
			$(this).siblings('.remove-tag-input').val(' ');
			updateTagRemoveInput($(this).parents('.tags'));
		} else if (selected == ' ') {
			$(this).parent().addClass('warning');
			$(this).addClass('icon-selected');
			$(this).siblings('.remove-tag-input').val(tagName);
			updateTagRemoveInput($(this).parents('.tags'));
		}
	});
}

// Updates hidden text field with tags to remove
function updateTagRemoveInput(element) {
	values = [];
	$(element).find('.remove-tag-input').each(function() {
		value = $(this).val();
		values.push(value);
	});
	$(element).find('.remove-tags-values').val(values);
}

// Displays a form to add tags
function addTags() {
	$('.add-tags-title').on('click', function(e) {
		e.stopPropagation();
		var clicked = Number($(this).children('input').val());
		if (clicked) {
			$(this).removeClass('add-tags-selected');
			$(this).children('input').val(0);
			$(this).siblings('.add-tag-field').remove();
			$(this).siblings('.add-tag-submit').remove();
		} else {
			$(this).addClass('add-tags-selected');
			$(this).children('input').val(1);
			var html = '<input class="add-tag-field" maxlength="20" type="text" placeholder="tag"><div class="add-tag-submit btn blue-btn">Add</div>';
			$(this).parent().append(html);
			addTagSubmit($(this).siblings('.add-tag-submit'));
		}
	});
}

// Places tag into staging area to be submitted
function addTagSubmit(element) {
	$(element).on('click', function() {
		var tag = $(element).siblings('.add-tag-field').val();
		if (tag.length > 0) {
			$(this).siblings('.tags-to-be-added').removeClass('hidden');
			var currentVal = $('.add-tags-values').val();
			var html = '<div class="tag-to-be-added"><i class="fa fa-trash-o delete-tag"></i><div class="tag-to-be-added-value">' + tag + '</div></div>';
			$(this).siblings('.tags-to-be-added').append(html);
			$(this).siblings('.add-tag-field').val('');
			var tagsToBeAddedDiv = $(this).siblings('.tags-to-be-added');
			updateAddTagInput(tagsToBeAddedDiv);
			removeAddedTag(tagsToBeAddedDiv);
		}
	});
}

// Removes tag from staging area
function removeAddedTag(element) {
	var deleteIcon = $(element).children('.tag-to-be-added').children('.delete-tag');
	$(deleteIcon).on('click', function() {
		$(this).siblings('.tag-to-be-added-value').text('');
		updateAddTagInput(element);
		$(this).parent().remove();
		var tagsToAdd = $(element).children().length;
		if (tagsToAdd > 1) {
			// Nothing
		} else {
			$(element).addClass('hidden');
		}
	});
}

// Updates hidden text field with tags to add
function updateAddTagInput(element) {
	var tagValues = $(element).children('.tag-to-be-added').children('.tag-to-be-added-value');
	var tagValuesInput = $(element).parent().siblings('.add-tags-values');
	values = [];
	$(tagValues).each(function() {
		value = $(this).text();
		values.push(value);
	});
	$(tagValuesInput).val(values);
}

// Fades in fixed inner nav bar below a certain height
function showInnerNav() {
	$(document).on('scroll', function() {
		var scroll = $(document).scrollTop();
		if (scroll > 390) {
			$('.inner-nav').addClass('inner-nav-fixed');
		} else {
			$('.inner-nav').removeClass('inner-nav-fixed');
		}
	});
}

// Show/hide the Delete Profile form
function deleteProfile() {
	$('.delete-profile-button').on('click', function() {
		$(this).siblings('.edit-profile-delete-wrapper').toggleClass('hidden');
	});
	$('.cancel-delete-profile').on('click', function() {
		$(this).parents('.edit-profile-delete-wrapper').toggleClass('hidden');
	});
}

// Setup/Teardown of grid view
function gridView() {
	$('.display-grid-icon').on('click', function() {
		var isMobile = jQuery.browser.mobile;
		var tagTitle = $(this).parents('.tag-group').children('.tag-title').text();
		var totalGifs = 0;
		$(this).parents('.tag-group').children('.gif-grid-element').each(function() {
			totalGifs += 1;
		});
		var html = '<div class="lightbox grid-wrapper">' +
					'<div class="lightbox-tag-title lobster">' + tagTitle + '<div class="lightbox-gif-count">' + totalGifs + ' GIFs</div></div>' +
					'<div id="grid-cancel" class="lightbox-control lightbox-cancel animate-fast"><i class="fa fa-times"></i></div>' +
					'<div class="lightbox-control lightbox-cancel grid-menu-icon animate-fast"><i class="fa fa-bars"></i>' +
					'<div class="grid-controls hidden"><div class="grid-size-slider lightbox-control animate-fast">' +
					'<input id="grid-slider" type="range" value="10" min="10" max="50" step="10"><div class="lightbox-control-label">GIF Size</div>' +
					'</div><div class="grid-refresh lightbox-control animate-fast"><i class="fa fa-refresh"></i>' +
					'<div class="lightbox-control-label">Refresh Grid</div></div></div></div>' +
					'<div class="lightbox-title pulse"><div class="lobster">Grid</div><div class="pt">View</div></div>' +
					'<div class="grid-view-wrapper"><div class="grid-view-container"></div></div>' +
					'</div>';
		$('body').append(html);
		if (isMobile) {
			$('.grid-menu-icon').on('click', function() {
				$('.grid-controls').toggleClass('hidden');
			});
		} else {
			$('.grid-menu-icon').addClass('desktop-hover');
		}
		var randomnumber = (Math.random() * (COLORS.length - 0 + 1) ) << 0
		var randomnumber1 = (Math.random() * (COLORS.length - 0 + 1) ) << 0
		$('.lightbox-title .lobster').css('color', COLORS[randomnumber]);
		$('.lightbox-tag-title').css('color', COLORS[randomnumber1]);
		$('.lightbox-gif-count').css('color', 'white');
		populateGrid($(this));
		$('#grid-cancel').on('click', function() {
			$('.lightbox').remove();
		});
	});
}

// Grabs images from tag-group div, adds them to generated HTML
function populateGrid(icon) {
	var tagGroup = $(icon).parents('.tag-group');
	var title = tagGroup.find('.tag-title').text();
	var html = '';
	$(tagGroup).find('.gif-grid-element').each(function() {
		var url = $(this).children('.display-url').val();
		var lastPeriod = url.lastIndexOf('.');
		var extension = url.slice(lastPeriod + 1, url.length);
		var title = $(this).children('.gif-label').text();
		if (title.length < 1) {
			var labelClass = 'hidden';
		} else {
			var labelClass = '';
		}
		if (extension === 'gif') {
			var element = '<div class="grid-img-wrapper animate-fast"><img src="' +
							url + '" class="animate"><div class="label grabber-lightbox-label' +
							labelClass + '">' + title + '</div></div>';
		} else if (extension === 'mp4') {
			var element = '<div class="grid-img-wrapper animate-fast"><video src="' +
							url + '" autoplay loop class="animate" poster="../static/img/preload.gif">' +
							'</video><div class="label grabber-lightbox-label' +
							labelClass + '">' + title + '</div></div>';
		}
		html += element;
	});
	$('.grid-view-container').append(html);
	var grid = $('.grid-view-container').isotope({
		itemSelector: '.grid-img-wrapper',
		masonry: {
			columnWidth: '.grid-img-wrapper',
			isFitWidth: true
		}
	});
	grid.isotope('layout');
	gridSlider(grid);
	gridRefresh(grid);
}

// Handles updating image CSS attributes when slider is engaged
function gridSlider(grid) {
	$('#grid-slider').on('input', function() {
		var scaleValue = $(this).val();
		var imgGrid = $(this).parents('.grid-menu-icon').siblings('.grid-view-wrapper').children('.grid-view-container');
		imgGrid.children('.grid-img-wrapper').each(function() {
			$(this).css({
				'width': scaleValue + 'em'
			});
		});
	});
	$('#grid-slider').on('change', function() {
		grid.isotope('layout');
	});
}

// Relayout grid view grid
function gridRefresh(grid) {
	$('.grid-refresh').on('click', function() {
		grid.isotope('layout');
	});
}

// Gif Party Animation Functions below
function makeNewPosition($content) {
	// Get viewport dimensions (remove the dimension of the div)
	var h = $content.height() - 400;
	var w = $content.width() - 300;
	var nh = Math.floor(Math.random() * h);
	var nw = Math.floor(Math.random() * w);
	return [nh, nw];
}

function calcSpeed(prev, next) {
	var x = Math.abs(prev[1] - next[1]);
	var y = Math.abs(prev[0] - next[0]);
	var greatest = x > y ? x : y;
	var speedModifier = 0.1;
	var speed = Math.ceil(greatest / speedModifier);
	return speed;
}

function animateDiv($target) {
	var newq = makeNewPosition($target.parent());
	var oldq = $target.position();
	var speed = calcSpeed([oldq.top, oldq.left], newq);
	$target.animate({
		top: newq[0],
		left: newq[1]
	}, speed, function () {
		animateDiv($target);
	});
}

// Hides/shows party mode wrapper, starts/stop background change interval
function partyModeToggle() {
	$('.party-mode-icon').on('click', function() {
		var totalGifs = 0;
		$(this).parents('.tag-group').children('.gif-grid-element').each(function() {
			totalGifs += 1;
		});
		var tagTitle = $(this).parents('.tag-group').children('.tag-title').text();
		var partyColor = randomColor({format: 'rgb'});
		var rgba = partyColor.slice(0, 3) + 'a' + partyColor.slice(3, partyColor.length - 1) + ', 0.8)';
		var html = '<div class="lightbox party-mode-wrapper animate-slow hidden">' +
					'<div class="lightbox-control lightbox-cancel animate-fast">' +
					'<i class="fa fa-times"></i></div><div class="lightbox-tag-title lobster">' + tagTitle + '<div class="lightbox-gif-count">' + totalGifs + ' GIFs</div></div>' +
					'<div class="lightbox-title pulse"><div class="lobster">Party</div><div class="pt">Mode</div></div>' +
					'<div class="party-mode-container"></div>' +
					'</div>';
		$('body').append(html);
		var randomnumber = (Math.random() * (COLORS.length - 0 + 1) ) << 0
		var randomnumber1 = (Math.random() * (COLORS.length - 0 + 1) ) << 0
		$('.lightbox-title .lobster').css('color', COLORS[randomnumber]);
		$('.lightbox-gif-count').css('color', 'white');
		$('.lightbox-tag-title').css('color', COLORS[randomnumber1]);
		$('.party-mode-wrapper').css('background-color', rgba);
		$('.party-mode-wrapper').removeClass('hidden');
		partyMode($(this).parents('.tag-group'));
		var backgroundChange = setInterval(function() {
			var partyColor = randomColor({format: 'rgb'});
			$('.party-mode-wrapper').css('background-color', partyColor);
		}, 1500);
		$('.lightbox-cancel').on('click', function() {
			$('.party-mode-wrapper').remove();
			clearInterval(backgroundChange);
		});
		manualFocusGif();
		autoFocusGif();
	});
}

// Grabs images from tag group, appends them to the party mode wrapper
function partyMode(tagGroup) {
	var html = '';
	// Grab Display URLs from .gif-grid-elements inside .tag-group
	$(tagGroup).children('.gif-grid-element').each(function() {
		var url = $(this).children('.display-url').val();
		var lastPeriod = url.lastIndexOf('.');
		var extension = url.slice(lastPeriod + 1, url.length);
		var title = $(this).children('.gif-label').text();
		if (title.length < 1) {
			var labelClass = 'hidden';
		} else {
			var labelClass = '';
		}
		if (extension === 'gif') {
			var element = '<div class="party-img-wrapper"><img src="' + url +
						'" class="animate"><div class="label grabber-lightbox-label' +
						labelClass + '">' + title + '</div></div>';
		} else if (extension === 'mp4') {
			var element = '<div class="party-img-wrapper"><video src="' + url +
						'" autoplay loop class="animate" poster="../static/img/preload.gif"></video>' +
						'<div class="label grabber-lightbox-label' + labelClass + '">' + title + '</div></div>';
		}
		html += element;
	});
	$('.party-mode-container').append(html);
	$('.party-mode-container').children('.party-img-wrapper').each(function() {
		animateDiv($(this));
		$(this).draggable({
			start: function(event, ui) {
				$(this).stop();
			},
			stop: function(event, ui) {
				animateDiv($(this));
			}
		});
	});
}

// Quick function to get random element from jQuery collection
$.fn.random = function() {
	return this.eq(Math.floor(Math.random() * this.length));
}

// Function to randomly 'focus' on a GIF in party mode
function autoFocusGif() {
	var active = $('.party-mode-wrapper').hasClass('hidden');
	if (!active) {
		var origDims = {
			'width': '200px',
			'z-index': 13
		}
		var randomGif = $('.party-img-wrapper').random();
		randomGif.addClass('party-focus');
		randomGif.stop().animate({
			'width': '+=25%',
			'z-index': 20
		}, 'slow', function() {animateDiv($(this))});
		setTimeout(function() {
			randomGif.removeClass('party-focus');
			randomGif.stop().animate(origDims, 'slow', function() {animateDiv($(this))});
			autoFocusGif();
		}, 10000);
	} else {
		console.log('Party Mode Deactivated');
	}
}

// Applies focus on click
function manualFocusGif() {
	$('.party-img-wrapper').on('click', function() {
		var alreadyFocused = $(this).hasClass('party-focus');
		if (alreadyFocused) {
			$(this).removeClass('party-focus');
			$(this).stop().animate({
				'width': '200px',
				'z-index': 13
			}, 'slow', function() {animateDiv($(this))});
		} else {
			$(this).addClass('party-focus');
			$(this).stop().animate({
				'width': '+=25%',
				'z-index': 20
			}, 'slow', function() {animateDiv($(this))});
		}
	});

}

// Initializes Cache validation process
function clickValidate() {
	$('.validate-btn').on('click', function(e) {
		var pageTitle = $('title').text();
		var hyphen = pageTitle.lastIndexOf('-');
		var username = pageTitle.slice(0, hyphen - 1);
		e.preventDefault();
		e.stopImmediatePropagation();
		validationSetup();
		ajaxCSRF();
		$.ajax({
			url: '/u/validate/',
			type: 'POST',
			data: {
				'username': username
			},
			success: function(json) {
				validationResults(json);
			},
			error: function(xhr, errmsg, err) {
				console.log('Error!');
				console.log(errmsg);
				console.log(xhr.status + ': ' + xhr.responseText);
			}
		});
	});
}

// Creates container div for validation check
function validationSetup() {
	var html = 	'<div id="validation-loading" class="lightbox">' +
				'<div class="loading"><i class="fa fa-spinner fa-pulse"></i>' +
				'<div>Validating your Cache, one moment please...</div>' +
				'</div></div>';
	$('.validation-container').append(html);
	$('.validation-wrapper').removeClass('hidden');
	$('#validate-submit').on('click', function(e) {
		e.preventDefault();
		updateValidateValues();
		loadingScreen();
		$('#validation-form').submit();
	});
}

// Removes validation container
function validationTeardown() {
	$('.validation-wrapper').addClass('hidden');
	$('.validation-title, .validation-results').remove();
	$('#validate-submit').addClass('hidden');
}

// Creates container div and populates it with results from AJAX call
function validationResults(data) {
	if (data['dupes'].length > 0 || data['404s'].length > 0) {
		$('.validation-container').addClass('validation-expanded');
	}
	var validationTitle = '<div class="validation-title">Validate <div>Cache</div></div><div class="validation-results"></div>';
	$('.validation-container').prepend(validationTitle);
	$('#validation-loading').remove();
	$('.validation-wrapper').on('click', function(e) {
		var target = $(e.target);
		if (!target.is('.validation-wrapper')) {
			// Nothing
		} else {
			validationTeardown();
		}
	});
	// Dupe logic
	var dupes = data['dupes'];
	if (dupes.length > 0) {
		var dupesHtml = '';
		for (i=0; i<dupes.length; i++) {
			var url = dupes[i][1];
			var lastPeriod = url.lastIndexOf('.');
			var extension = url.slice(lastPeriod + 1, url.length);
			var tags = [];
			for (j=0; j<dupes[i][3].length; j++) {
				var tag = dupes[i][3][j];
				tags.push(tag);
			}
			if (extension === 'gif') {
				var image = '<div class="img-wrapper"><img src="' + url + '"></div>';
			} else if (extension === 'gifv') {
				url = url.substring(0, lastPeriod) + '.mp4';
				var image = '<div class="img-wrapper"><video src="' + url + '" preload autoplay loop poster="../static/img/preload.gif"></video></div>';
			}
			if (tags.length > 0) {
				var tagsElement = '<div class="validation-result-tags"><i class="fa fa-tags"></i>' + '<div>' + tags + '</div></div>';
			} else {
				var tagsElement = '';
			}
			var element = '<div class="validation-result animate-fast"><div class="validation-result-inner-wrapper hidden"></div>' +
						'<div class="validation-id hidden">' + dupes[i][0] +
						'</div>' + image + '<div class="validation-label">' + dupes[i][2] +
						'</div>' + tagsElement + '</div>';
			dupesHtml += element
		}
		var finalHtml = '<div class="tag-manager-section"><div class="validation-results-section-title">Duplicates</div>' + dupesHtml + '</div>';
		$('.validation-results').append(finalHtml);
	} else {
		var finalHtml = '<div class="tag-manager-section"><div class="validation-results-section-title">' +
					 'Duplicates</div><div class="no-results">None of your GIFs are duplicates</div>';
		$('.validation-results').append(finalHtml);
	}
	// 404 Logic
	var notFounds = data['404s'];
	if (notFounds.length > 0) {
		var notFoundsHtml = '';
		for (i=0; i<notFounds.length; i++) {
			var label = notFounds[i][2];
			var image = '<div class="img-wrapper" style="max-width: 200px;"><img src="' + notFounds[i][4] +'"></div>';
			var tags = [];
			for (j=0; j<notFounds[i][3].length; j++) {
				var tag = notFounds[i][3][j];
				tags.push(tag);
			}
			if (tags.length > 0) {
				var tagsElement = '<div class="validation-result-tags"><i class="fa fa-tags"></i>' + '<div>' + tags + '</div></div>';
			} else {
				var tagsElement = '';
			}
			var element = '<div class="validation-result animate-fast"><div class="validation-result-inner-wrapper hidden"></div>' +
						'<div class="validation-id hidden">' + notFounds[i][0] +
						'</div>' + image + '<div class="validation-label">' + label +
						'</div>' + tagsElement + '</div>';
			notFoundsHtml += element
		}
		var finalHtml = '<div class="tag-manager-section"><div class="validation-results-section-title">404s</div>' + notFoundsHtml + '</div>';
		$('.validation-results').append(finalHtml);
	} else {
		var finalHtml = '<div class="tag-manager-section"><div class="validation-results-section-title">' +
					 '404s</div><div class="no-results">None of your GIFs 404\'d</div>';
		$('.validation-results').append(finalHtml);
	}
	$('.validation-result').on('click', function() {
		$('#validate-submit').removeClass('hidden');
		var innerWrapper = $(this).children('.validation-result-inner-wrapper');
		innerWrapper.toggleClass('hidden');
		innerWrapper.on('click', function() {
			$(this).toggleClass('hidden');
		});
	});
}

// Upates hidden input with IDs for GIFs to be deleted
function updateValidateValues() {
	var valuesInput = $('#validation-values');
	valuesInput.val('');
	var values = '';
	$('.validation-result').each(function() {
		var wrapper = $(this).children('.validation-result-inner-wrapper');
		if (wrapper.hasClass('hidden')) {
			// Nothing
		} else {
			var resultId = $(this).children('.validation-id').text();
			values += resultId + ',';
		}
	});
	valuesInput.val(values);
}

/***********************************************

	Below: helper functions that I did not write

************************************************/

// Fisher-Yates shuffle algorithm
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

// jQuery.browser.mobile (http://detectmobilebrowser.com/)
// jQuery.browser.mobile will be true if the browser is a mobile device
(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

// Function to lighten/darken HEX color by percentage
// Credit to StackOverflow user Pimp Trizkit
// http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeColor2(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

// jQuery Visible
// https://github.com/customd/jquery-visible
!function(t){var i=t(window);t.fn.visible=function(t,e,o){if(!(this.length<1)){var r=this.length>1?this.eq(0):this,n=r.get(0),f=i.width(),h=i.height(),o=o?o:"both",l=e===!0?n.offsetWidth*n.offsetHeight:!0;if("function"==typeof n.getBoundingClientRect){var g=n.getBoundingClientRect(),u=g.top>=0&&g.top<h,s=g.bottom>0&&g.bottom<=h,c=g.left>=0&&g.left<f,a=g.right>0&&g.right<=f,v=t?u||s:u&&s,b=t?c||a:c&&a;if("both"===o)return l&&v&&b;if("vertical"===o)return l&&v;if("horizontal"===o)return l&&b}else{var d=i.scrollTop(),p=d+h,w=i.scrollLeft(),m=w+f,y=r.offset(),z=y.top,B=z+r.height(),C=y.left,R=C+r.width(),j=t===!0?B:z,q=t===!0?z:B,H=t===!0?R:C,L=t===!0?C:R;if("both"===o)return!!l&&p>=q&&j>=d&&m>=L&&H>=w;if("vertical"===o)return!!l&&p>=q&&j>=d;if("horizontal"===o)return!!l&&m>=L&&H>=w}}}}(jQuery);

// Credit to WearProtection.js || https://gist.github.com/broinjc
function ajaxCSRF() {
	 // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
}