<template>
  <v-select
    v-model="selectedServer"
    :items="servers"
    item-text="name"
    item-value="name"
    :label="$t('servers')"
    clearable
  ></v-select>
</template>

<script>
export default {
  props: {
    selectedServer: {
      type: String,
      required: true
    },
    servers: {
      type: Array,
      required: true
    }
  }
};
</script>