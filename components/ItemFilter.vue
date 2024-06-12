<template>
  <v-layout row wrap class="pa-3">
    <v-flex
      :class="{
        md4: this.typeName === `task`,
        md6: !(this.typeName === `task`),
      }"
      class="px-3"
    >
      <v-text-field
        v-model="localSearch"
        :label="$t('search')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        @input="updateSearch"
        clearable
      ></v-text-field>
    </v-flex>
    <v-flex
      :class="{
        md6: this.typeName === `application`,
        md4: !(this.typeName === `application`),
      }"
      class="px-3"
      v-if="this.typeName !== 'server'"
    >
      <v-select
        v-model="localSelectedServer"
        :items="servers"
        item-text="name"
        item-value="name"
        :label="$t('servers')"
        @change="updateServerChange"
        @blur="updateServerChange"
        clearable
      ></v-select>
    </v-flex>
    <v-flex md4 class="px-3" v-if="this.typeName === 'task'">
      <v-select
        v-model="localSelectedApp"
        :items="localFilteredApplications"
        item-text="name"
        item-value="name"
        :label="$t('applications')"
        :no-data-text="$t('noData')"
        @change="updateSelectedApp"
        @blur="updateSelectedApp"
        clearable
      ></v-select>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "ItemFilter",
  props: {
    search: String,
    selectedServer: String,
    selectedApp: String,
    servers: Array,
    applications: Array,
    typeName: String,
  },
  data() {
    return {
      localSearch: this.search,
      localSelectedServer: this.selectedServer,
      localSelectedApp: this.selectedApp,
      localFilteredApplications: this.applications,
    };
  },

  methods: {
    updateSearch(value) {
      this.$emit("update:search", this.localSearch);
    },
    updateServerChange() {
      if (this.applications && this.applications.length > 0) {
        this.checkApp();
      }
      this.$emit("update:selectedServer", this.localSelectedServer);
    },
    updateSelectedApp() {
      this.$emit("update:selectedApp", this.localSelectedApp);
    },
    checkApp() {
      if (!this.localSelectedServer) {
        this.localFilteredApplications = this.applications;
        this.localSelectedApp = "";
      } else {
        this.localFilteredApplications = this.applications.filter(
          (app) => app.serverName === this.localSelectedServer
        );
        this.localSelectedApp = "";
      }
      this.$emit("update:selectedApp", this.localSelectedApp);
      this.$emit("update:filteredApplications", this.localFilteredApplications);
    },
  },
};
</script>
