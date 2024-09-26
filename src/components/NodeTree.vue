<template>
  <div>
    <h1>MiTrust Grammar Browser</h1>
    <Spinner v-if="loading" />
    <div v-else>
      <input type="text" v-model="searchTerm" placeholder="Search..." @input="filterNodes" />
      <div v-if="filteredData && Object.keys(filteredData).length">
        <div v-for="(nodes, key) in filteredData" :key="key" class="node-card">
          <h2>{{ key }}</h2>

          <NodeItem
            v-for="(node, nodeKey) in nodes"
            :key="nodeKey"
            :name="String(nodeKey)"
            :node="node"
          />
        </div>
      </div>
      <div v-else>No results found.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { filterRecursiveNodes } from '@/utils/functions'
import type { NodeType } from '@/types/node'

import NodeItem from './NodeItem.vue'
import Spinner from './Spinner.vue'

const searchTerm = ref('')
const filteredData: Ref<Record<string, Record<string, NodeType>>> = ref({})
const data: Ref<Record<string, Record<string, NodeType>>> = ref({})
const loading: Ref<boolean> = ref(false)

onMounted(async () => {
  loading.value = true
  const response = await fetch('https://app.m-itrust.com/v2/public/claims')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const res = await response.json()

  data.value = res.data

  filteredData.value = { ...data.value }
  loading.value = false
})

const filterNodes = (): void => {
  if (searchTerm.value === '') {
    filteredData.value = { ...data.value }
    return
  }

  // Update to filter both nodes (keys) and leaves (values)
  filteredData.value = Object.entries(data.value).reduce((acc: any, [key, nodes]) => {
    const filteredNodes = Object.entries(nodes).reduce((nodeAcc: any, [nodeKey, node]) => {
      const matchesKey = String(nodeKey).toLowerCase().includes(searchTerm.value.toLowerCase())

      // Check if the description or examples match the search term
      const matchesDesc =
        node.desc_2 && node.desc_2.toLowerCase().includes(searchTerm.value.toLowerCase())
      const matchesExamples =
        node.examples &&
        node.examples.some(
          (example: string) =>
            typeof example === 'string' &&
            example.toLowerCase().includes(searchTerm.value.toLowerCase())
        )

      // Combine checks
      if (matchesKey || matchesDesc || matchesExamples) {
        nodeAcc[nodeKey] = node
      }

      // If the node is recursive, check its children as well
      if (node.claim_type === 'recursive') {
        const recursiveFilteredNodes = filterRecursiveNodes(node, searchTerm.value)
        if (Object.keys(recursiveFilteredNodes).length > 0) {
          nodeAcc[nodeKey] = recursiveFilteredNodes
        }
      }

      return nodeAcc
    }, {})

    if (Object.keys(filteredNodes).length) {
      acc[key] = filteredNodes
    }
    return acc
  }, {})

  // Clear results if none match
  if (Object.keys(filteredData.value).length === 0) {
    filteredData.value = {}
  }
}
</script>

<style scoped>
input {
  margin-bottom: 20px;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.tree-view {
  font-family: Arial, sans-serif;
  margin: 20px;
  color: #333;
}

.header {
  text-align: center;
  color: #4a90e2;
  margin-bottom: 10px;
}

.search-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.node-container {
  padding-left: 10px;
}

.node-group {
  margin-bottom: 15px;
}

.node-group-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}
.node-card {
  background-color: rgb(210, 214, 252);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  height: 100%;
  max-height: 500px;
  overflow: auto;
}

.no-results {
  color: #e74c3c;
  text-align: center;
  margin-top: 20px;
}
</style>
