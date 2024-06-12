<template>
  <v-data-table
    :headers="headers"
    :items="filtered"
    :items-per-page="itemsPerPage"
    :page.sync="page"
    :server-items-length="totalItems"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    :footer-props="{
      'items-per-page-options': [5, 10, 15, 20, 50, -1],
      'items-per-page-text': $t('itemsPerPage'),
      'items-per-page-all-text': $t('all'),
      'pagination-text': paginationText,
    }"
    :no-data-text="$t('noData')"
    @update:items-per-page="updateItemsPerPage"
  >
    <template
      v-slot:[`footer.page-text`]="{ pageStart, pageStop, itemsLength }"
    >
      {{ pageStart }}-{{ pageStop }} {{ $t("of") }}
      {{ itemsLength }}
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-icon class="me-2" size="small" @click="editItem(item)" color="primary">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item)" color="error">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>
  
<script>
import db from "~/data/db.json";

export default {
  name: "ItemTable",
  props: {
    filteredItem: Array,
    editItem: Function,
    deleteItem: Function,
    typeName: String,
  },
  data() {
    let headers = [
      { text: this.$t("ID"), value: "id" },
      { text: this.$t("name"), value: "name" },
      { text: this.$t("last"), value: "last" },
      { text: this.$t("dataCreate"), value: "dataCreate" },
    ];

    if (this.typeName != "server") {
      headers.push({ text: this.$t("servers"), value: "serverName" });
    }

    if (this.typeName == "task") {
      headers.push({ text: this.$t("applications"), value: "appName" });
    }

    headers.push({
      text: this.$t("actions"),
      value: "actions",
      sortable: false,
    });

    return {
      sortBy: "id",
      sortDesc: false,
      itemsPerPage: 5,
      page: 1,
      totalItems: 0,
      headers: headers,
      tasks: db.tasks,
      servers: db.servers.sort((a, b) => a.name.localeCompare(b.name)),
      applications: db.applications.sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
      sortDirections: {
        id: 1,
        name: 1,
        last: 1,
        dataCreate: 1,
        serverName: 1,
        appName: 1,
      },
    };
  },
  methods: {
    updateItemsPerPage(value) {
      this.itemsPerPage = value;
      this.page = 1;
    },
    paginationText() {
      const start = (this.page - 1) * this.itemsPerPage + 1;
      const end = Math.min(start + this.itemsPerPage - 1, this.totalItems);
      return `${start} - ${end} ${this.$t("of")} ${this.totalItems}`;
    },
  },
  computed: {
    filtered() {
      if (this.sortBy) {
        this.filteredItem = this.filteredItem.sort((a, b) => {
          const sortA = String(a[this.sortBy]).toLowerCase();
          const sortB = String(b[this.sortBy]).toLowerCase();
          if (sortA < sortB) return this.sortDesc ? 1 : -1;
          if (sortA > sortB) return this.sortDesc ? -1 : 1;
          return 0;
        });
      } else {
        this.filteredItem.sort((a, b) => a.id - b.id);
      }

      this.totalItems = this.filteredItem.length;
      const start = (this.page - 1) * this.itemsPerPage;
      let end = start + this.itemsPerPage;

      if (this.itemsPerPage === -1) {
        end = this.totalItems;
      }

      return this.filteredItem.slice(start, end);
    },
  },
  watch: {
    filteredItem(newVal, oldVal) {
      const lastItemOnPage = this.totalItems % this.itemsPerPage;
      if (lastItemOnPage == 1 && this.page > 1) {
        this.page -= 1;
      }

      if (newVal.length > oldVal.length) {
        this.sortBy = "id";
        this.sortDesc = false;
        this.page = Math.ceil((this.totalItems + 1) / this.itemsPerPage);
      }
    },
  },
};
</script>