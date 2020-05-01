/*jshint esversion: 6 */

var samples, subjectIDs, metaData, xValue, yValue;

var init = function(){

  d3.json("static/data/samples.json").then((data) => {
  
    samples = data.samples;
    samples.map(sample => sample.id = +sample.id);
    console.log(samples);
  
    subjestIDs = data.names.map(id => +id);
  
    metaData = data.metadata;
    console.log(metaData)
  
    // selDataset dropdown
    var id_dropdown = d3.select("#selDataset");
  
    var idFilter = id_dropdown.selectAll('option').data(subjestIDs).enter()
      .append('option').text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }); // corresponding value returned by the button
  
    showDemoInfo(subjestIDs[0])
    showCharts(subjestIDs[0])
  });
};

var showDemoInfo = function (sampleID) {
  var filtered_metaData = metaData.filter(data => data.id == sampleID);
  var first_metaData = filtered_metaData[0];
  var demo_container = d3.select("#sample-metadata");
  demo_container.selectAll("p").remove()
  Object.entries(first_metaData).forEach(([key, value]) => {
    demo_container.append("p").html(`<b>${key}</b> : ${value}`);
  });
};

var showCharts = function (sampleID) {
  var filtered_samples = samples.filter(sample => sample.id == sampleID);
  var first_sample = filtered_samples[0];

  // horizontal bar chart to display the top 10 OTUs found for selected individual.

  // Use sample_values as the values for the bar chart.
  var sample_values = first_sample.sample_values;

  // Use otu_ids as the labels for the bar chart.
  var otu_ids = first_sample.otu_ids;

  //Use otu_labels as the hovertext for the chart.
  var otu_labels = first_sample.otu_labels;

  xValue = sample_values.slice(0,10).reverse()
  yValue = otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse();
  var labels = otu_labels.slice(0,10).reverse()
  var h_bar_data = [
    {
      type: "bar",
      x: xValue,
      y: yValue,
      hovertext: labels,
      hoverinfo: "text",
      hoverlabel: {
        bgcolor: 'white',
        font: {size:10}
      },
      // textposition: 'auto',
      orientation: "h",
    }
  ];

  var h_bar_layout = {
    margin: { t: 30}
    // showlegend: false
    // font: {size: 12}
  };

  var h_bar_config = {
    responsive: true
    // editable: false,
    // staticPlot: true,
    // displayModeBar: false,
    // displaylogo: false
  };

  Plotly.newPlot("bar-chart", h_bar_data, h_bar_layout, h_bar_config);

  // Create a bubble chart that displays each sample.
  var b_chart_data = [
    {
      mode: "markers",
      x: otu_ids,
      y: sample_values,
      marker: {
        size: sample_values,
        sizeref:1.5,
        // sizemode: 'area',
        color: otu_ids,
        colorscale: "Earth"
      },
      hovertext: labels,
      hoverinfo: "text",
      hoverlabel: {
        bgcolor: 'white',
        font: {size:10}
      }
    }
  ];

  var b_chart_layout = {
    hovermode: "closest",
    xaxis: { title: "OTU ID" },
  };

  Plotly.newPlot("bubble-chart", b_chart_data, b_chart_layout);

};

var optionChanged = function (sampleID) {
  showDemoInfo(sampleID)
  showCharts(sampleID)
};

init();