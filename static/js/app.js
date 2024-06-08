// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // get the metadata field
    let metadata = data.metadata;
  
    // Filter the metadata for the object with the desired sample number
    let filteredMetadata = metadata.filter(item => item.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filteredMetadata).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });

  });
};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filteredSamples = samples.filter(item => item.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filteredSamples.otu_ids;
    let otu_labels = filteredSamples.otu_labels;
    let sample_values = filteredSamples.sample_values;

    // Build a Bubble Chart
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids
      }
    };

    let bubble_data = [trace1];

    let layout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {
        title: "OTU ID"},
      yaxis: {
        title: "Number of Bacteria"},
      showlegend: false,
      height: 600,
      width: 1200
    };
    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubble_data, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

    let yticks = otu_ids.map(id => `OTU ${id}`);

    // Build a Bar Chart
    let trace2 = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks.slice(0,10).reverse(),
      hovertext: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    };

    let bar_data = [trace2];

    let bar_layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {
        title: "Number of Bacteria"},
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };


    // Render the Bar Chart
    Plotly.newPlot("bar", bar_data, bar_layout);
  });
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    names.forEach((name) => {
      dropdownMenu.append("option")
      .attr("value", name)
      .text(name);
    });

    // Get the first sample from the list
    firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
    });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
