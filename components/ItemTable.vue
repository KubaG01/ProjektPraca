<template>
  <v-data-table
    :headers="headers"
    :items="filtered"
    :options.sync="options"
    :server-items-length="totalItems"
    :footer-props="footerProps"
    :no-data-text="$t('noData')"
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
    return {
      headers: [],
      totalItems: 0,
      options: {
        page: 1,
        itemsPerPage: 5,
        sortBy: ["id"],
        sortDesc: [false],
      },
      footerProps: {
        "items-per-page-options": [5, 10, 15, 20, 50, -1],
        "items-per-page-text": this.$t("itemsPerPage"),
        "items-per-page-all-text": this.$t("all"),
        "pagination-text": "",
      },
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
  created() {
    this.footerProps["pagination-text"] = this.paginationText();
    this.setHeaders();
  },
  methods: {
    paginationText() {
      const start = (this.options.page - 1) * this.options.itemsPerPage + 1;
      const end = Math.min(
        start + this.options.itemsPerPage - 1,
        this.totalItems
      );

      return `${start} - ${end} ${this.$t("of")} ${this.totalItems}`;
    },
    setHeaders() {
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

      this.headers = headers; 
    },
  },
  computed: {
    filtered() {
      let filteredItems = [...this.filteredItem];

      if (this.options.sortBy.length > 0) {
        filteredItems = filteredItems.sort((a, b) => {
          const sortA = String(a[this.options.sortBy[0]]).toLowerCase();
          const sortB = String(b[this.options.sortBy[0]]).toLowerCase();
          const sortDesc = this.options.sortDesc[0];

          if (sortA < sortB) return sortDesc ? 1 : -1;
          if (sortA > sortB) return sortDesc ? -1 : 1;

          
          return 0;
        });
      } else {
        filteredItems = filteredItems.sort((a, b) => a.id - b.id);
      }

      this.totalItems = filteredItems.length;
      const start = (this.options.page - 1) * this.options.itemsPerPage;
      let end = start + this.options.itemsPerPage;

      if (this.options.itemsPerPage === -1) {
        end = this.totalItems;
      }

      return filteredItems.slice(start, end);
    },
  },
  watch: {
    filteredItem(newVal, oldVal) {
      const lastItemOnPage = this.totalItems % this.options.itemsPerPage;
      if (lastItemOnPage == 1 && this.options.page > 1) {
        this.options.page -= 1;
      }

      if (newVal.length > oldVal.length) {
        this.options.sortBy = [];
        this.options.sortDesc = [];
        this.options.page = Math.ceil(
          (this.totalItems + 1) / this.options.itemsPerPage
        );
      }

      console.log(this.totalItems, newVal, oldVal, lastItemOnPage);
    },
  },
};
</script>