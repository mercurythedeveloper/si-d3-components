import * as d3 from 'd3';

const SQUARE: string = "square";
const CIRCLE: string = "circle";

const DEFAULT_NODE_ICON: string = "\uf013";;

/* based on http://bl.ocks.org/robschmuecker/7880033 */
export class TreeModel {

  // Configurable Parameters
  enableNodeDrag: boolean = false;

  // must be set to true in case of hiearchical JSON input data
  hierarchicalData: boolean = false;
  // -----------------------
  root: any;
  treeLayout: any;
  svg: any;

  treeData: any;

  height: number;
  width: number;
  margin: any = { top: 200, bottom: 90, left: 100, right: 90};
  duration: number= 750;
  nodeWidth: number = 1;
  nodeHeight: number = 1;
  nodeRadius: number = 10;
  horizontalSeparationBetweenNodes: number = 5;
  verticalSeparationBetweenNodes: number = -1;

  // vertical distance between node and underlying text
  nodeTextDistanceY: string = "25px";

  // horizontal distance between node and undelying text
  nodeTextDistanceX: number = 0;

  // the distance between tree levels
  treeLevelDistance: number = 130;

  // parameter that dtermines correct calculation of tree node link curve rendering
  // calculated in constructor from treeLevelDistance
  diagonalCurveRatio: number = 100;

  // separation between tree nodes with the same parent node in pixels
  siblingNodeSeparation: number = 20;

  // separation between tree nodes with different parent node in pixels
  nodeSeparation: number = 20;

  dragStarted: boolean;
  draggingNode: any;
  nodes: any[];
  selectedNodeByDrag: any;

  selectedNodeByClick: any;
  previousClickedDomNode: any;

  constructor(){
    //this.treeLevelDistance = treeLevelDistane;
    this.diagonalCurveRatio = 100 * this.treeLevelDistance / 180;
  }

  addSvgToContainer(chartContainer: any){
    let element = chartContainer.nativeElement;

    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    

    this.svg = d3.select(element).append('svg')
      .data(d3.entries(
        {"top-to-bottom": {
          size: [50, 50],
          x: function(d) { return d.x; },
          y: function(d) { return d.y; }
        }
      })
      )
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight)
      .append("g")
      .attr("transform", "translate("
            + this.margin.left + "," + this.margin.top + ")");

