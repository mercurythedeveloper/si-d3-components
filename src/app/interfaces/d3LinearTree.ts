/**
 * D3 Linear tree structure
 */
export class D3LinearTree{
    result: D3LinearTreeNode[]; 
}

/**
 * D3 tree node
 */
export class D3LinearTreeNode{
    id: string;
    description: string;
    nodeIcon: string;
    nodeSymbol: string;
    nodeColor: string;
    parent?: string;
}