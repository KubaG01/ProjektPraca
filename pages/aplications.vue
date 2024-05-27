<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10">
      <v-card>
        <v-card-title class="headline ma-4">
          {{ $t("aplications") }}
        </v-card-title>
        <v-card-text>
          <v-layout row>
            <v-flex>
              <v-container fluid class="my-5">
                <v-card class="pa-3">
                  <v-layout row wrap class="pa-3">
                    <v-flex md4 class="px-3">
                      <v-text-field
                        v-model="search"
                        :label="$t('search')"
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                      ></v-text-field>
                    </v-flex>
                    <v-flex md4 class="px-3">
                      <v-select
                        v-model="newApplication.selectedServer"
                        :items="servers"
                        item-text="name"
                        item-value="name"
                        :label="$t('servers')"
                        @change="checkApp"
                        @blur="checkApp"
                        clearable
                      ></v-select>
                    </v-flex>
                  </v-layout>
                  <v-divider :thickness="3" color="grey"></v-divider>
                  <v-data-table
                    :headers="headers"
                    :items="filtered"
                    hide-default-footer
                    :items-per-page="-1"
                  >
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
                        @click="deleteItem(item)"
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
              <v-card-title class="text-h5"
                >{{ $t("deleteInfo") }}</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="deleteItemConfirm"
                  >{{ $t("yes") }}</v-btn
                >
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
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
                <span class="text-h5">{{ $t("aplications") }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="newApplication.name"
                        :label="$t('name') + '*'"
                        :error="nameError || duplicateNameError"
                        @blur="checkName"
                        required
                      ></v-text-field>
                      <v-alert v-if="duplicateNameError" type="error">
                        {{ $t("aplication") + $t(" ") +$t("exist") }}
                      </v-alert>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="newApplication.serverName"
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
                  :disabled="!newApplication.name || !newApplication.serverName"
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
      duplicateNameError: false,
      selectedServer: null,
      dialogDelete: false,
      search: "",
      Add: false,
      Edit: false,
      isEditing: false,
      headers: [
        { text: this.$t("ID"), value: "id" },
        { text: this.$t("name"), value: "name" },
        { text: this.$t("last"), value: "last" },
        { text: this.$t("dataCreate"), value: "dataCreate" },
        { text: this.$t("server"), value: "serverName" },
        { text: this.$t("actions"), value: "actions", sortable: false },
      ],
      aplications: db.aplications,
      servers: db.servers,
      filteredApplications: [...db.aplications],
      newApplication: {
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
      if (!this.newApplication.name.trim()) {
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
      if (!this.newApplication.serverName) {
        this.serverError = true;
        this.filteredApplications = [...this.aplications];
      } else {
        this.serverError = false;
        this.filteredApplications = this.aplications.filter(
          (app) => app.serverName === this.newApplication.serverName
        );
      }
    },
    checkApp() {
      if (!this.newApplication.selectedServer) {
        this.filteredApplications = this.aplications;
        this.newApplication.selectedApp = null;
      } else {
        this.filteredApplications = this.aplications.filter(
          (app) => app.serverName === this.newApplication.selectedServer
        );
        this.newApplication.selectedApp = null;
      }
    },
    resetApp() {
      this.nameError = false;
      this.serverError = false;
      this.newApplication.name = "";
      this.newApplication.serverName = "";
      this.newApplication.selectedServer = "";
      this.isEditing = false;
    },
    checkDuplicateName() {
      const aplicationNameLower = this.newApplication.name.trim().toLowerCase();
      return this.aplications.some(
        (task) =>
          task.name.trim().toLowerCase() === taskNameLower &&
          (!this.isEditing || task.id !== this.newApplication.id)
      );
    },
    save() {
      if (this.checkDuplicateName()) {
        this.duplicateNameError = true;
        return;
      }

      this.duplicateNameError = false;

      if (this.isEditing) {
        const index = this.aplications.findIndex(
          (task) => task.id === this.newApplication.id
        );
        if (index > -1) {
          this.aplications[index] = { ...this.newApplication };
        }
      } else {
        const newId = Math.max(...this.aplications.map((app) => app.id)) + 1;

        const newApp = {
          id: newId,
          name: this.newApplication.name,
          last: new Date().toLocaleDateString(),
          dataCreate: new Date().toLocaleDateString(),
          serverName: this.newApplication.serverName,
        };

        this.aplications.push(newApp);
      }

      this.aplications = [...this.aplications];

      this.filteredApplications = this.aplications.filter(
        (app) => app.serverName === this.newApplication.serverName
      );

      this.resetApp();
      this.checkServer();
      this.checkApp();

      this.Add = false;
    },
    editItem(item) {
      this.newApplication = { ...item };
      this.isEditing = true;
      this.Add = true;
      this.checkServer();
    },
    deleteItem(item) {
      this.selectedApp = item;
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const index = this.aplications.indexOf(this.selectedApp);
      if (index > -1) {
        this.aplications.splice(index, 1);
      }
      this.dialogDelete = false;
      this.selectedApp = null;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.selectedApp = null;
    },
  },
  computed: {
    filtered() {
      return this.aplications.filter((task) => {
        const matchesSearch = task.name
          .toLowerCase()
          .includes(this.search.toLowerCase());
        const matchesServer =
          !this.newApplication.selectedServer ||
          task.serverName === this.newApplication.selectedServer;
        const matchesApp =
          !this.newApplication.selectedApp ||
          task.appName === this.newApplication.selectedApp;
        return matchesSearch && matchesServer && matchesApp;
      });
    },
  },
};
</script>
  