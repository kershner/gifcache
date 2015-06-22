$(document).ready(function () {
	showEdit();
	showDelete();
	selectTagToRemove();
	addTags();
	tagManagerOptions();
});

function showEdit() {
	$('.edit-icon').on('click', function() {
		var clicked = Number($(this).siblings('.edit-gif-input').val());
		if (clicked) {
			$(this).siblings('.edit-gif-input').val(0);
			$(this).removeClass('icon-selected');
			$(this).siblings('.edit-form').css('display', 'none');
		} else {
			$(this).siblings('.edit-gif-input').val(1);
			$(this).addClass('icon-selected');
			$(this).siblings('.edit-form').css('display', 'block');
		}
	});
}

function showDelete() {
	$('.delete-icon').on('click', function() {
		var clicked = Number($(this).siblings('.delete-gif-input').val());
		if (clicked) {
			$(this).siblings('.delete-gif-input').val(0);
			$(this).removeClass('icon-selected');
			$(this).siblings('.delete-form').css('display', 'none');
		} else {
			$(this).siblings('.delete-gif-input').val(1);
			$(this).addClass('icon-selected');
			$(this).siblings('.delete-form').css('display', 'block');
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
	$('.add-tags-title').on('click', function() {
		var clicked = Number($(this).children('input').val());
		if (clicked) {
			$(this).removeClass('warning');
			$(this).children('input').val(0);
			$(this).siblings('.add-tag-field').remove();
			$(this).siblings('.add-tag-submit').remove();
		} else {
			$(this).addClass('warning');
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
		var clicked = Number($(this).siblings('.tag-rename-input').val());
		var form = $(this).parent().siblings('.tag-manager-form').children('.rename-tag-form');
		if (clicked) {
			$(this).removeClass('selected');
			$(this).siblings('.tag-rename-input').val(0);
			$(form).addClass('hidden');
		} else {
			$(this).addClass('selected');
			$(this).siblings('.tag-rename-input').val(1);		
			$(form).removeClass('hidden');
		}
	});

	$('.delete').on('click', function() {
		var clicked2 = Number($(this).siblings('.tag-delete-input').val());
		var form2 = $(this).parent().siblings('.tag-manager-form').children('.delete-tag-form');
		if (clicked2) {
			$(this).removeClass('selected');
			$(this).siblings('.tag-delete-input').val(0);
			$(form2).addClass('hidden');
		} else {
			$(this).addClass('selected');
			$(this).siblings('.tag-delete-input').val(1);
			$(form2).removeClass('hidden');
		}
		cancelTagDelete();
	});
}

function cancelTagDelete() {
	$('.delete-tag-cancel').on('click', function() {		
		var parentDelete = $(this).parents('.tag-manager-form').siblings('.tag-manager-tag-options').children('.delete');
		var deleteSelect = $(parentDelete).siblings('.tag-delete-input');		
		$(deleteSelect).val(0);
		$(parentDelete).removeClass('selected');
		$(this).siblings('.delete-tag-confirm').removeClass('selected');
		$(this).parent().addClass('hidden');
	});
}