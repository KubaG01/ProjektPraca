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
                @input="checkName"
                required
              ></v-text-field>
              <v-alert
                :value="duplicateNameError"
                type="error"
                transition="scale-transition"
              >
                {{ $t(typeName) + " " + $t("exist") }}
              </v-alert>
            </v-col>

            <v-col cols="6" v-if="this.typeName != 'server'">
              <v-select
                v-model="newItem.serverName"
                :items="localServers"
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
          :disabled="
            !newItem.name.trim() ||
            duplicateNameError ||
            (this.typeName != 'server' && !newItem.serverName)
          "
          @click="saveItem"
        >
          {{ $t("save") }}
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="
            () => {
              dialogAdd = false;
              resetApp();
            }
          "
        >
          {{ $t("close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  props: {
    typeName: String,
    typePage: Array,
  },
  data() {
    return {
      localTypePage: this.typePage,
      dialogAdd: false,
      nameError: false,
      serverError: false,
      isEditing: false,
      formattedDate: "",
      neww: "",
      duplicateNameError: false,
      filteredAppsByServer: [],
      filteredApplications: [],
      localServers: [],
      newItem: {
        id: null,
        name: "",
        ...(this.typeName != "server" && { serverName: "" }), // serverName: "",
        ...(this.typeName == "task" && { appName: "" }), // appName: "",
      },
    };
  },
  methods: {
    checkName() {
      if (!this.newItem.name.trim()) {
        this.nameError = true;
      } else {
        this.nameError = false;
      }

      if (this.checkDuplicateName()) {
        this.duplicateNameError = true;
      } else {
        this.duplicateNameError = false;
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
      this.serverError = false;
      this.newItem.name = "";
      this.duplicateNameError = false;
      this.neww = this.neww.replace(/^edit/, "new");

      if (this.typeName != "server") {
        this.newItem.serverName = "";
        if (this.typeName == "task") {
          this.newItem.appName = "";
        }
      }
    },
    checkDuplicateName() {
      const itemNameLower = this.newItem.name.trim().toLowerCase();
      return this.localTypePage.some(
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
      this.neww = this.neww.replace(/^new/, "edit");
      this.dialogAdd = true;
      if (this.typeName != "server") {
        this.checkServer();
      }
    },
    saveItem() {
      if (this.checkDuplicateName()) {
        this.duplicateNameError = true;
        return;
      }

      this.duplicateNameError = false;
      const formattedDate = this.getDate();

      if (this.isEditing) {
        const index = this.localTypePage.findIndex(
          (item) => item.id === this.newItem.id
        );
        if (index > -1) {
          if (
            this.typeName == "task" &&
            !this.filteredApplications.some(
              (app) =>
                app.serverName === this.newItem.serverName &&
                app.name === this.newItem.appName
            )
          ) {
            this.newItem.appName = "";
          }

          this.localTypePage[index] = {
            ...this.newItem,
            last: formattedDate,
          };

          this.$emit("save", this.localTypePage[index]);
        }
      } else {
        const newId =
          Math.max(...this.localTypePage.map((item) => item.id)) + 1;

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

        this.$emit("save", newItem);
      }

      this.resetApp();
      this.dialogAdd = false;
    },
  },
  computed: {
    ...mapState(["tasks", "servers", "applications"]),
  },
  created() {
    this.filteredAppsByServer = [
      ...this.applications.sort((a, b) =>
        a.name.localeCompare(b.name, { sensitivity: "base" })
      ),
    ];

    this.filteredApplications = [
      ...this.applications.sort((a, b) =>
        a.name.localeCompare(b.name, { sensitivity: "base" })
      ),
    ];

    this.localServers = [
      ...this.servers.sort((a, b) =>
        a.name.localeCompare(b.name, { sensitivity: "base" })
      ),
    ];

    this.$root.$on("updateTypePage", (newTypePage) => {
      this.localTypePage = newTypePage.sort((a, b) =>
        a.name.localeCompare(b.name, { sensitivity: "base" })
      );
    });

    switch (this.typeName) {
      case "task":
        this.neww = "newTask";
        break;
      case "application":
        this.neww = "newApp";
        break;
      case "server":
        this.neww = "newServer";
        break;
    }
  },
};
</script>