(function() {
	let loggerId = getQueryAsObject().id;

	if(loggerId) {
		$.getJSON('/log/point',{id:loggerId}, function(data) {
			$('#loggerId').replaceWith('<span class="form-control">' + data[0].loggerId + '</span>');
			$('#inputDescription').val(data[0].description);
		});
	} else {
		$('#delete-button').remove();
	}

	function getQueryAsObject() {
		return location.search
		.substring(1)
		.split('&')
		.reduce(function(object, value) {
			let valuePair = value.split('=');
			object[valuePair[0]] = valuePair[1] || decodeURIComponent(valuePair[1]);
			return object;
		}, {});
	}

	$(document).ready(function() {
		if(!loggerId) {
			$('#delete-button').remove();
		}

		$('#ok-button').click(function() {
			let data = {
				id: loggerId || $('#loggerId').val(),
				description: $('#inputDescription').val()
			};

			let method = "POST";
			if(loggerId) {
				method = "PUT";
			}

			$.ajax('/log/point', {
				data:data,
				dataType: "text",
				method: method
			}).done(function() {
				location.href='/logpoints/logpoints.html';
			}).fail(function(ignored, textStatus) {
				alert(textStatus);
			});
		});

		$('#cancel-button').click(function() {
			location.href='/logpoints/logpoints.html';
		});

		$('#delete-button').click(function() {
			$.ajax('/log/point', {
				data:{id:loggerId},
				dataType: "text",
				method: "DELETE"
			}).done(function() {
				location.href='/logpoints/logpoints.html';
			}).fail(function(ignored, textStatus) {
				alert(textStatus);
			});
		})
	});
}());