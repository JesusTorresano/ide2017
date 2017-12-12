// Set up on-load initialization
d3.select(window).on('load', init);


function init() {
    d3.csv('temperaturesKobenhavn.csv',
        function(error, data) {
            if (error) throw error;
            // console.log(data);
            d3.select("#print_each_Line")  // Selects the body
                .append('ul')  // Creates an empty unordered list
                .selectAll('li')  // Creates list elements
                .data(data)  // select the data from data.csv
                .enter()  // Load the data
                .append('li')  // Add a list element
                .text(function(d){  //Add a line at a time from the data.csv into the list element
                        return d.YEAR+':'+ d.metANN;
                });
        });

    bar_plot_example();

}


function bar_plot_example() {
    d3.csv('temperaturesKobenhavn.csv',function(d){
        return {year:d.YEAR, metANN:+parseFloat(d.metANN)};
        },
        function(error, data) {
            if (error) throw error;
             console.log(data);


            var svg = d3.select('#plotbarplot');
            var margin = {top: 100, right: 100, bottom: 100, left: 100};
            var width = +svg.node().getBoundingClientRect().width - margin.left - margin.right;
            var height = +svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

            var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            var x = d3.scaleBand().rangeRound([0, width]).padding(0.1)
                .domain(data.map(function(d) { return d.year; }));

            var y = d3.scaleLinear().rangeRound([height, 0])
                .domain([d3.min(data, function(d) { return d.metANN; }), d3.max(data, function(d) { return d.metANN; })]);
            console.log("y domian: ", d3.max(data, function(d) { return d.metANN; }));

            g.append("g")
                .attr("class", "axis x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            g.append("g")
                .attr("class", "axis y")
                .call(d3.axisLeft(y).ticks(10, "%"));

            g.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar") // Atribute of type class and named bar.
                .attr("x", function(d) { return x(d.year); })
                .attr("y", function(d) { return y(d.metANN); })
                .attr("width", x.bandwidth())
                .attr("height", function(d) { return height - y(d.metANN); });

            console.log("width", x.bandwidth());

            /*d3.select("#print_each_Line")  // Selects the body
                .append('ul')  // Creates an empty unordered list
                .selectAll('li')  // Creates list elements
                .data(data)  // select the data from data.csv
                .enter()  // Load the data
                .append('li')  // Add a list element
                .text(function(d){  //Add a line at a time from the data.csv into the list element
                    return d.YEAR+':'+ d.metANN;
                });*/
        });

}