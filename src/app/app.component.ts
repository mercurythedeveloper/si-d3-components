import { Component } from '@angular/core';

// import { AngularD3TreeLibService } from 'angular-d3-tree-lib';
// import dataTreeSimple from '../assets/data-tree-simple';
// import dataTreeSimple from '../assets/si-sample-location';
import dataTreeSimple2 from '../assets/si-sample-specification-tree';
import *  as SIModel from './interfaces/specificationTree'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data: SIModel.SiTreeStructure;

  selectedNode: any;
  constructor() {
    // this.data= dataTreeSimple.result;
    this.data = dataTreeSimple2;

    //// In case of hierarchical data
    //this.data= dataTreeSimple;
  }
  nodeUpdated(node:any){
    console.info("app detected node change");
  }
  nodeSelected(node:any){
    console.info("app detected node selected", node);
    // alert('Node selected: ' + node.id);
    this.selectedNode= node;
  }

  nodeAdded(parentNode:any){
    console.info("app detected add new node", parentNode);
    // this.data.cfsTree.push(
    //   {
    //   name : "new CFS",
    //   id : "101",
    //   // nodeColor : "darkgreen",
    //   icon : "bla",
    //   nodeSymbol : "square",
    //   parent : parentNode.id
    //   }
    // )
   
  }
  

  // addNode():void{
  //   const parent= this.selectedNode? this.selectedNode.id: "1";
  //   const name= window.prompt("new node name");
  //   this.treeService.addNode({id: "999", descripcion: name, parent: parent});
  // }
}
