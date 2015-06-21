$(document).ready(function () {
	showEdit();
	showDelete();
	selectTagToRemove();
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
		var selected = Number($(this).siblings('.remove-tag-input').val());
		if (selected) {
			$(this).parent().removeClass('warning');
			$(this).removeClass('icon-selected');
			$(this).siblings('.remove-tag-input').val(0);			
			updateTagRemoveInput($(this).parents('.tags'));
		} else {
			$(this).parent().addClass('warning');
			$(this).addClass('icon-selected');
			$(this).siblings('.remove-tag-input').val(1);		
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