// Varibales
var chart, vis;
var width = 500;
var height = 300;
var rawdata, x, y;

// Gets called when the page is loaded.
function init(){
  chart = d3.select('#vis').append('svg');
  vis = chart.attr("width", width)
             .attr("height", height);
}

// Called when the update button is clicked
// Parse CSV and store by selected dropdown value
function updateClicked(){
  if(getXAttribute() == 'GRE Score' && getYAttribute() == 'Chance of Admit')
        d3.csv('data/GradAdmissionsData.csv').then(function(data) {
        rawdata = d3.nest()
        .key(function(d) { 
          return d.gre;
        })
        .rollup(function(d) {
          return d3.mean(d, function(g) {
            return g.cod;
          });
        })    
        .entries(data);
        update(rawdata);
      });
  else if(getXAttribute() == 'Research' && getYAttribute() == 'Chance of Admit') 
        d3.csv('data/GradAdmissionsData.csv').then( function(data) {
        rawdata = d3.nest()
        .key(function(d) { 
          return d.research;
        })
        .rollup(function(d) {
          return d3.mean(d, function(g) {
            return g.cod;
          });
        })    
        .entries(data); 
        update(rawdata);
      });
  else if(getXAttribute() == 'SOP' && getYAttribute() == 'Chance of Admit')
        d3.csv('data/GradAdmissionsData.csv').then( function(data) {
        rawdata = d3.nest()
        .key(function(d) { 
          return d.sop;
        })
        .rollup(function(d) {
          return d3.mean(d, function(g) {
            return g.cod;
          });
        })    
        .entries(data); 
        update(rawdata);
      });
  else if(getXAttribute() == 'GRE Score' && getYAttribute() == 'Student Count')
        d3.csv('data/GradAdmissionsData.csv').then( function(data) {
        rawdata = d3.nest()
        .key(function(d) { 
          return d.gre;
        })
        .rollup(function(values) {
          return values.length; 
        })    
        .entries(data);
        update(rawdata);
      });
  else if(getXAttribute() == 'Research' && getYAttribute() == 'Student Count') 
        d3.csv('data/GradAdmissionsData.csv').then( function(data) {
        rawdata = d3.nest()
        .key(function(d) { 
          return d.research;
        })
        .rollup(function(values) { 
          return values.length; 
        })    
        .entries(data); 
        update(rawdata);
      });
  else if(getXAttribute() == 'SOP' && getYAttribute() == 'Student Count')
        d3.csv('data/GradAdmissionsData.csv').then( function(data) {
        rawdata = d3.nest()
        .key(function(d) {
          return d.sop;
        })
        .rollup(function(values) { 
          return values.length; 
        })    
        .entries(data); 
        update(rawdata);
      });
}

// Callback for when data is loaded
function update(rawdata){

        y = d3.values(rawdata).map(function(d)  {return d.value;});
        x = d3.values(rawdata).map(function(d) {return d.key;});
      
        d3.select('svg').remove();
        chart = d3.select('#vis').append('svg');
        
        vis = chart.attr("width", width + 100)
                   .attr("height", height + 50)
                   .append('g');
        var appending = vis.attr("transform", "translate(50,0)")
                           .selectAll('rect')
                           .data(y)
                           .enter().append('rect');

        // Define height of the bars with respect to the largest value using max and multiplier varibales
        var max = Math.max.apply(null, y);
        var multiplier = max/height; 
        appending.attr("x", function(d, i) {
                                return (3 + i * width / y.length);
                            })
                            .attr("y", function(d) {
                                return (height - (d / multiplier));
                            })
                            .attr("width", width / y.length - 4)
                            .attr("height", function(d) {
                                return 10  + d / multiplier;  
                            })
                            .style("fill", function(d, i) {
                              var color;
                                if(i == 0) {
                                  color = "#003f5c";
                                }
                                else if(i == 1) {
                                  color = "#58508d"; 
                                }
                                else if(i == 2) {
                                  color = "#bc5090";
                                }
				                        else if(i == 3) {
                                  color = "#ff6361";
                                }
                                else {
                                  color = "#ffa600";
                                }
                                return color;
                            });   
                            // Inspiration: https://learnui.design/tools/data-color-picker.html#palette                            
          var xaxisScale = d3.scaleBand()
                             .domain(x)
                             .range([0, width+3]);
          vis.append('g')
             .attr("transform", "translate(0, 310)")
             .call(d3.axisBottom(xaxisScale));

          var yaxisScale = d3.scaleLinear()
                             .domain([max, 0])
                             .range([0, height+10]);
          vis.append('g')
             .call(d3.axisLeft(yaxisScale)
             .ticks(5));           


}

// Returns the selected option in the X-axis dropdown
function getXAttribute(){
  var node = d3.select('#attr_X').node();
  return node[node.selectedIndex].getAttribute('val');
}

// Returns the selected option in the X-axis dropdown
function getYAttribute(){
	var node = d3.select('#attr_Y').node();
	return node[node.selectedIndex].getAttribute('val');
}
