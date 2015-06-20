$(document).ready(function () {
	showEdit();
	showDelete();
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