<template>
  <v-layout row wrap class="pa-3">
    <v-flex md4 class="px-3">
      <v-select
        v-model="selectedServer"
        :items="servers"
        item-text="name"
        item-value="name"
        :label="$t('servers')"
        @change="checkApp"
        @blur="checkApp"
        clearable
      ></v-select>
    </v-flex>
    <v-flex md4 class="px-3" v-if="showAppsSelect">
      <v-select
        v-model="selectedApp"
        :items="filteredApplications"
        item-text="name"
        item-value="name"
        :label="$t('applications')"
        :no-data-text="$t('noData')"
        clearable
      ></v-select>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "ItemFilter",
  props: {
    servers: {
      type: Array,
      default: () => [],
    },
    applications: {
      type: Array,
      default: () => [],
    },
    filteredApplications: {
      type: Array,
      default: () => [],
    },
    showAppsSelect: {
      type: Boolean,
      default: true,
    },
    selectedServer: { type: String, default: null },
    selectedApp: { type: String, default: null },
  },
  data() {
    return {};
  },
  methods: {
    checkApp() {
      if (!this.selectedServer) {
        this.filteredApplications = this.applications;
        this.selectedApp = "";
      } else {
        this.filteredApplications = this.applications.filter(
          (app) => app.serverName === this.selectedServer
        );
        this.selectedApp = "";
      }
    },
  },
};
</script>