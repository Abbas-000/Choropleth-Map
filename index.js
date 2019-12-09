var width = 960;
var height = 650;


var title = d3.select(".heading").append("h1").text("United States Educational Attainment").attr("id", "title");
var description = d3.select(".heading").append("h3").text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)").attr("id", "description");

var toolTip = d3.select("body").append("div").attr("id", "tooltip");

var svg = d3.select(".map").append("svg").attr("width", width).attr("height", height);
var pathGen = d3.geoPath().projection(null);


Promise.all([d3.json("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"), d3.json("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json")]).then((allData) => {

  [usData, eduData] = allData;
  var colors = ["hsl(114, 30%, 55%)", "hsl(114, 30%, 49.3%)", "hsl(114, 30%, 43.6%)", "hsl(114, 30%, 37.9%)", "hsl(114, 30%, 32.2%)", "hsl(114, 30%, 26.5%)", "hsl(114, 30%, 20.8%)", "hsl(114, 30%, 15%)"];
  var educationRate = [15, 30, 45, 60, 75];

  var fillColor = d3.scaleQuantize().domain(d3.extent(eduData, d => d.bachelorsOrHigher)).range(colors);

  var states = topojson.feature(usData, usData.objects.counties);

  var paths = svg.selectAll("path").data(states.features).enter().append("path").classed("county", true).attr("d", pathGen).on("mousemove", (d) => {
    var tooltipDataObj = find(d);
    toolTip.html(`<p> ${tooltipDataObj.area_name}, ${tooltipDataObj.state}, ${tooltipDataObj.bachelorsOrHigher}% </p>`);
    toolTip.attr("data-education", d => tooltipDataObj.bachelorsOrHigher)
    toolTip.style("display", "inline-block")
           .style("left", (d3.event.pageX + 6) + "px")
           .style("top", (d3.event.pageY + 8) + "px");
  }).on("mouseout", (d) => {
    toolTip.style("display", "none");
  }).attr("data-fips", d => find(d).fips).attr("data-education", d => find(d).bachelorsOrHigher).attr("fill", (d, i) => fillColor(find(d).bachelorsOrHigher));


  var legendG = d3.select("#legend svg").append("g");
  legendG.selectAll("rect").data(educationRate).enter().append("rect").attr("width", 30).attr("height", 14).attr("x", (d,i) => i * 30 + 30).attr("y", 8).attr("rx", 8).attr("ry", 8).style("fill", d => fillColor(d));
  legendG.selectAll("text").data(educationRate).enter().append("text").attr("x", (d,i) => i * 30 + 30).attr("y", 40).text(d => `≤${d} `)


  function find(d) {
    var found = eduData.find(obj => obj.fips == d.id);
    return found;
  }

})
