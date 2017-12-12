d3.select(window).on('load', init);

function init() {
    d3.csv(
        'data.csv',
        function(d) {  // This function modifies a column whe loading
            d.frequency *= 100.0;  // Multiplies it by 100
            return d;
        },
        function(error, data) {
            if (error) throw error;  // in case there is an error, it returns an error

            d3.select("#print_each_Line")// pre-selects the div with that id
                .append('ul')  // pre-creates an unoredered list
                .selectAll('li')  // pre-creates all list elements
                .data(data)  // loads data
                .enter()  // Completes the missing data
                .append('li')  // creates the list elements
                .text(function(d){  // inputs to each list element
                    return d.letter+':'+
                        d.frequency;  // A:.08167
                });
        });

    scale_input_value(5);  // this function inputs a vlue within the domain and returns a value
    // in between the range.  // The console returns 50

    create_circles();

    // generate_color_each_element();  // This function prints in the console a color for an element in data

    // padding_flip_axis();
}

// -----------------------------------

    function scale_input_value() {

    var scale = d3.scaleLinear()
        .domain([0,10])
        .range([0,100]);

    console.log(scale(5.));
}

// ------------------------------------
function create_circles() {

    var mydata = [[100, 237, 4],
        [217, 132, 5],
        [160, 110, 7],
        [106, 123, 8]];

    var svg = d3.select("#plot_circles");
    var width = +svg.node().getBoundingClientRect().width;
    var height = +svg.node().getBoundingClientRect().height;

    var xScale = d3.scaleLinear()
        .domain([0,
            d3.max(mydata,  // gets the maximum
                function(d){
                    return d[0];
                })])
        .range([0,width]);

    var yScale = d3.scaleLinear()
        .domain(d3.extent(mydata,  // extend function gets both the minimum and the maximum
            function(d){
                return d[1];
            }))
        .range([0,height]);

    d3.select("#plot_circles")
        .selectAll("circle")
        .data(mydata)
        .enter()
        .append("circle")
        .attr("r", "10px")
        //.attr("r", function(d){
            //return ""+rScale(d[2]);
        //})  // this finction increases the radious

        // .style("fill", function(d){return d3.interpolateYlGn(colorScale(d[2]));})

        .attr("cx", function(d){
            return ""+xScale(d[0])+"px";
        })
        .attr("cy", function(d){
            return ""+yScale(d[1])+"px";
        })

}// ---------------------------------------
function generate_color_each_element() {

    var myData = ['Jan', 'Feb', 'Mar',
        'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep',
        'Oct', 'Nov', 'Dec'];

    // Note that we need to import d3-scale-chromatic
    // in the HTML code in order for d3.schemePaired to work
    var ordinalScale = d3.scaleOrdinal()
        .domain(myData)
        .range(d3.schemePaired);

    console.log(ordinalScale('Jan'));
}

function padding_flip_axis() {

    var mydata = [[100, 237, 4],
        [217, 132, 5],
        [160, 110, 7],
        [106, 123, 8]];

    var svg = d3.select('svg');
    var width = parseFloat(svg.node().style.width);
    var height = parseFloat(svg.node().style.height);

    var padding = 30;

    var xScale = d3.scaleLinear()
        .domain([0,
            d3.max(mydata,
                function(d){
                    return d[0];
                })])
        .range([padding,width-padding]);

    var yScale = d3.scaleLinear()
        .domain([d3.min(mydata,
            function(d){
                return d[1];
            }),
            d3.max(mydata,
                function(d){
                    return d[1];
                })])
        .range([height-padding, padding]);

    d3.select("#plotarea")
        .selectAll("circle")
        .data(mydata)
        .enter()
        .append("circle")
        .attr("r", "10px")
        .attr("cx", function(d){
            return ""+xScale(d[0])+"px";
        })
        .attr("cy", function(d){
            return ""+yScale(d[1])+"px";
        });

    d3.select("#plotarea")
        .append('g')
        .attr('transform', 'translate(0,' + (height - padding) + ')')
        .call(d3.axisBottom(xScale));
    d3.select("#plotarea")
        .append('g')
        .attr('transform', 'translate('+padding+', 0)')
        .call(d3.axisLeft(yScale));

}