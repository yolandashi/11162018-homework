function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var url = "/metadata/" + sample;
    d3.json(url).then(function(response) {
      console.log(response);
   
    // Use `.html("") to clear any existing metadata
      metaData = d3.select("#sample-metadata").html(''); 

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.  
        // Append a row to the table body
      var row = metaData.append("div");
  
      // Loop through each field in the dataRow and add
      // each value as a table cell (td)
      Object.entries(response).forEach(([key, value]) => {
        console.log(key, value);
        let cell = row.append("div");
        cell.text(`${key}: ${value}`);
      });
  
    });
  };
       
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
 

function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    // @TODO: Build a Bubble Chart using the sample data
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var pieURL = "/samples/" + sample;
    var list = [];
    d3.json(pieURL).then(function(response) {

      for(i = 0; i < response.sample_values.length; i++) {
        list.push({
          sample_values: response.sample_values[i],
          otu_ids: response.otu_ids[i],
          otu_labels:response.otu_labels[i]
        })
      }

      list.sort(function(first, second){
        return second.sample_values - first.sample_values;
      });

      sortSample = list.slice(0, 10);
      // console.log(sortSample);


      var sortSampleValue = []
      var sortOtuIDs = []
      var sortOtuLables = []

      for(i = 0; i < sortSample.length; i++) {
        {sortSampleValue.push(sortSample[i].sample_values)}
        {sortOtuIDs.push(sortSample[i].otu_ids)}
        {sortOtuLables.push(sortSample[i].otu_labels)}
        }

        // console.log(sortOtuIDs);
        // console.log(sortOtuLables);
        // console.log(sortSampleValue);


      var trace1 = {
        values: sortSampleValue,
        labels: sortOtuIDs,
        type: "pie",
        hovertext: sortOtuLables
      };

      var layout = {
        height: 600,
        width: 800
      };

      var data = [trace1];
    
      Plotly.newPlot("pie", data, layout);
  
  
      var trace2 = {
        x: sortOtuIDs,
        y: sortSampleValue,
        mode: "markers",
        type: "scatter",
        marker: {
          color: sortOtuIDs,
          size: sortSampleValue,
          hovertext: sortOtuLables
        }    
      }

      var layout = {
          height: 600,
          width: 1100,
          xaxis: {title: "OTU ID"}
      };

      var data2 = [trace2];
    
      Plotly.plot("bubble", data2, layout);
      
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
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
