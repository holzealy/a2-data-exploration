$(function() {
    // Read in data
    d3.csv('data/prepped_prev_data.csv', function(error, allData) {
        //track year and sex variables
        var year = '1996';
        var sex = 'Both';
        var type = 'total';

        // Space to put is svg for axes/titles
        var margin = {
            left: 70,
            bottom: 100,
            top: 50,
            right: 50,
        };

        // Height and width of total area
        var height = 600;
        var width = 1000;

        // Height and width of the drawing area
        var drawHeight = height - margin.bottom - margin.top;
        var drawWidth = width - margin.left - margin.right;

        // Append svg to div, setting width and height
        var svg = d3.select('#vis')
            .append('svg')
            .attr('height', height)
            .attr('width', width);
        
        // Append a 'g' element in which to place the bars
        var g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('height', drawHeight)
            .attr('width', drawWidth);

        // Append xAxis label to svg
        var xAxisLabel = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + (drawHeight + margin.top) + ')')
            .attr('class', 'axis');

        // Append yAxis label to svg
        var yAxisLabel = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')');

        // Append text to label xAxis
        var xAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left + drawWidth / 2) + ',' + (drawHeight + margin.top + 80) + ')')
            .attr('class', 'title');

        // Append text to label yAxis
        var yAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left - 40) + ',' + (drawHeight - margin.top) + ') rotate(-90)')
            .attr('class', 'title');

        // Define xAxis
        var xAxis = d3.axisBottom();

        // Define yAxis
        var yAxis = d3.axisLeft()
            .tickFormat(d3.format('.2s'));

        // Define xScale
        var xScale = d3.scaleBand();

        // Define yScale
        var yScale = d3.scaleLinear();
                
        // Add tip
        var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
            return d.state + ": " + d[type] + "%";
        });
        g.call(tip);

        //function to filter data to the current selection based on the current year and sex
        var filterData = function() {
            var currentData = allData.filter(function(d) {
                return d.year == year && d.sex == sex;
            })

            return currentData;
        };

        //function for setting the scales based on the current data selection
        var setScales = function(data) {
            var states = data.map(function(d) {
                return d.state;
            });
            // set xScale
            xScale.range([0, drawWidth])
                .padding(0.1)
                .domain(states);
            // get new yMax
            var yMax = d3.max(data, function(d) {
                return +d[type];
            });
            // set yScale
            yScale.range([drawHeight, 0])
                .domain([0, yMax]);
        }

        // function for updating axis elements (both the axes, and their labels)
        var setAxes = function() {
            // set scales
            xAxis.scale(xScale);
            yAxis.scale(yScale);
            // render axes
            xAxisLabel.transition().duration(1500).call(xAxis)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('transform', 'rotate(-45)');
            yAxisLabel.transition().duration(1500).call(yAxis);
            // update axes text
            xAxisText.text('State');
            yAxisText.text('Percent Smoking (' + sex + ', ' + year + ', ' + type + ')');
        }

        // Function to perform data-join. 
        // Sets scales, updates axes, and re-renders rectangles
        var draw = function(data) {
            setScales(data);
            setAxes();
            // Select all rects and bind data
            var bars = g.selectAll('rect').data(data);

            // Use the .enter() method to get your entering elements, and assign initial positions
            bars.enter().append('rect')
                .attr('x', function(d) {
                    return xScale(d.state);
                })
                .attr('y', function(d) {
                    return drawHeight;
                })
                .attr('height', 0)
                .attr('class', 'bar')
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .attr('width', xScale.bandwidth())
                .merge(bars)
                .transition()
                .duration(500)
                .attr('y', function(d) {
                    return yScale(d[type]);
                })
                .attr('height', function(d) {
                    return drawHeight - yScale(d[type]);
                });

            //remove elements no longer in the data
            bars.exit().remove()
        } 

        // Assigns an event handler to input elements to set the year filter data, and update the chart
        $('select').on('change', function() {
            // Get value
            year = $(this).val();
            // Filter data
            var currentData = filterData();
            // Update chart
            draw(currentData);
        })

        // Assigns an event handler to input elements to set the sex and/or type filter data, and update the chart
        $('input').on('change', function() {
            // Get value
            var val = $(this).val();
            var isSex = $(this).hasClass('sex');
            if (isSex) {
                sex = val;
            } else {
                type = val;
            }
            // Filter data
            var currentData = filterData();
            // Update chart
            draw(currentData);
        });

        //Filter data and update chart
        var currentData = filterData();
        draw(currentData);

    });

});