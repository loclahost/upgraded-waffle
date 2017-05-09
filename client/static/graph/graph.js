(function() {
	let myChart;

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

	function setupDateIntervalls() {
		let select = $('#inputStartIntervall');
		let oneDay = new Date();
		oneDay.setDate(oneDay.getDate() - 1);
		select.append('<option value="' + oneDay.getTime() + '">One day</option>');

		let oneWeek = new Date();
		oneWeek.setDate(oneWeek.getDate() - 7);
		select.append('<option value="' + oneWeek.getTime() + '" selected="selected">One week</option>');

		let oneMonth = new Date();
		oneMonth.setMonth(oneMonth.getMonth() - 1);
		select.append('<option value="' + oneMonth.getTime() + '">One month</option>');

		let oneYear = new Date();
		oneYear.setFullYear(oneYear.getFullYear()  - 1);
		select.append('<option value="' + oneYear.getTime() + '">One year</option>');

		select.change(function() {
			updateDataPoints();
		});
	}

	function createChart() {
		myChart = new Chart(document.getElementById("myChart").getContext("2d"), {
			type: 'line',
			data: {
				datasets: []
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
	}

	function updateDataPoints() {
		let selectedIntervallStart = $('#inputStartIntervall').val();
		let datasets = [];
		$.getJSON("/log/point", function(data) {
			let logDataRequests = [];
			$.each(data, function(key, value){
				let logPoint = {};
				logPoint.label = value.loggerId;
				logPoint.borderColor = value.color;
				logPoint.data = [];
				datasets.push(logPoint);
				logDataRequests.push($.getJSON("/log/data", {id:value.loggerId, start_intervall: selectedIntervallStart}, function(data) {
					$.each(data, function(key, value) {
						logPoint.data.push({x:reformat(value.time),y:value.data});
					});
				}));
			});
			$.when.apply($, logDataRequests).then(function() {
				myChart.config.data.datasets = datasets;
				myChart.update();
			});
		});
	}

	$(document).ready(function() {
		setupDateIntervalls();
		createChart();
		updateDataPoints();



	});

}());