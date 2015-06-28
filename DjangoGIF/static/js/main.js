$(document).ready(function () {
	clickGifElements();
	showDelete();
	showAddForm()
	selectTagToRemove();
	addTags();
	tagManagerOptions();
	hoverGifs();
	setTimeout(gifMasonry(), 200);
	contentFadeIn();
	showTagManager();
});

function contentFadeIn() {
	$('.nav').toggleClass('hidden');
	$('.profile-info').toggleClass('hidden');
	$('.grids').toggleClass('hidden');
	// $('.nav').fadeIn(300);
	// $('.profile-info').fadeIn(400);
	// $('.grids').fadeIn(600);
}

function showTagManager() {
	$('.tag-settings-icon').on('click', function() {
		$(this).siblings('.tag-manager').toggleClass('hidden');
		$(this).toggleClass('tag-settings-icon-clicked');
	});
}


function clickGifElements() {
	$('.gif-grid-thumbnail').on('click', function() {
		$(this).parent().toggleClass('focused');
		var div = $(this).parent().children().find('.gif-form-title').children(div);
		div.toggleClass('focused');
		$(this).parent().children('.gif-form.edit-form').toggleClass('hidden');
	})
}

function showDelete() {
	$('.delete-icon').on('click', function() {
		$(this).siblings('.gif-form.delete-form').toggleClass('hidden');
		$(this).toggleClass('icon-selected');		
	});
}

function showAddForm() {
	$('.add-gif-form-button').on('click', function() {
		$(this).toggleClass('button-selected');
		$('.add-gif-form').toggleClass('hidden');	
	});

	$('#cancel-add').on('click', function(e) {
		$('.add-gif-form-button').toggleClass('button-selected');
		$('.add-gif-form').toggleClass('hidden');	
	});

	$('.add-gif-form').on('click', function(e) {
		e.preventDefault();
		var target = $(e.target);
		if (target.is('.submit')) {
			$(this).children('form').submit();
		} else if (target.is('form, input, h1')) {
			$('#cancel-add').on('click', function(e) {
				$('.add-gif-form-button').toggleClass('button-selected');
				$('.add-gif-form').toggleClass('hidden');	
			});
		} else {
			$(this).toggleClass('hidden');
			$('.add-gif-form-button').toggleClass('button-selected');
		}
	});
}

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

function updateTagRemoveInput(element) {
	values = [];
	$(element).find('.remove-tag-input').each(function() {
		value = $(this).val();
		values.push(value);
	});
	$(element).find('.remove-tags-values').val(values);
}

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
			var html = '<input class="add-tag-field" type="text" placeholder="tag"><div class="add-tag-submit">Add</div>';
			$(this).parent().append(html);
			addTagSubmit($(this).siblings('.add-tag-submit'));
		}
	});
}

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

function tagManagerOptions() {
	$('.rename').on('click', function() {
		var form = $(this).parent().siblings('.tag-manager-form').children('.rename-tag-form');		
		form.toggleClass('hidden');
		$(this).toggleClass('button-selected');
	});

	$('.delete').on('click', function() {
		var form2 = $(this).parent().siblings('.tag-manager-form').children('.delete-tag-form');
		form2.toggleClass('hidden');
		$(this).toggleClass('delete-selected');
	});
}

function hoverGifs() {
	$('.gif-grid-element').on({		
		mouseenter: function() {			
			var thumbnail = $(this).children('.gif-grid-thumbnail');
			var gifUrl = $(this).children('.gif-url').text();
			var html = '<div class="img-wrapper"><img src="' + gifUrl + '"></div>'
			if ($(this).hasClass('focused')) {
				// Nothing
			} else {
				thumbnail.css({
				'opacity': 0.0
			});
			$(this).prepend(html);
			}
		},
		mouseleave: function() {			
			var variable = $(this).hasClass('focused');
			if ($(this).hasClass('focused')) {
				// Nothing
			} else {
				var thumbnail = $(this).children('.gif-grid-thumbnail');
				thumbnail.css({
					'opacity': 1.0
				});
				$(this).children('.img-wrapper').remove();
			}
		}
	});
}

function gifMasonry() {
	var grid = $('.tag-group').masonry({
		itemSelector: '.gif-grid-element',
		columnWidth: '.gif-grid-element',
		isFitWidth: true
	});

	var taggedGrid = $('#tagged-gif-grid').masonry({
		itemSelector: '.tag-group',
		isFitWidth: true,
		trasitionDuration: '0.1s'
	});
}

//////////////////////////////////////////////////////////////////////////////////
// AJAX example for later reference
function editGifAjax() {
	$('.edit-gif-submit').on('click', function(e) {
		console.log('Clicked!');
		e.preventDefault();

		var gifID = $(this).siblings('.tags').children('.gif-id-field').val();
		var label = $(this).siblings('.gif-label-field').val();
		var tagsToAdd = $(this).siblings('.tags').children('.add-tags-values').val();
		var tagsToRemove = $(this).siblings('.tags').children('.remove-tags-values').val();
		var parent = $(this).parents('.gif-grid-element');

		ajaxCSRF();
		$.ajax({
			url: '/account/edit-gif/',
			type: 'POST',
			data: {
				'gifID': gifID,
				'label': label,
				'tagsToAdd': tagsToAdd,
				'tagsToRemove': tagsToRemove
			},

			success: function(json) {
				if (tagsToAdd.length > 0 || tagsToRemove.length > 0) {					
					// Call function to update tag groups
					console.log('Tags are being added or removed!');
					// updateTaggedGroups();
					// updateGifValues(parent, label);
					var instances = getAllGifElements(gifID);
					updateGifElements(instances, json['html'])
				} else {
					// Update GIF element that was just edited
					console.log('Tags are not being added or removed!');					
					// updateGifValues(parent, label);
					var instances = getAllGifElements(gifID);
					updateGifElements(instances, json['html'])
				}
			},

			error: function(xhr, errmsg, err) {
				console.log('Error!');
				console.log(errmsg);
				console.log(xhr.status + ': ' + xhr.responseText);
			}
		});
	});
}

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