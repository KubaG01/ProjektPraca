<template>
  <v-dialog v-model="dialogAdd" persistent max-width="800px" @input="resetApp">
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
        <span class="text-h5">{{ $t(neww) }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col :cols="typeName == 'application' ? 6 : 12">
              <v-text-field
                v-model="newItem.name"
                :label="$t('name') + '*'"
                :error="nameError || duplicateNameError"
                @blur="checkName"
                required
              ></v-text-field>
              <v-alert v-if="duplicateNameError" type="error">
                {{ $t(typeName) + " " + $t("exist") }}
              </v-alert>
            </v-col>

            <v-col cols="6" v-if="this.typeName != 'server'">
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
            <v-col cols="12" sm="6" v-if="this.typeName == 'task'">
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
          :disabled="(!newItem.name || (this.typeName !== 'server' && !newItem.serverName))"

          @click="save"
        >
          {{ $t("save") }}
        </v-btn>
        <v-btn color="blue darken-1" text @click="dialogAdd = false">
          {{ $t("close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import db from "~/data/db.json";

export default {
  props: {
    typeName: String,
  },
  data() {
    return {
      TypePage: "",
      dialogAdd: false,
      nameError: false,
      serverError: false,
      isEditing: false,
      formattedDate: "",
      neww: "",
      duplicateNameError: false,
      tasks: db.tasks,
      servers: db.servers.sort((a, b) => a.name.localeCompare(b.name)),
      applications: db.applications.sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
      filteredAppsByServer: [...db.applications],
      filteredApplications: [...db.applications],
      newItem: {
        id: null,
        name: "",
        ...(this.typeName !== "server" && { serverName: "" }),// serverName: "",
        ...(this.typeName === "task" && { appName: "" }), // appName: "",
      },
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
        if (this.typeName == "task") {
          this.filteredAppsByServer = [...this.applications];
        }
      } else {
        this.serverError = false;
        if (this.typeName == "task") {
          this.filteredAppsByServer = this.applications.filter(
            (app) => app.serverName === this.newItem.serverName
          );
        }
      }
    },
    resetApp() {
      this.isEditing = false;
      this.nameError = false;
      this.newItem.name = "";

      if (this.typeName !== "server") {
        this.newItem.serverName = "";
        this.serverError = false;
        if (this.typeName == "task") {
          this.newItem.appName = "";
        }
      }
    },
    checkDuplicateName() {
      const itemNameLower = this.newItem.name.trim().toLowerCase();
      return this.TypePage.some(
        (item) =>
          item.name.trim().toLowerCase() === itemNameLower &&
          (!this.isEditing || item.id !== this.newItem.id)
      );
    },
    getDate() {
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const year = currentDate.getFullYear();
      return `${day}.${month}.${year}`;
    },
    editItem(item) {
      this.newItem = { ...item };
      this.isEditing = true;
      this.dialogAdd = true;
      if (this.typeName != "server") {
        this.checkServer();
      }
    },
    save() {
      if (this.checkDuplicateName()) {
        this.duplicateNameError = true;
        return;
      }

      this.duplicateNameError = false;
      const formattedDate = this.getDate();

      if (this.isEditing) {
        const index = this.TypePage.findIndex(
          (item) => item.id === this.newItem.id
        );
        if (index > -1) {
          if (
            (this.typeName =
              "task" &&
              !this.filteredApplications.some(
                (app) =>
                  app.serverName === this.newItem.serverName &&
                  app.name === this.newItem.appName
              ))
          ) {
            this.newItem.appName = "";
          }

          this.TypePage[index] = {
            ...this.newItem,
            last: formattedDate,
          };
        }
      } else {
        const newId = Math.max(...this.TypePage.map((item) => item.id)) + 1;

        const newItem = {
          id: newId,
          name: this.newItem.name,
          last: formattedDate,
          dataCreate: formattedDate,
        };

        if (this.typeName != "server") {
          newItem.serverName = this.newItem.serverName;
        }

        if (this.typeName == "task") {
          newItem.appName = this.newItem.appName;
        }

        this.TypePage.push(newItem);

        if (!(this.itemsPerPage == -1))
          this.page = Math.ceil((this.totalItems + 1) / this.itemsPerPage);
      }

      this.TypePage = [...this.TypePage];
      this.$emit("update:typePage", this.TypePage);
      this.resetApp();

      this.dialogAdd = false;
    },
  },
  created() {
    const localTypeName = this.typeName
    switch (localTypeName) {
      case "task":
        this.neww = this.$t("newTask");
        this.TypePage = this.tasks;
        break;
      case "application":
        this.neww = this.$t("newApp");
        this.TypePage = this.applications;
        break;
      case "server":
        this.neww = this.$t("newServer");
        this.TypePage = this.servers;
        break;
    }
  },
};
</script>