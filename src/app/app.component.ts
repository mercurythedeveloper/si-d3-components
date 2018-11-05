import { Component, ViewChild } from '@angular/core';

// import { AngularD3TreeLibService } from 'angular-d3-tree-lib';
// import dataTreeSimple from '../assets/data-tree-simple';
// import dataTreeSimple from '../assets/si-sample-location';
import dataTreeSimple2 from '../assets/si-sample-specification-tree';
import *  as SIModel from './interfaces/specificationTree'
import {FormControl, Validators} from '@angular/forms';
import { MatDrawer} from '@angular/material';
import { Constants } from "./classes/constants";
import{ SlTreeComponent } from "./sl-tree/sl-tree.component"



export interface ServiceType {
  name: string;
  type: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data: SIModel.SiTreeStructure;

  @ViewChild('rightmenu') rightmenu: MatDrawer

  @ViewChild('sitree') siTree: SlTreeComponent;

  

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
    this.selectedNode = node;
  }

  selectedParentNode: any;

  nodeAdded(parentNode:any){
    this.selectedParentNode = parentNode;
    
    console.info("app detected add new node: ", parentNode, this.rightmenu);
    
    this.rightmenu.toggle();

    
    if (parentNode.data.type == Constants.RFSS_D3_NODE_TYPE){
      console.debug("nodeAdded for RFS");
      this.serviceTypes = [
        {name: 'RFSS Option 82', type: 'RFSS'}
        ,{name: 'RFSS HomePass', type: 'RFSS'}
        ,{name: 'RFSS Telephone Number', type: 'RFSS'}
        ,{name: 'RFSS IP Address', type: 'RFSS'}
      ];
    }
    else if(parentNode.data.type == Constants.CFSS_D3_NODE_TYPE){
      console.debug("nodeAdded for CFS");
      this.serviceTypes = [
        {name: 'Customer Facing Service Specification', type: 'CFSS'}
        ,{name: 'Customer Facing Service Specification', type: 'CFSS'}
        ,{name: 'Resource Facing Service Specification', type: 'RFSS'}
        ,{name: 'Resource Facing Service Specification', type: 'RFSS'}
        
      ];
    }
   
  }

  addNode(event: any){
    console.debug("addNode");
    console.debug(this.serviceTypeSelectControl.value);
    debugger;
    if(this.serviceTypeSelectControl.value != null && this.serviceTypeSelectControl.value.type == Constants.RFSS_D3_NODE_TYPE ){
      this.siTree.addRFSSNode(this.selectedParentNode, Constants.RFSS_DEFAULT_ICON, this.serviceTypeSelectControl.value.name);
    }
    else if(this.serviceTypeSelectControl.value != null && this.serviceTypeSelectControl.value.type == Constants.CFSS_D3_NODE_TYPE ){
      this.siTree.addCFSSNode(this.selectedParentNode, Constants.RFSS_DEFAULT_ICON, this.serviceTypeSelectControl.value.name);
    }
  }

  serviceTypeSelectControl = new FormControl('', [Validators.required]);
  serviceTypes: ServiceType[] = [
    // {name: 'Resource Facing Service Specification', type: 'RFSS'},
    // {name: 'Customer Facing Service Specification', type: 'CFSS'},
  ];

}