    this.setZoomBehaviour();
  }

  setZoomBehaviour() {
    const zoom= d3.zoom().on("zoom", zoomed );
    const svg= d3.select("svg");

    var t = d3.zoomIdentity.translate(this.margin.left, this.margin.top);
    svg.call(zoom.transform, t);
    svg.call(zoom);
    function zoomed(){
      var transform= d3.event.transform;
      d3.select("g").attr("transform", d3.event.transform);
    }
  }

  createLayout(){
    this.treeLayout = d3.tree()
      .size([this.height, this.width])
      .nodeSize([this.nodeWidth + this.horizontalSeparationBetweenNodes, this.nodeHeight + this.verticalSeparationBetweenNodes])
      .separation((a,b)=>{return a.parent == b.parent ? this.siblingNodeSeparation : this.nodeSeparation});
  }

  createTreeData(treeData: any){
    if(this.hierarchicalData){
      this.root = d3.hierarchy(treeData);
    }
    else{
      this.root = d3.stratify<any>()
            // define data structure attribute that represets unique node identifier
            .id(function(d) { return d.id; })
            // define data strucutre attribute that represet parent node identifier 
            .parentId(function(d) { return d.parent; })
            (treeData)  ;
    }
    
    this.root.x0 = this.height / 2;
    this.root.y0 = 0;

    this.root.children.map((d)=>this.collapse(d));
  }

  collapse(d) {
    if(d.children) {
      d._children = d.children
      d._children.map((d)=>this.collapse(d));
      d.children = null
    }
  }

  expand(d) {
    if(d._children) {
      d.children = d._children
      d.children.map((d)=>this.expand(d));
      d.children = null
    }
  }

  expandAndFixHeight(d, newParent) {
    d.height= newParent.height-1;
    d.depth= newParent.depth+1;

    if(d._children){
      d.children= d._children;
      d._children= null;
    }
    if(d.children) {
      d.children.map((child)=>this.expandAndFixHeight(child, d));
    }
  }

  update(source) {
    const treeData = this.treeLayout(this.root);

    this.setNodes(source, treeData);

    this.setLinks(source, treeData);

  }

  setNodes(source:any, treeData: any){
    let nodes = treeData.descendants();
    let i = 0;
    let treeModel= this;
    let nodeTextX  = this.nodeTextDistanceX;
    let nodeTextY = this.nodeTextDistanceY; 
    

    nodes.forEach((d) => { d.y = d.depth * this.treeLevelDistance});

    
    var node = this.svg.selectAll('g.node')
        .data(nodes, function(d) {return d.id || (d.id = ++this.i); });

    // Set each node g element  
    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        
        
    // This circle marks nodes that have child nodes
    nodeEnter.append('path')
        .attr("opacity", (d) =>{
                  // debugger;
                  return d._children ? "1" : "0.75";  
          } ) 
        .style("fill", (d) => { 
                        if (d.data.nodeColor != undefined)
                          return d.data.nodeColor;
                        else
                          return "darkgray";
                      }
            )
        .style("stroke", (d) => { 
              if (d.data.nodeColor != undefined)
                return d.data.nodeColor;
              else
                return "darkgray";
            }
        )
        .attr('d', (d) => { 
                        if (d.data.nodeSymbol == CIRCLE)
                          return this.rectCircle( this.nodeRadius);
                        else if(d.data.nodeSymbol == SQUARE)
                          return this.rectPath( this.nodeRadius*1.8, this.nodeRadius*1.8);
                        else
                          return this.rectCircle( this.nodeRadius);
                      }
            )


    // Node Icon
    nodeEnter.append('text')
        .attr('style', 'font-family: FontAwesome')
        .attr('class', 'nodeIcon')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('x', '0')
        .attr('y', '0')
        // .attr('font-size', function(d) { return d.size+'em'} )
        .text(function(d) { 
                // debugger;
                if( d.data.hasOwnProperty('nodeIcon')){
                  return d.data.nodeIcon;
                }
                else{
                  return DEFAULT_NODE_ICON;
                }
        }); 

    // show node text left in case node has children, show right in case node has no children
    nodeEnter.append('text')
        .attr('class', 'node text')
        .attr("dy", nodeTextY )
        .attr("dx", function(d) {
          
            return  nodeTextX * (d.children || d._children ? -1 : 1);
        }  )
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d){
              return d.data.name || d.data.description || d.id;
            })
            
            ;
    
      // This circle is node hover symbol circle    
      nodeEnter.append("path")
          .attr('class', 'ghostCircle')
          .attr("opacity", 0.2) // change this to zero to hide the target area
          .style("fill", (d) => { 
                              if (d.data.nodeColor != undefined)
                                return d.data.nodeColor;
                              else
                                return "darkgray";
                            }
          )
          .attr('pointer-events', 'mouseover')
          .attr('d', (d) => { 
                              if (d.data.nodeSymbol == CIRCLE)
                                return this.rectCircle( this.nodeRadius*2);
                              else if(d.data.nodeSymbol == SQUARE)
                                return this.rectPath( this.nodeRadius*2.8, this.nodeRadius*2.8);
                              else
                                return this.rectCircle( this.nodeRadius*2);
                            }
          )
          .on("mouseover", function(node) {
              treeModel.overCircle(node);
              this.classList.add("over");
          })
          .on("mouseout", function(node) {
              treeModel.outCircle(node);
              this.classList.remove("over");
          });

      

    var nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
      .duration(this.duration)
      .attr("transform", function(d) {
          return "translate(" + d.y + "," + d.x + ")";
       });

    // Mark nodes that are not expanded and have child nodes
    nodeUpdate.select('path')
      .attr('r', this.nodeRadius)
      .attr("opacity", (d) =>{
        return d._children ? "1" : "0.75";  
      } ) 
      .attr('cursor', 'pointer');

    var nodeExit = node.exit().transition()
        .duration(this.duration)
        .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('path')
      .attr('r', 1e-6);

    // Store the old positions for transition.
    nodes.forEach(function(d){
      d.x0 = d.x;
      d.y0 = d.y;
    });
    
    // On exit reduce the opacity of text labels
    nodeExit.select('text')
      .style('fill-opacity', 1e-6);
      // .style('color', 'red');

    
    if(this.enableNodeDrag){
      nodeEnter
        .call(this.dragBehaviour())
        .on('click', function(d){
          treeModel.click(d, this);
          treeModel.update(d);
        });
    }
    else{
      nodeEnter
        .on('click', function(d){
          treeModel.click(d, this);
          treeModel.update(d);
        });
    }
  }

  dragBehaviour(){
    let treeModel= this;
    function subject(d) {
        return { x: d3.event.x, y: d3.event.y }
    };
    function dragStart(d){
      treeModel.draggingNode= d;
      d3.select(this).classed("active", true);

      d3.select(this).select('.ghostCircle').attr('pointer-events', 'none');
      d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');

      treeModel.nodes= d.descendants();
      treeModel.dragStarted= true;

    }

    function dragged(d){
      d3.select(this)
        .attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");

      if(treeModel.dragStarted){
        treeModel.svg.selectAll("g.node").sort((a, b) => { // select the parent and sort the path's
            if (a.id != treeModel.draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
            else return -1; // a is the hovered element, bring "a" to the front
        });

        // if nodes has children, remove the links and nodes
        const childs= d.descendants();
        if (childs.length > 1) {
            // remove link paths
            let links = d.links();
            treeModel.svg.selectAll('path.link').filter(function(d, i) {
                  if (d.id == treeModel.draggingNode.id) {
                      return true;
                  }
                  return false;
              }).remove();

            // remove child nodes
            let nodesExit = treeModel.svg.selectAll("g.node")
                .data(treeModel.nodes, function(d) {
                    return d.id;
                }).filter(function(d, i) {
                    if (d.id == treeModel.draggingNode.id) {
                        return false;
                    }
                    return true;
                }).remove();
        }

        // remove parent link
        const parentLink = d.links(d.parent.descendants());
        treeModel.svg.selectAll('path.link').filter(function(d, i) {
            if (d.id == treeModel.draggingNode.id) {
                return true;
            }
            return false;
        }).remove();

        treeModel.dragStarted = false;
      }

    }

    function dragEnd(d){
      d3.select(this).classed("active", false);

      d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
      d3.select(this).attr('class', 'node');

      if (d == treeModel.root) {
          return;
      }
      let domNode = this;
      if (treeModel.selectedNodeByDrag) {
          // now remove the element from the parent, and insert it into the new elements children
          var index = treeModel.draggingNode.parent.children.indexOf(treeModel.draggingNode);
          if (index > -1) {
              treeModel.draggingNode.parent.children.splice(index, 1);
          }
          if (treeModel.selectedNodeByDrag.children != null || treeModel.selectedNodeByDrag._children != null ) {
              if (treeModel.selectedNodeByDrag.children != null ) {
                  treeModel.selectedNodeByDrag.children.push(treeModel.draggingNode);
              } else {
                  treeModel.selectedNodeByDrag._children.push(treeModel.draggingNode);
              }
          } else {
              treeModel.selectedNodeByDrag.children = [treeModel.draggingNode];
          }
          //set new parent
          treeModel.draggingNode.parent= treeModel.selectedNodeByDrag;
          // Make sure that the node being added to is expanded so user can see added node is correctly moved
          treeModel.expandAndFixHeight(treeModel.draggingNode, treeModel.selectedNodeByDrag);
          //sortTree();
          treeModel.nodechanged(treeModel.draggingNode);
          endDrag(domNode);
      } else {
          endDrag(domNode);
      }
    }

    function endDrag(domNode) {
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
        d3.select(domNode).attr('class', 'node');
        // now restore the mouseover event or we won't be able to drag a 2nd time
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');

        if (treeModel.draggingNode !== null) {
            treeModel.update(treeModel.root);
            //centerNode(treeModel.draggingNode);
            treeModel.draggingNode = null;
        }

        treeModel.selectedNodeByDrag = null;
    }

    return d3.drag()
            .subject(subject)
            .on("start", dragStart)
            .on("drag", dragged)
            .on("end", dragEnd);
  }

  overCircle(d) {
      this.selectedNodeByDrag = d;
  };
  outCircle(d) {
      this.selectedNodeByDrag = null;
  };

  setLinks( source: any, treeData: any){
    let links = treeData.descendants().slice(1);
    var link = this.svg.selectAll('path.link')
        .data(links, function(d) { return d.id; });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', (d)=>{
          var o = {x: source.x0, y: source.y0}
          return this.diagonalCurvedPath(o, o)
        });

    var linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
        .duration(this.duration)
        .attr('d', (d)=>{return this.diagonalCurvedPath(d, d.parent)});

    var linkExit = link.exit().transition()
        .duration(this.duration)
        .attr('d', (d) => {
          var o = {x: source.x, y: source.y}
          return this.diagonalCurvedPath(o, o)
        })
        .remove();
  }

  click(d, domNode) {
    // debugger;
    if(this.previousClickedDomNode){
      // this.previousClickedDomNode.classList.remove("selected");
      d3.select(this.previousClickedDomNode).select('.ghostCircle').attr('class', 'ghostCircle');
    }
    if (d.children) {
        d._children = d.children;
        d.children = null;

        // domNode.classList.remove("selected");
    } else {
      d.children = d._children;
      d._children = null;

      // domNode.classList.add("selected");
      
    }
    this.selectedNodeByClick= d;
    this.previousClickedDomNode= domNode;
    d3.select(domNode).select('.ghostCircle').attr('class', 'ghostCircle show');
    this.nodeselected(d);
  }

  // Creates a curved (diagonal) path from parent to the child nodes
  diagonalCurvedPath(d, s) {
    return "M" + d.y + "," + d.x
              + "C" + (s.y + this.diagonalCurveRatio) + "," + d.x
              + " " + (s.y + this.diagonalCurveRatio) + "," + s.x
              + " " + s.y + "," + s.x;
  }

  rectPath( rectWidth: number, rectHeight: number){
    // svg path
    // Mx,y - move to
    // H - draw horizontal line
    // V - draw vertical line
    // L - draw a line from current position to position ( x, y) defined with following values
    // M10 10 H 90 V 90 H 10 L 10 10
    let maxX = rectWidth / 2;
    let maxY = rectHeight / 2;
    let minX = -1 * maxX;
    let minY = -1 * maxY;
    return `M${minX} ${minY} H ${maxX} V ${maxY} H ${minX} L ${minX} ${minY}`;
  }

  rectCircle( radius: number){
    // a  rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
    //    dx, dy - where the line stroke will end
    //    large-arc-flag. It simply determines if the arc should be greater than or less than 180 degrees; in the end
    // Mx,y - move to
    return `M${-1*radius},0a${radius},${radius} 0 1,0 ${2*radius},0a${radius},${radius} 0 1,0 ${-2*radius},0`;
  }

  radialPoint(x, y) {
    return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
    
  }

  addNode(newNode: any){
    if(this.selectedNodeByClick){
      if(this.selectedNodeByClick.children)
        this.selectedNodeByClick.children.push(newNode);
      else if(this.selectedNodeByClick._children)
        this.selectedNodeByClick._children.push(newNode);
      else
        this.selectedNodeByClick.children= [newNode];
      this.update(this.selectedNodeByClick);
    }else{
      this.root.children.push(newNode);
      this.update(this.root);
    }
  }

  //events
  nodechanged(node){
    console.info("nodechanged default");
  }

  nodeselected(node){}

}
