function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((data) => {
  
  
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

  buildGauge(data.WFREQ);
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    

    // buildGauge(data.WFREQ);
//     var data = [{domain: {x: [0, 1], y: [0, 1]}, value: 270, title: {text: "Speed"},
//     type: "indicator", mode: "gauge+number"}];

// var layout = {width: 500, height: 500, margin: {t: 0, b: 0}};
// Plotly.newPlot(gd,data,layout);

 });
}
 

  

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_vals = data.sample_values;

    var bubbleData = [
      {
        x: otu_ids,
        y: sample_vals,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_vals,
          color: otu_ids,
          colorscale: "Earth"
      }
    }
    ];
    console.log("Test")
    Plotly.plot("bubble", bubbleData)
  

// Slice() to grab top 10 sample_values, otu_ids and labels:
results = [];
for (var i = 0; i < data.otu_ids.length; i++){
  results.push(
    {
      "otu_ids": data.otu_ids[i], 
      "otu_labels" : data.otu_labels[i], 
      'sample_values': data.sample_values[i] 
    });
  };
  results.sort((a,b) => b.sample_values - a.sample_values);
  results=results.slice(0,10);
  console.log(results.map(row=> row.sample_values));

// Build the pie chart
var trace1 = [{
  values: results.map(row=> row.sample_values),
  labels: results.map(row=> row.otu_ids),
  hovertext: results.map(row=> row.otu_labels),
  hoverinfo: 'hovertext',
  type: 'pie'
}];
Plotly.plot("pie", trace1);
});
}
  function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
