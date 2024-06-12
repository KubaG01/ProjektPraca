<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="11">
      <v-card>
        <v-card-title class="headline ma-4">
          {{ $t("tasks") }}
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
            :dialogDelete="dialogDelete"
            :selectedItem="selectedItem"
            @deleteItemConfirm="deleteItemConfirm"
            @closeDialog="closeDeleteDialog"
            :typeName="typeName"
          />

          <ItemAdd
            ref="itemAdd"
            :typeName="typeName"
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
      typePage: [...db.tasks],
      typeName: "task", //task, application, server
      selectedServer: null,
      selectedApp: null,
      dialogDelete: false,
      selectedItem: {},
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
      this.selectedItem = item;
      this.dialogDelete = true;
    },
    closeDeleteDialog() {
      this.dialogDelete = false;
    },
    deleteItemConfirm() {
      const index = this.typePage.indexOf(this.selectedItem);
      if (index > -1) {
        this.typePage.splice(index, 1);

        const lastItemIndexOnPage = (this.page - 1) * this.itemsPerPage;
        if (this.totalItems - 1 == lastItemIndexOnPage && this.page > 1) {
          this.page -= 1;
        }
      }

      this.selectedItem = {};
      this.dialogDelete = false;
    },
    closeDeleteAdd() {
      this.dialogAdd = false;
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
  