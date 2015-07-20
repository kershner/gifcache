$(document).ready(function () {
	homeFadeIn();
	colorPageElements();
	colorMainForm();
	gifIsotope();
	tagManager();
	showAddForm();
	gifGrabber();
	hoverGifs();
	copyUrl();
	addTags();
	selectTagToRemove();
	bulkOperations();
	showInnerNav();
	deleteProfile();
});

// Fades in elements on the splash page
function homeFadeIn() {
	setTimeout(function() {
		$('.main-logo-gif, .main-logo-cache').css({
			'opacity': '1.0'
		});
	}, 1200);
	setTimeout(function() {
		$('.slogan, #home-links, .home-arrow').css({
			'opacity': '1.0'
		});
	}, 1600);
}

// Picks colors and applies them to various elements on page load
function colorPageElements() {
	var colors = ['#25B972', '#498FBD', '#ff6767', '#FFA533', '#585ec7', '#FF8359'];
	var randomnumber = (Math.random() * (colors.length - 0 + 1) ) << 0
	var counter = randomnumber;
	$('.tag-group').each(function() {
		if (counter > colors.length - 1 ) {
			counter = 0;
		}
		var color = colors[counter];
		$(this).css({
			'background-color': color
		});
		$(this).find('.tag-manager-options-title').css({
			'background-color': color
		});
		$(this).find('.tag-title').css('background-color', color);
		$(this).find('.tag-settings-icon').css('background-color', color);
		$(this).find('.tag-manager-options').css('background-color', color);
		$(this).find('.tag-manager-form form').each(function(){
			$(this).css('background-color', color);
		});
		counter += 1
	});
	$('.nav-logo-circle').css({
		'background-color': colors[randomnumber]
	});
	var profileInfoColor = colors[Math.floor(Math.random() * colors.length)];
	$('.profile-info').css({
		'background-color': profileInfoColor
	});
	$('.profile-avatar img, .profile-avatar video').css({
		'background-color': profileInfoColor
	});
	$('.bulk-option').each(function() {
		var bulkOptionColor = colors[Math.floor(Math.random() * colors.length)];
		$(this).css({
			'border-top': '.15em solid ' + bulkOptionColor
		});
	});
	$('.home-section, .home-whatsnew-version').each(function() {
		if (counter > colors.length - 1 ) {
			counter = 0;
		}
		var homeColor = colors[counter];
		$(this).css({
			'background-color': homeColor
		});
		counter += 1
	});
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
		if (counter > colors.length - 1 ) {
			counter = 0;
		}
		var color = colors[counter];
		$(this).css({
			'background-color': color
		});
		counter += 1
	});
	$('.loading i').css({'color': colors[randomnumber]});
}

// Colors the border-bottom CSS property of the main form elements
function colorMainForm() {
	var colors = ['#25B972', '#498FBD', '#ff6767', '#FFA533', '#585ec7', '#FF8359'];
	var randomnumber = (Math.random() * (colors.length - 1) ) << 0
	var counter = randomnumber;
	$('.main-form, .main-form h1').css({
		'background-color': colors[counter]
	});
	$('.title').css({
		'background-color': colors[counter]
	});
	counter += 1;
	$('.main-field').each(function() {
		if (counter > colors.length - 1 ) {
			counter = 0;
		}
		var color = colors[counter];
		$(this).css({
			'border-bottom': '.3em solid ' + color
		});
		counter += 1
	});
}

// Handles the Isotope grids and sorting
function gifIsotope() {
	var grid = $('.tag-group').isotope({
		itemSelector: '.gif-grid-element',
		masonry: {
			columnWidth: '.gif-grid-element',
			isFitWidth: true
		},
		getSortData: {
			label: '.gif-label'
		}
	});
	var labelClicked = false;
	$('.sort-label').on('click', function() {
		$(this).toggleClass('green-btn-selected');
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
	var dateClicked = false;
	$('.sort-date').on('click', function() {
		$(this).toggleClass('blue-btn-selected');
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
		console.log('Shuffling grids!');
		grid.isotope('shuffle');
	});
	var taggedGrid = $('#tagged-gif-grid').isotope({
		itemSelector: '.tag-group',
		layoutMode: 'packery',
		packery: {
			gutter: 10
		}
	});
}

// Shows/hides the tag manager forms
function tagManager() {
	$('.tag-settings-icon').on('click', function() {
		$(this).siblings('.tag-manager').toggleClass('hidden');
		$(this).toggleClass('tag-settings-icon-clicked');
	});
	$('.rename').on('click', function() {
		var form = $(this).parent().siblings('.tag-manager-form').children('.rename-tag-form');
		form.toggleClass('hidden');
		$(this).toggleClass('green-btn-selected');
	});
	$('.delete').on('click', function() {
		var form2 = $(this).parent().siblings('.tag-manager-form').children('.delete-tag-form');
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
			$('.loading-wrapper').toggleClass('hidden');
			$(this).children('form').submit();
		} else if (target.is('form, input, h1')) {
			// Nothing
		} else {
			$(this).toggleClass('hidden');
			$('.add-gif-form-button').toggleClass('green-btn-selected');
		}
	});
}

function gifGrabber() {
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
		if (target.is('.gifgrabber-submit')) {
			// Nothing
		}
		else if (target.is('form, input, h1, select')) {
			// Nothing
		} else {
			$(this).toggleClass('hidden');
			$('.gifgrabber-btn').toggleClass('red-btn-selected');
		}
	});
}

