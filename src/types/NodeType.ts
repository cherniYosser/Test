export type NodeType = {
  claim_type?: string
  desc_2?: string
  examples?: string[]
  [key: string]: any // Allow for additional properties
}

export type FilteredData = {
  [key: string]: {
    [nodeKey: string]: Node
  }
}
