import { Injectable } from '@angular/core';
import { TreeModel } from './tree.dendo.model';

import *  as SIModel from '../interfaces/specificationTree'
import { D3LinearTree, D3LinearTreeNode } from '../interfaces/d3LinearTree'
import { Constants } from "../classes/constants";

@Injectable({
  providedIn: 'root'
})
export class AngularD3TreeLibService {
  treeModel: TreeModel= new TreeModel();

  constructor() { }

  createChart(chartContainer: any, treeData: any, enableNodeDrag: boolean = false): void {
    let element = chartContainer.nativeElement;
    element.innerHTML= "";
    
    this.treeModel.enableNodeDrag = enableNodeDrag;
    this.treeModel.addSvgToContainer(chartContainer);

    this.treeModel.createLayout();

    this.treeModel.createTreeData(treeData);

  }

  update(){
    this.treeModel.update(this.treeModel.root);
  }

  setNodeChangedListener(callable){
    this.treeModel.nodechanged= callable;
  }

  /**
   * Node Selecte event hanlder
   * @param callable 
   */
  setNodeSelectedListener(callable){
    this.treeModel.nodeselected= callable;
  }

  /**
   * Add New node from context menu event handler
   * @param callable  
   */
  setNodeAddListener(callable){
    this.treeModel.nodeAddNew = callable;
  }

  /**
   * Adds new node to d3 tree
   * @param node 
   */
  addNode(node: D3LinearTreeNode){
    // this.treeModel.addNode(node);
    this.treeModel.addNewTreeNode(node);
  } 


  /**
   * Transforms list of Customer Facing Service specifications with hierarchical structure into linear structure suitable for rendering D3 tree
   * @param cfsNodes List of CFS specifications
   * @param parentNodeId Parent node identifier
   */
  private transformCfsTree( cfsNodes: SIModel.CfsSpecification[], parentNodeId: string): D3LinearTreeNode[]{
    var resultTree: D3LinearTreeNode[] = [];
    for( let cfs of cfsNodes){
      let d3TreeNode : D3LinearTreeNode = {
        "id": cfs.id,
        "description": cfs.name,
        "parent":parentNodeId,
        "nodeIcon": (cfs.icon == null || cfs.icon == "") ? Constants.RFSS_DEFAULT_ICON : cfs.icon,
        "nodeSymbol": Constants.CFS_DEFAULT_SYMBOL,
        "nodeColor": Constants.CFSS_DEFAULT_COLOR
      }
      resultTree.push(d3TreeNode);

      if(cfs.childCFSs != null && cfs.childCFSs.length > 0){
        let childResultTreeCfs = this.transformCfsTree( cfs.childCFSs, cfs.id);
        resultTree.push( ... childResultTreeCfs);
      }
      if(cfs.childRFSs != null && cfs.childRFSs.length > 0){
        let childResultTreeRfs = this.transformRfsTree( cfs.childRFSs, cfs.id);
        resultTree.push( ... childResultTreeRfs);
      }
    }
    return resultTree;
  }

  /**
   * Transforms list of Resource Facing Service specifications with hierarchical structure into linear structure suitable for rendering D3 tree
   * @param rfsNodes List of RFS specifications
   * @param parentNodeId Parent node Identififer
   */
  private transformRfsTree( rfsNodes: SIModel.RfsSpecification[], parentNodeId: string): D3LinearTreeNode[]{
    let resultTree: D3LinearTreeNode[] = [];
    for( let rfs of rfsNodes){
      let d3TreeNode : D3LinearTreeNode = {
        "id": rfs.id,
        "description": rfs.name,
        "parent":parentNodeId,
        "nodeIcon": (rfs.icon == null || rfs.icon == "") ? Constants.RFSS_DEFAULT_ICON : rfs.icon,
        "nodeSymbol": Constants.RFS_DEFAULT_SYMBOL,
        "nodeColor": Constants.RFSS_DEFAULT_COLOR
      }
      resultTree.push(d3TreeNode)
      if(rfs.childRFSs != null && rfs.childRFSs.length > 0){
        let childResultTreeRfs = this.transformRfsTree( rfs.childRFSs, rfs.id);
        resultTree.push( ... childResultTreeRfs);
      }
    }
    return resultTree;
  }

  /**
   * Transforms service location tree specification data model (SiTreeStructure) into model suitable for rendering D3 tree control (D3LinearTree)
   * @param siTree 
   * Service location tree specification
   */
  transformSiLocationData( siTree: SIModel.SiTreeStructure): D3LinearTree{
    var resultTree = new D3LinearTree();
    resultTree.result = [];
    let d3TreeNode : D3LinearTreeNode = { 
      "id": siTree.location.id,
      "description": siTree.location.name,
      "nodeIcon": Constants.LOCATION_DEFAULT_ICON,
      "nodeSymbol": Constants.LOCATION_DEFAULT_SYMBOL,
      "nodeColor": Constants.LOCATION_SPEC_DEFAULT_COLOR
      
    }
    
    resultTree.result.push(d3TreeNode);
    resultTree.result.push( ...this.transformCfsTree(siTree.cfsTree, siTree.location.id))
    
    return resultTree;
  }

  /**
   * Generates random GUID like string
   */
  generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  }
}
