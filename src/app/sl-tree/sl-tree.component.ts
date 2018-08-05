import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'si-sl-tree',
  templateUrl: './sl-tree.component.html',
  styleUrls: ['./sl-tree.component.css']
})

export class SlTreeComponent implements OnInit {

  @ViewChild("ngsvg", {read: ElementRef}) ngsvg: ElementRef;
  
  private margin = {top: 20, right: 120, bottom: 20, left: 120};

  // private _options: { width, height } = { width: 800, height: 600 };
  private width = 960 - this.margin.right - this.margin.left;
  private height = 800 - this.margin.top - this.margin.bottom;

  
  // private tree = d3.tree().size([this.height, this.width]);


  treeData = [
    {
      "name": "Top Level",
      "parent": "null",
      "x0" : 0,
      "y0": 0,
      "children": [
        {
          "name": "Level 2: A",
          "parent": "Top Level",
          "children": [
            {
              "name": "Son of A",
              "parent": "Level 2: A"
            },
            {
              "name": "Daughter of A",
              "parent": "Level 2: A"
            }
          ]
        },
        {
          "name": "Level 2: B",
          "parent": "Top Level"
        }
      ]
    }
  ];

  
  //var links = root.links(); // to get objects with source and target propertie

  private root; // = this.treeData[0];

  private d3svg;
  
  private i = 0;
  private duration = 750;

  

  constructor() { 
    // this.root.x0 = height / 2;
    // root.y0 = 0;
   
  }

  diagonal(d){
    return "M" + d.source.y + "," + d.source.x
        + "C" + (d.source.y + d.target.y) / 2 + "," + d.source.x
        + " " + (d.source.y + d.target.y) / 2 + "," + d.target.x
        + " " + d.target.y + "," + d.target.x;
  
  }

  ngOnInit() {
        // Assigns parent, children, height, depth, etc..
    this.root = d3.hierarchy(this.treeData);

    // Assigns the x and y coordinates for the nodes.
    d3.tree();

    debugger;
    this.d3svg = d3.select(this.ngsvg);
   
    this.update(this.root);

   
  }

  update(source) {
    debugger;
    // Compute the new tree layout.
    // var nodes = this.tree.nodes(this.root).reverse(),
    //   links = this.tree.links(nodes);
     // Returns array of node objects.
     var nodes = this.root.descendants();

     // Returns array of link objects between nodes.
     var links = this.root.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // // Update the nodes…
    // var node = this.d3svg.selectAll("g.node")
    //   .data(nodes, function(d) { return d.id || (d.id = ++this.i); });

    // // Enter any new nodes at the parent's previous position.
    // var nodeEnter = node.enter().append("g")
    //   .attr("class", "node")
    //   .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    //   // .on("click", click);

    // nodeEnter.append("circle")
    //   .attr("r", 1e-6)
    //   .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    // nodeEnter.append("text")
    //   .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
    //   .attr("dy", ".35em")
    //   .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    //   .text(function(d) { return d.name; })
    //   .style("fill-opacity", 1e-6);

    // // Transition nodes to their new position.
    // var nodeUpdate = node.transition()
    //   .duration(this.duration)
    //   .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    // nodeUpdate.select("circle")
    //   .attr("r", 10)
    //   .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    // nodeUpdate.select("text")
    //   .style("fill-opacity", 1);

    // // Transition exiting nodes to the parent's new position.
    // var nodeExit = node.exit().transition()
    //   .duration(this.duration)
    //   .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
    //   .remove();

    // nodeExit.select("circle")
    //   .attr("r", 1e-6);

    // nodeExit.select("text")
    //   .style("fill-opacity", 1e-6);

    // // Update the links…
    // var link = this.d3svg.selectAll("path.link")
    //   .data(links, function(d) { return d.target.id; });

    // // Enter any new links at the parent's previous position.
    // link.enter().insert("path", "g")
    //   .attr("class", "link")
    //   .attr("d", function(d) {
    //   var o = {x: source.x0, y: source.y0};
    //   return this.diagonal({source: o, target: o});
    //   });

    // // Transition links to their new position.
    // link.transition()
    //   .duration(this.duration)
    //   .attr("d", this.diagonal);

    // // Transition exiting nodes to the parent's new position.
    // link.exit().transition()
    //   .duration(this.duration)
    //   .attr("d", function(d) {
    //   var o = {x: source.x, y: source.y};
    //   return this.diagonal({source: o, target: o});
    //   })
    //   .remove();

    // // Stash the old positions for transition.
    // nodes.forEach(function(d) {
    // d.x0 = d.x;
    // d.y0 = d.y;
    // });
  } 

}
