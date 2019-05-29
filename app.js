function buildMetadata(sample) {

  var url = `metadata/${sample}`;
  
  d3.json(url).then(function (sampledata) {
    
    console.log(sampledata);
    var panel = d3.select("#sample-metadata");
    panel.html("");
  
    Object.entries(sampledata).forEach(([key, value]) => 
    
    {
      panel.append("h6").text(`${key}:${value}`);
     })
  });
}

function buildCharts(sample) {
  var url = `/samples/${sample}`;
  d3.json(url).then(function (sampledata)
  
  {
    console.log(sampledata);
    var trace = 
    {
      x: sampledata["otu_ids"],
      y: sampledata["sample_values"],
      text: sampledata["otu_labels"],
      mode: 'markers',
      marker: 
        {
          size: sampledata["sample_values"],
          color: sampledata["otu_ids"],
          colorscale: 'Earth'
        }
    };
  
  var data=[trace];
  var layout = {xaxis: { title: 'OTU ID' }};

  Plotly.newPlot("bubble", data, layout);  

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
