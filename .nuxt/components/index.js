export { default as ItemAdd } from '../..\\components\\ItemAdd.vue'
export { default as ItemDelete } from '../..\\components\\ItemDelete.vue'
export { default as ItemFilter } from '../..\\components\\ItemFilter.vue'
export { default as ItemTable } from '../..\\components\\ItemTable.vue'
export { default as LangSwitcher } from '../..\\components\\LangSwitcher.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
