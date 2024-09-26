import type { NodeType } from '@/types/node'

const isObject = (value: any): value is Record<string, any> => {
  return typeof value === 'object' && value !== null
}

export const filterRecursiveNodes = (
  node: Record<string, NodeType>,
  searchTerm: string
): Record<string, NodeType> => {
  return Object.entries(node).reduce(
    (acc: Record<string, NodeType>, [key, value]: [string, NodeType]) => {
      const matchesKey = String(key).toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDesc =
        value.desc_2 && value.desc_2.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesExamples =
        value.examples &&
        value.examples.some(
          (example) =>
            typeof example === 'string' && example.toLowerCase().includes(searchTerm.toLowerCase())
        )

      // Check if value itself is an object and needs further recursion
      if (isObject(value) && (matchesKey || matchesDesc || matchesExamples)) {
        acc[key] = value
      } else if (isObject(value)) {
        const filteredChildren = filterRecursiveNodes(value, searchTerm)
        if (Object.keys(filteredChildren).length > 0) {
          acc[key] = filteredChildren // Only add if there are matching children
        }
      }

      return acc
    },
    {}
  )
}
