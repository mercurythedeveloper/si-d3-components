/**
 * D3 Linear tree structure
 */
export class D3LinearTree{
    result: D3LinearTreeNode[]; 
}

/**
 * D3 tree node for linear D3 tree model
 */
export class D3LinearTreeNode{
    id: string;
    description: string;
    nodeIcon: string;
    nodeSymbol: string;
    nodeColor: string;
    parent?: string;
    /**
     * Type of node in context of SI: CFS, RFS
     */
    type: string;
}

export class D3HierarchicalTree{
    result: D3HierarchicalTreeNode;
}

/**
 * D3 tree node for hierarchical D3 tree model
 */
export class D3HierarchicalTreeNode{
    id: string;
    description: string;
    nodeIcon: string;
    nodeSymbol: string;
    nodeColor: string;
    /**
     * Type of node in context of SI: CFS, RFS
     */
    type: string;
    children: D3HierarchicalTreeNode[];
}