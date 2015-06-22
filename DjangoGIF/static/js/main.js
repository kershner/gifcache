$(document).ready(function () {
	showEdit();
	showDelete();
	selectTagToRemove();
	addTags();
});

function showEdit() {
	$('.edit-icon').on('click', function() {
		$(this).css('color', '#99d0e0')
		$(this).siblings('.edit-form').css('display', 'block');
		$(this).on('click', function() {
			$(this).css('color', '#4d4d4d')
			$(this).siblings('.edit-form').css('display', 'none');
			showEdit();
		});
	})
}

function showDelete() {
	$('.delete-icon').on('click', function() {
		$(this).siblings('.delete-form').children('.cancel').on('click', function() {
			$(this).parent().siblings('.delete-icon').css('color', '#4d4d4d')
			$(this).parent('.delete-form').css('display', 'none');			
			showDelete();
		});
		$(this).css('color', '#ff6767')
		$(this).siblings('.delete-form').css('display', 'block');
		$(this).on('click', function() {
			$(this).css('color', '#4d4d4d')
			$(this).siblings('.delete-form').css('display', 'none');			
			showDelete();
		});
	})
}

function selectTagToRemove() {	
	$('.tag').children('.delete-tag').on('click', function() {
		var tagName = $(this).siblings('.tag-name').text();
		var selected = Number($(this).siblings('.remove-tag-input').val());
		console.log(selected);
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
	console.log(element);
	$(element).on('click', function() {
		var tag = $(element).siblings('.add-tag-field').val();
		if (tag.length > 0) {
			var currentVal = $('.add-tags-values').val();
			$('.add-tags-values').val(currentVal + tag + ' ');
		}
	});
}