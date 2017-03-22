(function() {

	function editLogPoint() {
		let loggerId = $(this).data('logger-id');
		location.href = '/logpoint/logpoint.html?id=' + loggerId;
	}

	$(document).ready(function() {
		$.getJSON("/log/point", function(data) {
			let logPointList = $('#logpoint-list');
			$.each(data, function(key, value){
				let logPoint = $('<div class="col-xs-6 logpoint" style="color:' + value.color + '" data-logger-id="' + value.loggerId + '"><div class="logpoint-inner"><h1>' + value.loggerId + '</h1><p>' + value.description + '</p></div></div>');
				logPoint.click(editLogPoint);
				logPoint.appendTo(logPointList);
			});
		});

		$('#create-new').click(function() {
			location.href = '/logpoint/logpoint.html';
		});
	});
}());


