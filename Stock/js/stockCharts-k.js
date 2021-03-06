function kChartsDay(){
		$.getJSON('http://www.hcharts.cn/datas/jsonp.php?filename=aapl-ohlcv.json&callback=?', function (data) {
			// split the data set into ohlc and volume
			var ohlc = [];
			var volume = [];
			var test1 = [];
			var test2 = [];
			var test3 = [];
			var dataLength = data.length;
			var groupingUnits = [
				['second', [1]],
				['minute', [1]],
				['hour', [1]],
				['day', [1]],
				['week', [1]],
				['month', [1]],
				['year', [1]]
			];
			var i = 0;
			for (i; i < dataLength; i += 1) {
				ohlc.push([
					data[i][0], // the date
					data[i][1], // open
					data[i][2], // high
					data[i][3], // low
					data[i][4]  // close
				]);
				volume.push([
					data[i][0], // the date
					data[i][5]  // the volume
				]);
				test1.push([
					data[i][0],
					data[i][2],
				]);
				test2.push([
					data[i][0],
					data[i][1],
				]);
				test3.push([
					data[i][0],
					data[i][3],
				]);
			}
			// create the chart
			$('#kChart-day').highcharts('StockChart', {
				rangeSelector: {
					buttons: [{
						type: 'all',
						text: '全部'
					},{
						type: 'year',
						count: 3,
						text: '3年'
					},{
						type: 'year',
						count: 1,
						text: '1年'
					},{
						type: 'ytd',
						text: '今年'
					},{
						type: 'month',
						count: 6,
						text: '6月'
					},{
						type: 'month',
						count: 3,
						text: '3月'
					},{
						type: 'month',
						count: 1,
						text: '1月'
					}],
					buttonTheme:{
						fill: 'none',
						stroke: 'none',
						'stroke-width': 0,
						r: 0,
						style:{
							display: 'block',
							color: '#6d6f71',
							fontWeight: 'normal',
							fontSize: '12px',
							width: '100px',
							height: '30px',
							padding: '0 20px',
							border: '1px solid #d5d7d9',
							background: '#ff0000',
							fill: 'none'
						},
						states: {
							hover: {
							},
							select: {
								fill: '#039',
								style: {
									color: 'white'
								}
							}
						}
					},
					selected: 6,
					enabled: true,
					inputEnabled: false
				},
				title: {
					text: ''
				},
				xAxis: {
					labels:{
						formatter:function(){
							var vDate=new Date(this.value);
							return (vDate.getMonth()+1)+"."+vDate.getDate();
						}
					},
					top:70,
					tickPixelInterval: 100,
				},
				yAxis: [{
					labels: {
						align: 'right',
						x: -3
					},
					title: {
						text: ''
					},
					height: 210,
					tickPixelInterval: 40,
					lineWidth: 2
				},{
					labels: {
						formatter:function() {
							return null;
						}
					},
					title: {
						text: ''
					},
					height: 210,
					tickPixelInterval: 40,
					lineWidth: 2
				},{
					labels: {
						formatter:function() {
							return null;
						}
					},
					title: {
						text: ''
					},
					height: 210,
					tickPixelInterval: 40,
					lineWidth: 2
				},{
					labels: {
						formatter:function() {
							return null;
						}
					},
					title: {
						text: ''
					},
					height: 210,
					tickPixelInterval: 40,
					lineWidth: 2
				},{
					labels: {
						align: 'right',
						x: -3
					},
					title: {
						text: ''
					},
					top: 262,
					height: 60,
					tickPixelInterval: 20,
					offset: 0,
					lineWidth: 2
				}],

				series: [{
					type: 'candlestick',
					name: '',
					data: ohlc,
					dataGrouping: {
						units: groupingUnits
					}
				},{
					type: 'line',
					name: '',
					data: test1,
					yAxis: 1,
					dataGrouping: {
						units: groupingUnits
					}
				},{
					type: 'line',
					name: '',
					data: test2,
					yAxis: 2,
					dataGrouping: {
						units: groupingUnits
					}
				},{
					type: 'line',
					name: '',
					data: test3,
					yAxis: 3,
					dataGrouping: {
						units: groupingUnits
					}
				},{
					type: 'column',
					name: '',
					data: volume,
					yAxis: 4,
					dataGrouping: {
						units: groupingUnits
					}
				}],

				credits: {
					enabled:false
				},
				scrollbar:{
					height:15
				},

				navigator:{
					height:25
				},

				plotOptions: {
					candlestick: {
						color: '#DD2200', //下降块颜色
						lineColor: '#DD2200', //下降块线条颜色
						upColor: '#33AA11', //上升块颜色
						upLineColor: "#33AA11" //上升块线条颜色
					},
					series: {
						marker: {
							enabled: false,
							states: {
								hover: {
									enabled: false
								}
							}
						}
					}
				},
			});
		});
	}