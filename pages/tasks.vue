<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10">
      <v-card>
        <v-card-title class="headline ma-4">
          {{ $t("tasks") }}
        </v-card-title>
        <v-card-text>
          <v-layout row>
            <v-flex>
              <v-container fluid class="my-5">
                <v-card class="pa-3">
                  <v-layout row wrap class="pa-3">
                    <v-flex md4 class="px-3">
                      <ItemSearch
                        v-model:search="search"
                        @update:search="search = $event"
                      />
                    </v-flex>
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
                    <v-flex md4 class="px-3">
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
                  <li>{{ $t("application") }}: {{ selectedItem.appName }}</li>
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
                <span class="text-h5">{{ $t("newTask") }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="newItem.name"
                        :label="$t('name') + '*'"
                        :error="nameError || duplicateNameError"
                        @blur="checkName"
                        required
                      ></v-text-field>
                      <v-alert v-if="duplicateNameError" type="error">
                        {{ $t("task") + " " + $t("exist") }}
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
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="newItem.appName"
                        :items="filteredAppsByServer"
                        item-text="name"
                        item-value="name"
                        :label="$t('application')"
                        :disabled="!newItem.serverName"
                        clearable
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
import ItemSearch from "~/components/ItemSearch.vue";
import ItemFilter from "~/components/ItemFilter.vue";

export default {
  components: { ItemSearch, ItemFilter },
  data() {
    return {
      sortBy: "id",
      sortDesc: false,
      itemsPerPage: 5,
      page: 1,
      totalItems: 0,
      duplicateNameError: false,
      selectedServer: null,
      selectedApp: null,
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
        { text: this.$t("applications"), value: "appName" },
        { text: this.$t("actions"), value: "actions", sortable: false },
      ],
      tasks: db.tasks,
      servers: db.servers,
      applications: db.applications,
      filteredApplications: [...db.applications],
      filteredAppsByServer: [...db.applications],
      newItem: {
        id: null,
        name: "",
        serverName: "",
        appName: "",
      },
      sortDirections: {
        id: 1,
        name: 1,
        last: 1,
        dataCreate: 1,
        serverName: 1,
        appName: 1,
      },
      nameError: false,
      serverError: false,
      formattedDate: ''
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
        this.filteredAppsByServer = [...this.applications];
      } else {
        this.serverError = false;
        this.filteredAppsByServer = this.applications.filter(
          (app) => app.serverName === this.newItem.serverName
        );
      }
    },
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
    resetApp() {
      this.nameError = false;
      this.serverError = false;
      this.newItem.name = "";
      this.newItem.serverName = "";
      this.newItem.appName = "";

      this.isEditing = false;
    },
    checkDuplicateName() {
      const itemNameLower = this.newItem.name.trim().toLowerCase();
      return this.tasks.some(
        (item) =>
          item.name.trim().toLowerCase() === itemNameLower &&
          (!this.isEditing || item.id !== this.newItem.id)
      );
    },
    getDate() {
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      return `${day}.${month}.${year}`;
    },
    save() {
      if (this.checkDuplicateName()) {
        this.duplicateNameError = true;
        return;
      }

      const SA = this.selectedApp;
      const SS = this.selectedServer;

      this.duplicateNameError = false;

      const formattedDate = this.getDate();

      if (this.isEditing) {
        const index = this.tasks.findIndex(
          (item) => item.id === this.newItem.id
        );
        if (index > -1) {
          if (
            !this.filteredApplications.some(
              (app) =>
                app.serverName === this.newItem.serverName &&
                app.name === this.newItem.appName
            )
          )
            this.newItem.appName = "";

          this.tasks[index] = {
            ...this.newItem,
            last: formattedDate,
          };
        }
      } else {
        const newId = Math.max(...this.tasks.map((item) => item.id)) + 1;

        const newItem = {
          id: newId,
          name: this.newItem.name,
          last: formattedDate,
          dataCreate: formattedDate,
          serverName: this.newItem.serverName,
          appName: this.newItem.appName,
        };

        this.tasks.push(newItem);

        if (!(this.itemsPerPage == -1))
          this.page = Math.ceil((this.totalItems + 1) / this.itemsPerPage);
      }

      this.filteredItem = this.applications.filter(
        (app) => app.serverName === this.newItem.serverName
      );

      this.tasks = [...this.tasks];

      this.resetApp();

      this.selectedApp = SA;
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
      const index = this.tasks.indexOf(this.selectedItem);
      if (index > -1) {
        this.tasks.splice(index, 1);

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

      let filteredItem = this.tasks.filter((item) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(this.search.toLowerCase());
        const matchesServer =
          !this.selectedServer || item.serverName === this.selectedServer;
        const matchesApp =
          !this.selectedApp || item.appName === this.selectedApp;
        return matchesSearch && matchesServer && matchesApp;
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
    selectedApp: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.page = 1;
      }
    },
    search(newVal, oldVal) {
    if (newVal !== oldVal) {
      this.page = 1;
    }
  },
  },
};
</script>
  