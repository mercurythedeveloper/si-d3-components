import { Component, OnInit, ViewChild, ElementRef, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { TreeModel } from './tree.dendo.model';

import { AngularD3TreeLibService } from './angular-d3-tree-lib.service';

@Component({
  selector: 'si-sl-tree',
  // templateUrl: './sl-tree.component.html',
  template: `
  Ha: <i class="fa fa-cog fa-spin" >
  </i> d 
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
  @Input() private treeData: any= [];
  @Input() private enableNodeDrag: boolean = false;

  constructor( private treeService: AngularD3TreeLibService ) { 

    treeService.setNodeChangedListener((node)=>{
      this.onNodeChanged.emit(node);
    })
    treeService.setNodeSelectedListener((node)=>{
      this.onNodeSelected.emit(node);
    })

    
  }

  ngOnInit() {
    
  }

  ngOnChanges(changes: any) {
    this.seedTree();
  }
  
  seedTree(){
    if(!!this.treeData){
      this.treeService.createChart(this.chartContainer, this.treeData, this.enableNodeDrag);
      this.treeService.update();
    }
  }


}
