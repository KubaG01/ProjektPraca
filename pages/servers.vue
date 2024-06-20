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
            @update:typePage="typePage = $event"
          />

          <ItemAdd
            ref="itemAdd"
            :typeName="typeName"
            :typePage="typePage"
            @update:typePage="typePage = $event"
          />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
  
<script>
import db from "~/data/db.json";
import ItemFilter from "~/components/ItemFilter.vue";
import ItemDelete from "~/components/ItemDelete.vue";
import ItemAdd from "~/components/ItemAdd.vue";
import ItemTable from "~/components/ItemTable.vue";

export default {
  components: { ItemFilter, ItemDelete, ItemTable, ItemAdd },
  data() {
    return {
      typePage: [...db.servers],
      typeName: "server", //task, application, server
      selectedServer: null,
      selectedApp: null,
      search: "",
      tasks: db.tasks,
      servers: db.servers.sort((a, b) => a.name.localeCompare(b.name)),
      applications: db.applications.sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    };
  },
  methods: {
    editItem(item) {
      this.$refs.itemAdd.editItem(item);
    },
    deleteItem(item) {
      this.$refs.itemDelete.deleteItem(item);
    },
  },
  computed: {
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
  