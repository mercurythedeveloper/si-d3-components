import * as d3 from 'd3';
import { D3LinearTreeNode } from '../interfaces/d3LinearTree';
import { D3TreeDataType } from "../classes/constants";

const SQUARE: string = "square";
const CIRCLE: string = "circle";

const DEFAULT_NODE_ICON: string = "\uf013";;


/* based on http://bl.ocks.org/robschmuecker/7880033 */
export class TreeModel {

  /**
   * Determines if tree nodes can be dragged
   */
  enableNodeDrag: boolean = false;

  /**
   * Determines input data structure; linear vs hierarchical
   */
  treeDataType: D3TreeDataType = D3TreeDataType.Linear;

  // // must be set to true in case of hiearchical JSON input data
  // hierarchicalData: boolean = false;

  /**
   * Root d3 tree node
   */
  root: any;

  /**
   * Tree data received in class constructor
   */
  treeData: any;

  treeLayout: any;
  svg: any;

  

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

  /** 
   *  separation between tree nodes with the same parent node in pixels
  */
  siblingNodeSeparation: number = 20;

  // separation between tree nodes with different parent node in pixels
  nodeSeparation: number = 20;

  dragStarted: boolean;
  draggingNode: any;
  nodes: any[];
  selectedNodeByDrag: any;

  i: number = 0;

  selectedNodeByClick: any;
  previousClickedDomNode: any;

  constructor(){
    //this.treeLevelDistance = treeLevelDistane;
    this.diagonalCurveRatio = 100 * this.treeLevelDistance / 180;
  }

