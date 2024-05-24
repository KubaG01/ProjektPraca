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
                    <v-flex md4>
                      <v-text-field
                        v-model="search"
                        :label="$t('search')"
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-divider :thickness="3" color="grey"></v-divider>
                  <v-data-table
                    :headers="headers"
                    :items="filtered"
                    hide-default-footer
                  >
                    <v-dialog v-model="dialogDelete" max-width="500px">
                      <v-card>
                        <v-card-title class="text-h5"
                          >Are you sure you want to delete this
                          item?</v-card-title
                        >
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="blue-darken-1"
                            variant="text"
                            @click="closeDelete"
                            >Cancel</v-btn
                          >
                          <v-btn
                            color="blue-darken-1"
                            variant="text"
                            @click="deleteItemConfirm"
                            >OK</v-btn
                          >
                          <v-spacer></v-spacer>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>

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
                <span class="text-h5">{{ $t("tasks") }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="newTask.name"
                        :label="$t('name') + '*'"
                        :error="nameError"
                        @blur="checkName"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="newTask.serverName"
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
                        v-model="newTask.appName"
                        :items="aplications"
                        item-text="name"
                        item-value="name"
                        :label="$t('aplication')"
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
                  :disabled="!newTask.name || !newTask.serverName"
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
      dialogDelete: false,
      search: "",
      Add: false,
      headers: [
        { text: this.$t("ID"), value: "id" },
        { text: this.$t("name"), value: "name" },
        { text: this.$t("last"), value: "last" },
        { text: this.$t("dataCreate"), value: "dataCreate" },
        { text: this.$t("server"), value: "serverName" },
        { text: this.$t("aplications"), value: "appName" },
        { text: this.$t("actions"), value: "actions", sortable: false },
      ],
      tasks: db.tasks,
      servers: db.servers,
      aplications: db.aplications,
      selectedApp: null,
      newTask: {
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
    };
  },
  methods: {
    checkName() {
      if (!this.newTask.name.trim()) {
        this.nameError = true;
      } else {
        this.nameError = false;
      }
    },
    checkServer() {
      if (!this.newTask.serverName) {
        this.serverError = true;
      } else {
        this.serverError = false;
      }
    },
    resetApp() {
      this.nameError = false;
      this.serverError = false;
      this.newTask.name = "";
      this.newTask.serverName = "";
      this.newTask.appName = "";
    },
    save() {
      const newId = Math.max(...this.tasks.map((app) => app.id)) + 1;

      const newApp = {
        id: newId,
        name: this.newTask.name,
        last: new Date().toLocaleDateString(),
        dataCreate: new Date().toLocaleDateString(),
        serverName: this.newTask.serverName,
        appName: this.newTask.appName,
      };

      this.tasks.push(newApp);

      this.resetApp();

      this.Add = false;
    },
    editItem(item) {
      this.editedIndex = this.tasks.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem (item) {
        this.editedIndex = this.tasks.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      
    deleteItemConfirm() {
    const index = this.tasks.indexOf(this.selectedApp);
    if (index > -1) {
      this.tasks.splice(index, 1);
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
      return this.tasks.filter((app) => {
        return app.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
};
</script>
  