(function() {
	function pad(number) {
		if (number < 10) {
			return '0' + number;
		}
		return number;
	}

	function reformat(time) {
		let date = new Date(time);
		return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate()) + ' ' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes());
	}

	$(document).ready(function() {
		let ctx = document.getElementById("myChart").getContext("2d");
		let datasets = [];
		$.getJSON("/log/point", function(data) {
			let logDataRequests = [];
			$.each(data, function(key, value){
				let logPoint = {};
				logPoint.label = value.loggerId;
				logPoint.borderColor = value.color;
				logPoint.data = [];
				datasets.push(logPoint);
				logDataRequests.push($.getJSON("/log/data", {id:value.loggerId}, function(data) {
					$.each(data, function(key, value) {
						logPoint.data.push({x:reformat(value.time),y:value.data});
					});
				}));
			});
			$.when.apply($, logDataRequests).then(function() {
				var myChart = new Chart(ctx, {
					type: 'line',
					data: {
						datasets: datasets
					},
					options: {
						responsive:false,
						scales: {
							xAxes: [{
								type: 'time',
								time: {
									minUnit: 'day',
									displayFormats: {
										day: 'YYYY-MM-DD HH:mm'
									}
								}
							}],
							yAxes: [{
								ticks: {
									beginAtZero:true
								}
							}]
						}
					}
				});
			});
		});
	});

}());