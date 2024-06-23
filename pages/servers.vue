<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="11">
      <v-card>
        <v-card-title class="headline ma-4">
          {{ $t("servers") }}
        </v-card-title>
        <v-card-text>
          <v-layout row>
            <v-flex>
              <v-container fluid class="my-5">
                <v-card class="pa-3">
                  <ItemFilter
                    :search="search"
                    :selectedServer="selectedServer"
                    :selectedApp="selectedApp"
                    :servers="servers"
                    :applications="applications"
                    @update:search="search = $event"
                    @update:selectedServer="selectedServer = $event"
                    @update:selectedApp="selectedApp = $event"
                    :typeName="typeName"
                  />
                  <v-divider :thickness="3" color="grey"></v-divider>
                  <ItemTable
                    ref="itemTable"
                    :filteredItem="filtered"
                    :editItem="editItem"
                    :deleteItem="deleteItem"
                    :typeName="typeName"
                  />
                  <v-divider :thickness="3" color="grey"></v-divider>
                </v-card>
              </v-container>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions md="6">
          <v-spacer />

          <ItemDelete
            ref="itemDelete"
            :typeName="typeName"
            :typePage="typePage"
            :applications="applications"
            :tasks="tasks"
            @delete="deleteTab"
          />

          <ItemAdd
            ref="itemAdd"
            :typeName="typeName"
            :typePage="typePage"
            @save="addTab"
          />
        </v-card-actions>
      </v-card>
    </v-col>
    <v-snackbar v-model="snackbar" :timeout="4000" top>
      <span style="display: block; text-align: center; font-size: 16px"
        >{{ $t("server") }}:
        <strong
          ><span style="color: red">{{ snackbarMessage[1] }}</span></strong
        >
        {{ " - " + $t(snackbarMessage[0]) }}</span
      >
    </v-snackbar>
  </v-row>
</template>
  
<script>
import { mapState, mapActions } from "vuex";
import ItemFilter from "~/components/ItemFilter.vue";
import ItemDelete from "~/components/ItemDelete.vue";
import ItemAdd from "~/components/ItemAdd.vue";
import ItemTable from "~/components/ItemTable.vue";

export default {
  components: { ItemFilter, ItemDelete, ItemTable, ItemAdd },
  data() {
    return {
      typePage: [],
      typeName: "server", //task, application, server
      selectedServer: null,
      selectedApp: null,
      search: "",
      lastName: "",
      snackbar: false,
      snackbarMessage: {},
    };
  },
  methods: {
    editItem(item) {
      this.lastName = item.name;
      this.$refs.itemAdd.editItem(item);
    },
    deleteItem(item) {
      this.$refs.itemDelete.deleteItem(item);
    },
    addTab(newItem) {
      const index = this.typePage.findIndex((item) => item.id === newItem.id);
      if (index !== -1) {
        this.tasks.forEach((task) => {
          if (task.serverName == this.lastName) {
            task.serverName = newItem.name;
          }
        });

        this.applications.forEach((app) => {
          if (app.serverName == this.lastName) {
            app.serverName = newItem.name;
          }
        });

        this.$set(this.typePage, index, newItem);
        this.snackbarMessage[0] = "editInfo";
        this.snackbarMessage[1] = this.lastName;
      } else {
        this.typePage.push(newItem);
        this.snackbarMessage[0] = "addInfo";
        this.snackbarMessage[1] = newItem.name;
      }

      this.showSnackbar();
      this.$emit("updateTypePage", this.typePage);
    },
    deleteTab(item) {
      const index = this.typePage.indexOf(item);
      if (index > -1) {
        this.typePage.splice(index, 1);
      }
      this.snackbarMessage[0] = "delInfo";
      this.snackbarMessage[1] = item.name;
      this.showSnackbar();
      this.$emit("updateTypePage", this.typePage);
    },
    showSnackbar() {
      this.snackbar = false;
      this.snackbar = true;
    },
    ...mapActions(["setServers", "setApplications", "setTasks"]),
  },
  created() {
    this.typePage = this.servers;
  },
  computed: {
    ...mapState(["tasks", "servers", "applications"]),
    filtered() {
      if (this.search === null) {
        this.search = "";
      }

      let filteredItem = this.typePage.filter((item) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(this.search.toLowerCase());
        const matchesServer =
          !this.selectedServer || item.serverName === this.selectedServer;
        const matchesApp =
          !this.selectedApp || item.appName === this.selectedApp;
        return matchesSearch && matchesServer && matchesApp;
      });

      return filteredItem;
    },
  },
  watch: {
    selectedServer: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$refs.itemTable.page = 1;
      }
    },
    selectedApp: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$refs.itemTable.page = 1;
      }
    },
    search(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$refs.itemTable.page = 1;
      }
    },
  },
};
</script>
  