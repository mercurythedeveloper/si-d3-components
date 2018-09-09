import { Component, OnInit, ViewChild, ElementRef, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { TreeModel } from './tree.dendo.model';

import { AngularD3TreeLibService } from './angular-d3-tree-lib.service';
import *  as SIModel from '../interfaces/specificationTree'
import { D3LinearTree, D3LinearTreeNode } from '../interfaces/d3LinearTree'
import { D3TreeDataType } from "../classes/constants";




@Component({
  selector: 'si-sl-tree',
  template: `
  <div
      class="d3-chart"
      #chart></div>
  `,
  styleUrls: [ './sl-tree.component.css']
})
export class SlTreeComponent implements OnInit, OnChanges {

  @ViewChild("chart", {read: ElementRef}) chartContainer: ElementRef;
  @Output() onNodeChanged: EventEmitter<any>= new EventEmitter();
  @Output() onNodeSelected: EventEmitter<any>= new EventEmitter();

  /**
   * Handle add node event triggered by context menu add button (icon)
   */
  @Output() onNodeAdd: EventEmitter<any>= new EventEmitter();

  private _treeData: SIModel.SiTreeStructure;
  private _d3TreeData: any;

  /**
   * Determines if tree node drag event is enabled
   */
  @Input() private enableNodeDrag: boolean = false;

  /**
   * Determines the input D3 tree data structure: hierachical or linear
   */
  @Input() public treeDataType: string = "hierarchical";



  constructor( private treeService: AngularD3TreeLibService ) { 

    treeService.setNodeChangedListener((node)=>{
      this.onNodeChanged.emit(node);
    })
    
    treeService.setNodeSelectedListener((node)=>{
      this.onNodeSelected.emit(node);
    })

    treeService.setNodeAddListener((node)=>{
      // this.onNodeAdd.emit(node);
      this.nodeAdded(node);
      
    })
  }

  /**
   * Tree data setter method
   */
  @Input()
  set treeData(inputTreeData: SIModel.SiTreeStructure) {
    console.info("this.treeDataType:  " + this.treeDataType);
    this._treeData = inputTreeData;
    if (this.treeDataType == D3TreeDataType.Linear){
      this._d3TreeData = this.treeService.transformSiLocationDataLinear(this._treeData);
    }
    else{
      this._d3TreeData = this.treeService.transformSiLocationDataHierarchical(this._treeData);
    }
  }

  ngOnInit() {
     
  }

  /**
   * Trigger tree render.
   * Method is async because d3 rendering is in conflict with Angular Material components.
   *    You need to delay your d3 code because the tab content isn't created until slightly after your controller runs. 
   * @param changes 
   */
  async ngOnChanges(changes: any) {
    console.info("si-tree: data changes detected");
    await this.sleep(1000);
    this.seedTree();
  }

  /**
   * Methods waits for given number of miliseconds
   * @param ms 
   */
  sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
  }
  
  seedTree(){
    if(!!this._d3TreeData){
      this.treeService.createChart(this.chartContainer, this._d3TreeData.result
        , this.enableNodeDrag
        , this.treeDataType == D3TreeDataType.Linear ? D3TreeDataType.Linear : D3TreeDataType.Hierarchical);
      this.treeService.update();
    }
  }

  nodeAdded(parentNode:any){
    console.info("si-tree-component: app detected add new node", parentNode);
    var uuid = this.treeService.generateUUID();
    var nodeNew : D3LinearTreeNode = {
      id : uuid,
      parent : parentNode.id,
      nodeIcon : '',
      nodeSymbol : "square",
      nodeColor : "yellow",
      description: uuid
    }
    this.treeService.addNode(nodeNew, parentNode);
    
   
  }


}
