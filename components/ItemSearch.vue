<template>
  <v-text-field
    v-model="search"
    :label="$t('search')"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    @input="onSearch"
    clearable
  ></v-text-field>
</template>
  
  <script>
export default {
  name: 'ItemSearch',
  props: {
    search: { type: String, default: '' },
  },
  methods: {
    onSearch() {
      this.$emit('update:search', this.search);
    }
  },
};
</script>
  