import { Component, OnInit, ViewChild, ElementRef, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { TreeModel } from './tree.dendo.model';

import { AngularD3TreeLibService } from './angular-d3-tree-lib.service';
import *  as SIModel from '../interfaces/specificationTree'
import { D3LinearTree } from '../interfaces/d3LinearTree'


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
  private _treeData: SIModel.SiTreeStructure;
  private _d3TreeData: D3LinearTree;
  @Input() private enableNodeDrag: boolean = false;

  constructor( private treeService: AngularD3TreeLibService ) { 

    treeService.setNodeChangedListener((node)=>{
      this.onNodeChanged.emit(node);
    })
    treeService.setNodeSelectedListener((node)=>{
      this.onNodeSelected.emit(node);
    })

    
  }

  /**
   * Tree data setter method
   */
  @Input()
  set treeData(inputTreeData: SIModel.SiTreeStructure) {
    this._treeData = inputTreeData;
    this._d3TreeData = this.treeService.transformSiLocationData(this._treeData);
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
      this.treeService.createChart(this.chartContainer, this._d3TreeData.result, this.enableNodeDrag);
      this.treeService.update();
    }
  }


}
