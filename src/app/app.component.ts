import { Component } from '@angular/core';

// import { AngularD3TreeLibService } from 'angular-d3-tree-lib';
// import dataTreeSimple from '../assets/data-tree-simple';
// import dataTreeSimple from '../assets/si-sample-location';
import dataTreeSimple2 from '../assets/si-sample-specification-tree';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data: any;

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

  // addNode():void{
  //   const parent= this.selectedNode? this.selectedNode.id: "1";
  //   const name= window.prompt("new node name");
  //   this.treeService.addNode({id: "999", descripcion: name, parent: parent});
  // }
}
