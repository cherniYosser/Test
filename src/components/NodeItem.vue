<template>
  <li class="node-item">
    <details :open="isExpanded" @toggle="toggle">
      <summary class="node-name">
        {{ name }}
      </summary>
      <ul v-if="isObject(node)">
        <NodeItem v-for="(value, key) in node" :key="key" :name="String(key)" :node="value" />
      </ul>
      <ul v-else-if="Array.isArray(node)">
        <li v-for="(item, index) in node" :key="index">
          <NodeItem :name="`Item ${index + 1}`" :node="item" />
        </li>
      </ul>
      <div v-else class="leaf-node">
        {{ node }}
      </div>
    </details>
  </li>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { isObject } from '@/utils/functions'

defineProps({
  name: {
    type: String,
    required: true
  },
  node: {
    type: [Object, Array, String, Number, Boolean],
    required: true
  }
})

const isExpanded = ref(false)

const toggle = (event: Event) => {
  isExpanded.value = (event.target as HTMLDetailsElement).open
}
</script>

<style scoped>
.node-item {
  list-style-type: none;
  margin-left: 20px;
}

.node-name {
  cursor: pointer;
}

.leaf-node {
  margin-left: 20px;
}
</style>
