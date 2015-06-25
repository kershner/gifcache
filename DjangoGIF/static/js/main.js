$(document).ready(function () {
	clickGifElements();
	showDelete();
	showAddForm()
	selectTagToRemove();
	addTags();
	tagManagerOptions();
	hoverGifs();
});


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
		$('.add-gif-form').toggleClass('hidden');
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
			var html = '<div class="tag-to-be-added"><i class="fa fa-trash-o animate delete-tag"></i><div class="tag-to-be-added-value">' + tag + '</div></div>';
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
		$(this).toggleClass('selected');
	});

	$('.delete').on('click', function() {
		var form2 = $(this).parent().siblings('.tag-manager-form').children('.delete-tag-form');
		form2.toggleClass('hidden');
		$(this).toggleClass('selected');
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
			console.log(variable);
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