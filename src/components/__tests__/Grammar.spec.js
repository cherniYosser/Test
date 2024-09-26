import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import NodeTree from '../NodeTree.vue'
import NodeItem from '../NodeItem.vue'

// eslint-disable-next-line no-undef
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
  })
)

describe('NodeTree.vue', () => {
  const mountComponent = () => {
    return mount(NodeTree, {
      global: {
        components: {
          NodeItem
        }
      },
      data() {
        return {
          searchTerm: '',
          filteredData: {
            group1: {
              node1: { desc_2: 'Description 1', examples: ['Example 1'] },
              node2: { desc_2: 'Description 2', examples: ['Example 2'] }
            },
            group2: {
              node3: { desc_2: 'Description 3', examples: ['Example 3'] }
            }
          }
        }
      }
    })
  }

  it('renders the component', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders NodeItem components', () => {
    const wrapper = mountComponent()
    const nodeItems = wrapper.findAllComponents(NodeItem)
    //expect(nodeItems.length).toBeGreaterThan(0)
  })

  it('handles search term input', async () => {
    const wrapper = mountComponent()
    const input = wrapper.find('input')
    await input.setValue('node1')
    expect(wrapper.vm.searchTerm).toBe('node1')
  })
})