// Handles AJAX call when GifGrabber form is submitted
function gifGrabberAjax() {
	$('.gifgrabber-submit').on('click', function(e) {
		e.preventDefault();
		var subreddit = $(this).siblings('.subreddit-field').val();
		var maxSize = $(this).siblings('.max-size').val()
		ajaxCSRF();
		$.ajax({
			url: '/u/gifgrabber/',
			type: 'POST',
			data: {
				'subreddit': subreddit,
				'max_size': maxSize
			},
			success: function(json) {
				console.log(json['gifs']);
			},
			error: function(xhr, errmsg, err) {
				console.log('Error!');
				console.log(errmsg);
				console.log(xhr.status + ': ' + xhr.responseText);
			}
		});
	});
}

// Adds HTML element containing full GIF and lays it on top of thumbnail
function hoverGifs() {
	$('.gif-grid-element').on({
		mouseenter: function() {
			var gif = $(this).find('.img-wrapper');
			var thumbnail = $(this).children('.gif-grid-thumbnail');
			var gifUrl = $(this).children('.display-url').val();
			// Check what kind of URL we have
			var isGfycat = gifUrl.includes('gfycat');
			var isGifv = gifUrl.lastIndexOf('.gifv') == gifUrl.length - '.gifv'.length;
			var isMp4 = gifUrl.lastIndexOf('.mp4') == gifUrl.length - '.mp4'.length;
			var isWebm = gifUrl.lastIndexOf('.webm') == gifUrl.length - '.webm'.length;
			if (isGifv || isMp4 || isWebm || isGfycat) {
				var html = '<div class="img-wrapper animate"><video src="' + gifUrl + '" autoplay loop></video></div>'
			} else {
				var html = '<div class="img-wrapper animate"><img src="' + gifUrl + '"></div>'
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
	$('.gif-grid-thumbnail').on('click', function() {
		if (logged_in === 'True') {
			$(this).parent().toggleClass('focused');
			if ($(this).parent().hasClass('focused')) {
    		    $(this).parent().css({
    		        'top': '-=150px'
    		    });
    		} else {
    		   $(this).parent().css({
    		        'top': '+=150px'
    		    });
    		}
		} else {
			$(this).parent().toggleClass('focused');
		}
		var div = $(this).parent().find('.gif-form-title').children(div);
		div.toggleClass('focused');
		$(this).parent().children('.gif-form.edit-form').toggleClass('hidden');

		if ($(this).parent().hasClass('focused')) {
			var colors = ['#25B972', '#498FBD', '#ff6767', '#FFA533', '#585ec7', '#FF8359'];
			var color  = colors[Math.floor(Math.random() * colors.length)];
			$(this).parent().css({
				'background-color': color
			});
			$(this).parent().find('.gif-form-title').css({
				'background-color': color
			});
			$(this).parent().find('.gif-label').css({
				'color': 'white'
			});
		} else {
			$(this).parent().css({
				'border': 'none',
				'background-color': '#e6e6e6'
			});
			$(this).parent().find('.gif-label').css({
				'color': '#4c4c4c'
			});
		}
	});
}

// Scales up GIF once expand icon is clicked
function gifExpand(parent) {
	$(parent).find('.gif-expand').on('click', function(e) {
		$(this).siblings('.img-wrapper').toggleClass('expanded');
	});
	$(parent).find('.img-wrapper').on('click', function(e) {
		e.preventDefault();
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
		$('#bulk-operations .submit').on('click', function() {
			grabBulkValues();
		});
	});
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