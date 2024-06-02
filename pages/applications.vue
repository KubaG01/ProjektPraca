<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10">
      <v-card>
        <v-card-title class="headline ma-4">
          {{ $t("applications") }}
        </v-card-title>
        <v-card-text>
          <v-layout row>
            <v-flex>
              <v-container fluid class="my-5">
                <v-card class="pa-3">
                  <v-layout row wrap class="pa-3">
                    <v-flex md6 class="px-3">
                      <ItemSearch v-model="search" />
                    </v-flex>
                    <v-flex md6 class="px-3">
                      <ServerSelect
                        v-model="selectedServer"
                        :servers="servers"
                      />
                    </v-flex>
                  </v-layout>
                  <v-divider :thickness="3" color="grey"></v-divider>
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
                      v-slot:footer.page-text="{
                        pageStart,
                        pageStop,
                        itemsLength,
                      }"
                    >
                      {{ pageStart }}-{{ pageStop }} {{ $t("of") }}
                      {{ itemsLength }}
                    </template>

                    <template v-slot:item.actions="{ item }">
                      <v-icon
                        class="me-2"
                        size="small"
                        @click="editItem(item)"
                        color="primary"
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon
                        size="small"
                        @click="
                          dialogDelete = true;
                          selectedItem = item;
                        "
                        color="error"
                      >
                        mdi-delete
                      </v-icon>
                    </template>
                  </v-data-table>
                  <v-divider :thickness="3" color="grey"></v-divider>
                </v-card>
              </v-container>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions md="6">
          <v-spacer />
          <v-dialog v-model="dialogDelete" max-width="550px">
            <v-card>
              <v-card-title class="text-h5">{{
                $t("deleteInfo")
              }}</v-card-title>

              <v-card-text>
                <ul>
                  <li>{{ $t("ID") }}: {{ selectedItem.id }}</li>
                  <li>{{ $t("name") }}: {{ selectedItem.name }}</li>
                  <li>{{ $t("server") }}: {{ selectedItem.serverName }}</li>
                  <li>{{ $t("last") }}: {{ selectedItem.last }}</li>
                  <li>{{ $t("dataCreate") }}: {{ selectedItem.dataCreate }}</li>
                </ul>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="deleteItemConfirm"
                  >{{ $t("yes") }}</v-btn
                >
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="dialogDelete = false"
                  >{{ $t("no") }}</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="Add"
            persistent
            max-width="800px"
            @input="resetApp"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="success"
                class="ma-7"
                v-bind="attrs"
                v-on="on"
                :style="{ minWidth: '90px' }"
              >
                {{ $t("add") }}
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ $t("newApp") }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="newItem.name"
                        :label="$t('name') + '*'"
                        :error="nameError || duplicateNameError"
                        @blur="checkName"
                        required
                      ></v-text-field>
                      <v-alert v-if="duplicateNameError" type="error">
                        {{ $t("application") + " " + $t("exist") }}
                      </v-alert>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="newItem.serverName"
                        :items="servers"
                        item-text="name"
                        item-value="name"
                        :label="$t('server') + '*'"
                        :error="serverError"
                        @change="checkServer"
                        @blur="checkServer"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
                <small>*{{ $t("required") }}</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  :disabled="!newItem.name || !newItem.serverName"
                  @click="save"
                >
                  {{ $t("save") }}
                </v-btn>
                <v-btn color="blue darken-1" text @click="Add = false">
                  {{ $t("close") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
  
<script>
import db from "~/data/db.json";

export default {
  data() {
    return {
      sortBy: "id",
      sortDesc: false,
      itemsPerPage: 5,
      page: 1,
      totalItems: 0,
      duplicateNameError: false,
      selectedServer: null,
      dialogDelete: false,
      selectedItem: "",
      search: "",
      Add: false,
      Edit: false,
      isEditing: false,
      headers: [
        { text: this.$t("ID"), value: "id" },
        { text: this.$t("name"), value: "name" },
        { text: this.$t("last"), value: "last" },
        { text: this.$t("dataCreate"), value: "dataCreate" },
        { text: this.$t("servers"), value: "serverName" },
        { text: this.$t("actions"), value: "actions", sortable: false },
      ],
      applications: db.applications,
      servers: db.servers,
      newItem: {
        id: null,
        name: "",
        serverName: "",
      },
      sortDirections: {
        id: 1,
        name: 1,
        last: 1,
        dataCreate: 1,
        serverName: 1,
      },
      nameError: false,
      serverError: false,
    };
  },
  methods: {
    checkName() {
      if (!this.newItem.name.trim()) {
        this.nameError = true;
      } else {
        this.nameError = false;
        if (this.checkDuplicateName()) {
          this.duplicateNameError = true;
        } else {
          this.duplicateNameError = false;
        }
      }
    },
    checkServer() {
      if (!this.newItem.serverName) {
        this.serverError = true;
      } else {
        this.serverError = false;
      }
    },
    resetApp() {
      this.nameError = false;
      this.serverError = false;
      this.newItem.name = "";
      this.newItem.serverName = "";
      this.isEditing = false;
    },
    checkDuplicateName() {
      const itemNameLower = this.newItem.name.trim().toLowerCase();
      return this.applications.some(
        (item) =>
          item.name.trim().toLowerCase() === itemNameLower &&
          (!this.isEditing || item.id !== this.newItem.id)
      );
    },
    save() {
      if (this.checkDuplicateName()) {
        this.duplicateNameError = true;
        return;
      }
      const SS = this.selectedServer;

      this.duplicateNameError = false;

      if (this.isEditing) {
        const index = this.applications.findIndex(
          (item) => item.id === this.newItem.id
        );
        if (index > -1) {
          this.applications[index] = {
            ...this.newItem,
            last: new Date().toLocaleDateString(),
          };
        }
      } else {
        const newId = Math.max(...this.applications.map((item) => item.id)) + 1;

        const newItem = {
          id: newId,
          name: this.newItem.name,
          last: new Date().toLocaleDateString(),
          dataCreate: new Date().toLocaleDateString(),
          serverName: this.newItem.serverName,
        };

        this.applications.push(newItem);

        if (!(this.itemsPerPage == -1))
          this.page = Math.ceil((this.totalItems + 1) / this.itemsPerPage);
      }

      this.filteredItem = this.applications.filter(
        (app) => app.serverName === this.newItem.serverName
      );

      this.applications = [...this.applications];
      this.resetApp();
      this.selectedServer = SS;

      this.saveDataToJSON();
      this.Add = false;
    },
    editItem(item) {
      this.newItem = { ...item };
      this.isEditing = true;
      this.Add = true;
      this.checkServer();
    },
    deleteItemConfirm() {
      const index = this.applications.indexOf(this.selectedItem);
      if (index > -1) {
        this.applications.splice(index, 1);

        const lastItemIndexOnPage = (this.page - 1) * this.itemsPerPage;
        if (this.totalItems - 1 == lastItemIndexOnPage && this.page > 1) {
          this.page -= 1;
        }
      }

      this.saveDataToJSON();

      this.selectedItem = "";
      this.dialogDelete = false;
    },
    updateItemsPerPage(value) {
      this.itemsPerPage = value;
      this.page = 1;
    },
    paginationText() {
      const start = (this.page - 1) * this.itemsPerPage + 1;
      const end = Math.min(start + this.itemsPerPage - 1, this.totalItems);
      const text = `${start} - ${end} ${this.$t("of")} ${this.totalItems}`;
      return text;
    },
    async saveDataToJSON() {
      try {
      } catch (error) {
        console.error("Failed to save data to JSON", error);
      }
    },
  },
  computed: {
    filtered() {
      if (this.search === null) {
        this.search = "";
      }

      let filteredItem = this.applications.filter((item) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(this.search.toLowerCase());
        const matchesServer =
          !this.selectedServer || item.serverName === this.selectedServer;

        return matchesSearch && matchesServer;
      });

      if (this.sortBy) {
        filteredItem = filteredItem.sort((a, b) => {
          const sortA = String(a[this.sortBy]).toLowerCase();
          const sortB = String(b[this.sortBy]).toLowerCase();
          if (sortA < sortB) return this.sortDesc ? 1 : -1;
          if (sortA > sortB) return this.sortDesc ? -1 : 1;
          return 0;
        });
      }

      this.totalItems = filteredItem.length;
      const start = (this.page - 1) * this.itemsPerPage;
      let end = start + this.itemsPerPage;

      if (this.itemsPerPage === -1) {
        end = this.totalItems;
      }

      return filteredItem.slice(start, end);
    },
  },
  watch: {
    selectedServer: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.page = 1;
      }
    },
  },
};
</script>
  