  addSvgToContainer(chartContainer: any){
    // debugger;
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

  /**
   * Called from parent class to start rendeing of the tree
   * @param treeData 
   */
  createTreeData(treeData: any){
    this.treeData = treeData;
    if(this.treeDataType == D3TreeDataType.Hierarchical){
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
    console.info( "collapse: description " + d.data.description)
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
    console.info("update: source.data.id=" + source.data.id);
    // debugger;
    const treeData = this.treeLayout(this.root);

    this.setNodes(source, treeData);

    this.setLinks(source, treeData);

  }

  setNodes(source:any, treeLayout: any){
    let nodes = treeLayout.descendants();
    // debugger;
    let i = 0;
    let treeModel= this;
    let nodeTextX  = this.nodeTextDistanceX;
    let nodeTextY = this.nodeTextDistanceY; 
    

    nodes.forEach((d) => { d.y = d.depth * this.treeLevelDistance});

    
    var node = this.svg.selectAll('g.node')
        .data(nodes
          // // this was causing whole tree to be updated on second level leef expand action
          , function(d) { return d.id = d.data.id; }
        );

    // Set each node g element  
    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        
        
    // This circle marks nodes that have child nodes
    // main node symbol
    nodeEnter.append('path')
        .attr("opacity", (d) =>{                  
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
                          return this.circlePath( this.nodeRadius);
                        else if(d.data.nodeSymbol == SQUARE)
                          return this.rectPath( this.nodeRadius*1.8, this.nodeRadius*1.8);
                        else
                          return this.circlePath( this.nodeRadius);
                      }
            )
          .on("mouseover", function(node) {
                var nodeSelection = d3.select(this);
                // debugger;
                nodeSelection.select(".actionCricle").style( "display", "block")
            })
          .on("mouseout", function(node) {
                var nodeSelection = d3.select(this);
                nodeSelection.select(".actionCricle").style( "display", "none")
            })

    
    // Create context menu for each node
    this.createContextMenu( nodeEnter );

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
                                return this.circlePath( this.nodeRadius);
                              else if(d.data.nodeSymbol == SQUARE)
                                return this.rectPath( this.nodeRadius*2.1, this.nodeRadius*2.1);
                              else
                                return this.circlePath( this.nodeRadius*2);
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

    var nodeExit = node.exit()
    .transition()
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
          console.info("Node click detected..." + d.data.description)
          treeModel.click(d, this);
          treeModel.update(d);
        })
        .on('mouseover', function(d){
          treeModel.mouseover(d, this);
          
        })
        .on('mouseout', function(d){
          treeModel.mouseout(d, this);
          
        });
    }
  }
  
  /**
   * Renders SVG objects that represent tree node context menu
   * with icon buttons for adding new child node, removing node and 
   * opening node details
   * @param nodeEnter 
   */
  createContextMenu( nodeEnter ){
      var parentNode = nodeEnter.append('g')
        .attr( 'class', 'contextMenuG')
        .style("display", "none")
      
      parentNode.append('path')
      .attr( "class", "contextMenu")
      .attr("opacity", (d) =>{
                // debugger;
                return d._children ? "1" : "0.75";  
        } ) 
      .style("fill", "white"
          )
      .style("stroke", (d) => { 
        if (d.data.nodeColor != undefined)
          return d.data.nodeColor;
        else
          return "darkgray";
      })
      .style("stroke-width", "1"
      )
      .style("display", "block"
      )
      .attr('d', (d) => { 
                        return this.rectPath( this.nodeRadius * 3.3, this.nodeRadius * 1.2, this.nodeRadius * 0.75, this.nodeRadius * 0.75);
                    }
          )
          
      parentNode.append('text')
      .attr( "class", "contextMenuIcon")
      .attr('style', 'font-family: FontAwesome')
      .style("fill", (d) => { 
        if (d.data.nodeColor != undefined)
          return d.data.nodeColor;
        else
          return "darkgray";
      })
      .attr('x', this.nodeRadius * 0.9)
      .attr('y', this.nodeRadius * 1.7)
      .style("display", "block")
      .style("cursor", "pointer"
        )
      .text(function(d) { 
        return '\uf1f8';
      })
      .on("click", (node) => {
        // this.addNewTreeNode(node);
        console.info("Node context menu click detected...")
        d3.event.stopPropagation(); 
        this.nodeAddNew(node);
      })
      // .on("mouseout", (node) => {
      //   // this.addNewTreeNode(node);
      //   console.info("Node context menu mouseout detected...")
      //   d3.event.stopPropagation(); 
        
      // });


      parentNode.append('text')
      .attr( "class", "contextMenuIcon")
      .attr('style', 'font-family: FontAwesome')
      .style("fill", (d) => { 
        if (d.data.nodeColor != undefined)
          return d.data.nodeColor;
        else
          return "darkgray";
      })
      .attr('x', this.nodeRadius * 2)
      .attr('y', this.nodeRadius * 1.7)
      .style("display", "block")
      .style("cursor", "pointer"
        )
      .text(function(d) { 
        return '\uf067';
      })
      .on("click", (node) => {
        // this.addNewTreeNode(node);
        console.info("Node context menu click detected...")
        d3.event.stopPropagation(); 
        
      });

      parentNode.append('text')
      .attr( "class", "contextMenuIcon")
      .attr('style', 'font-family: FontAwesome')
      .style("fill", (d) => { 
        if (d.data.nodeColor != undefined)
          return d.data.nodeColor;
        else
          return "darkgray";
      })
      .style("font-weight", "normal")
      // .style("font-fill", "white")
      .attr('x', this.nodeRadius * 2.9)
      .attr('y', this.nodeRadius * 1.7)
      .style("display", "block")
      .style("cursor", "pointer"
        )
      .text(function(d) { 
        return '\uf0ad';
      })
      .on("click", (node) => {
        // this.addNewTreeNode(node);
        console.info("Node context menu click detected...")
        d3.event.stopPropagation(); 
        
      });

  }

  /**
   * Test method for adding new tree node
   * @param parent 
   */
  addNewTreeNode(parent){
    // debugger;
    // var d = {
    //     data :{
    //     description : "new CFS",
    //     id : "101",
    //     // nodeColor : "darkgreen",
    //     icon : "bla",
    //     nodeSymbol : "square",
    //     nodeColor: "red",
    //     parent : parent.id
    //     }
    //     };

    // var d = {id: "999", description: "bla", parent: parent.id, data: {id: "999", description: "bla", parent: parent.id}};
    // var d = {data: {id: "15", description: "bla", parent: parent.id, nodeColor : 'red', nodeSymbol : CIRCLE }};
    var d = {id: "15", description: "bla", parent: parent.id, nodeColor : 'red', nodeSymbol : CIRCLE, nodeICon : 'b' };
      

    try{
      var obj = d3.hierarchy(d) as any;
          obj.data.parent = parent.id;
          obj.depth = parent.depth + 1;
          obj.parent = parent;
          obj.description = d.description;

      d = obj;
    }
    catch(exc){
      console.error("tree.dendo.model-addNewTreeNode: Error transforming D3LinearTreeNode object into d3 tree node.")
    }

    // if (parent.children) 
    //   parent.children.push(d); 
    // else 
    //   parent.children = [d];

    // this.treeData.push(d);
    // this.update(parent);

    if(parent){
      if(parent.children)
        parent.children.push(d);
      else if(parent._children)
        parent._children.push(d);
      else
        parent.children= [d];
      this.update(parent);
    }else{
      this.root.children.push(d);
      this.update(this.root);
    }

    this.nodeAddNew(parent);
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
        .data(links
          // // this was causing whole tree to be updated on second level leef expand action
          // , function(d) { return d.id; }
          , function(d) { return d.id = d.data.id; }
        );

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

        domNode.classList.remove("selected");
    } else {
      d.children = d._children;
      d._children = null;

      domNode.classList.add("selected");
      
    }
    this.selectedNodeByClick= d;
    this.previousClickedDomNode= domNode;
    d3.select(domNode).select('.ghostCircle').attr('class', 'ghostCircle show');
    
    this.nodeselected(d);
  }

  /**
   * Mouse over node event handler
   * Shows node context menu
   * @param d 
   * @param domNode 
   */
  mouseover(d, domNode) {
    // debugger;
    var contextMenu = d3.select(domNode).select('.contextMenuG')
    // var contextMenuIconRemove = d3.select(domNode).select('.contextMenuIconRemove')
    // var contextMenuIconAdd = d3.select(domNode).select('.contextMenuIconAdd')
    // var contextMenuIconDetails = d3.select(domNode).select('.contextMenuIconDetails')
    
    contextMenu.style( 'display', 'block');
    // contextMenuIconRemove.style( 'display', 'block');
    // contextMenuIconAdd.style( 'display', 'block');
    // contextMenuIconDetails.style( 'display', 'block');
  }

  mouseout(d, domNode) {
    // debugger;
    var contextMenu = d3.select(domNode).select('.contextMenuG')
    // var contextMenuIconRemove = d3.select(domNode).select('.contextMenuIconRemove')
    // var contextMenuIconAdd = d3.select(domNode).select('.contextMenuIconAdd')
    // var contextMenuIconDetails = d3.select(domNode).select('.contextMenuIconDetails')

    contextMenu.style( 'display', 'none');
    // contextMenuIconRemove.style( 'display', 'none');
    // contextMenuIconAdd.style( 'display', 'none');
    // contextMenuIconDetails.style( 'display', 'none');
  }

  // Creates a curved (diagonal) path from parent to the child nodes
  diagonalCurvedPath(d, s) {
    return "M" + d.y + "," + d.x
              + "C" + (s.y + this.diagonalCurveRatio) + "," + d.x
              + " " + (s.y + this.diagonalCurveRatio) + "," + s.x
              + " " + s.y + "," + s.x;
  }
  /**
   * Draws rectangel with given width and height. If parameters leftUpperCornerX and laftUpperCornerY are not set
   * rectangle will be postioned in such way so that rectangle center is positioned at 0, 0 coordinate relative to parent
   * svg object
   * svg path
   * Mx,y - move to
   * H - draw horizontal line
   * V - draw vertical line
   * L - draw a line from current position to position ( x, y) defined with following values
   * M10 10 H 90 V 90 H 10 L 10 10
   * @param rectWidth 
   * @param rectHeight 
   * @param leftUpperCornerX 
   * @param leftUpperCornerY 
   */
  rectPath( rectWidth: number, rectHeight: number, leftUpperCornerX: number = -1 * rectWidth / 2, leftUpperCornerY: number = -1 * rectHeight / 2){
  
    let maxX = leftUpperCornerX + rectWidth;
    let maxY = leftUpperCornerY + rectHeight ;
    let minX = leftUpperCornerX;
    let minY = leftUpperCornerY;
    return `M${minX} ${minY} H ${maxX} V ${maxY} H ${minX} L ${minX} ${minY}`;
  }

  /**
   * Calculates SVG path for circle for given circle radius
   * @param radius 
   */
  circlePath( radius: number, centerX: number = 0, centerY: number = 0){
    // a  rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
    //    dx, dy - where the line stroke will end
    //    large-arc-flag. It simply determines if the arc should be greater than or less than 180 degrees; in the end
    // Mx,y - move to
    return `M${-1*radius + centerX},0a${radius},${radius} 0 1,0 ${2*radius},0a${radius},${radius} 0 1,0 ${-2*radius},0`;
  }

  radialPoint(x, y) {
    return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
    
  }

  /**
   * Adds new d3 tree node and re-renders tree. Method assumes that parent node is still selected and reference is kept in selectedNodeByClick
   * @param newNode 
   */
  addNode(newNode: D3LinearTreeNode, parentd3Node: any){

    var newD3Node = this.transformDatatoNode( newNode, parentd3Node );

    if(parentd3Node){
      if(parentd3Node.children)
        parentd3Node.children.push(newD3Node);
      else if(parentd3Node._children)
        parentd3Node._children.push(newD3Node);
      else
        parentd3Node.children= [newD3Node];
      this.update(parentd3Node);
    }else{
      this.root.children.push(newD3Node);
      // this.update(this.root);
    }
  }

  /**
   * Method transforms d3 data node into node that can be added to tree node and rendered properly
   * @param d 
   * @param parentd3Node 
   */
  transformDatatoNode(d: D3LinearTreeNode, parentd3Node: any): any{
    var obj = null;
    try{
      obj = d3.hierarchy(d) as any;
      obj.data.parent = parentd3Node.id;
      obj.depth = parentd3Node.depth + 1;
      obj.parent = parentd3Node;
      obj.description = d.description;
    }
    catch(exc){
      console.error("tree.dendo.model-transformDatatoNode: Error transforming D3LinearTreeNode object into d3 tree node.")
    }
    return obj;
  }

  //events
  nodechanged(node){
    console.info("nodechanged default");
  }

  nodeselected(node){}

  nodeAddNew(node){}

}
