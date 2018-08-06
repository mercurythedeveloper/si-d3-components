import { Component } from '@angular/core';

// import { AngularD3TreeLibService } from 'angular-d3-tree-lib';
import dataTreeSimple from '../assets/data-tree-simple';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data: any[];
  //// in case of hierarchical data
  //data: any;

  selectedNode: any;
  constructor() {
    this.data= dataTreeSimple.result;

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

  // addNode():void{
  //   const parent= this.selectedNode? this.selectedNode.id: "1";
  //   const name= window.prompt("new node name");
  //   this.treeService.addNode({id: "999", descripcion: name, parent: parent});
  // }
}
