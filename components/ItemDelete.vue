<template>
  <v-dialog v-model="dialogDelete" max-width="550px">
    <v-card>
      <v-card-title class="text-h5">{{ $t("deleteInfo") }}</v-card-title>

      <v-card-text>
        <ul>
          <li>{{ $t("ID") }}: {{ selectedItem.id }}</li>
          <li>{{ $t("name") }}: {{ selectedItem.name }}</li>
          <li v-if="selectedItem.serverName">
            {{ $t("server") }}: {{ selectedItem.serverName }}
          </li>
          <li v-if="selectedItem.appName">
            {{ $t("application") }}: {{ selectedItem.appName }}
          </li>
          <li>{{ $t("last") }}: {{ selectedItem.last }}</li>
          <li>{{ $t("dataCreate") }}: {{ selectedItem.dataCreate }}</li>
        </ul>
        <v-divider></v-divider>
        <p></p>
        <v-alert
          v-if="ErrDeleteApp.length > 0 || ErrDeleteTask.length > 0"
          dense
          outlined
          type="error"
        >
          <strong>{{ $t("deleteError") }}</strong>
          <ul>
            <li v-for="app in ErrDeleteApp" :key="app.id" >
              {{ $t("application") }} ID: {{ app.id }}, {{ $t("name") }}:
              {{ app.name }}
            </li>
            <p></p>
            <li v-for="task in ErrDeleteTask" :key="task.id">
              {{ $t("task") }} ID: {{ task.id }}, {{ $t("name") }}:
              {{ task.name }}
            </li>
          </ul>
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="ErrDeleteApp.length == 0 && ErrDeleteTask.length == 0" color="blue-darken-1" variant="text" @click="confirmDelete">{{
          $t("yes")
        }}</v-btn>
        <v-btn v-if="ErrDeleteApp.length == 0 && ErrDeleteTask.length == 0" color="blue-darken-1" variant="text" @click="cancelDelete">{{
          $t("no")
        }}</v-btn>
        <v-btn v-if="ErrDeleteApp.length > 0 || ErrDeleteTask.length > 0" color="blue-darken-1" variant="text" @click="cancelDelete">{{
          $t("cancel")
        }}</v-btn>       
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    typeName: String,
    typePage: Array,
    tasks: Array,
    applications: Array,
  },
  data() {
    return {
      dialogDelete: false,
      selectedItem: {},
      localTypePage: this.typePage,
      ErrDeleteApp: [],
      ErrDeleteTask: [],
    };
  },
  methods: {
    deleteItem(item) {
      this.selectedItem = item;
      this.dialogDelete = true;
      this.checkDelete();
    },
    checkDelete() {
      if (this.typeName == "server") {
        this.ErrDeleteApp = this.applications.filter(
          (app) => app.serverName === this.selectedItem.name
        );

        this.ErrDeleteTask = this.tasks.filter(
          (task) => task.serverName === this.selectedItem.name
        );

        if (this.ErrDeleteApp.length > 0 || this.ErrDeleteTask.length > 0) {
          //console.log(this.ErrDeleteApp, this.ErrDeleteTask);
        } else {
          return true;
        }
      } else if (this.typeName == "application") {
        this.ErrDeleteTask = this.tasks.filter(
          (task) => task.appName === this.selectedItem.name
        );

        if (this.ErrDeleteTask.length > 0) {
          //console.log(this.ErrDeleteTask);
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    confirmDelete() {
      if (this.ErrDeleteApp.length === 0 && this.ErrDeleteTask.length === 0) {
        const index = this.localTypePage.indexOf(this.selectedItem);
        if (index > -1) {
          this.localTypePage.splice(index, 1);
        }
        this.localTypePage = [...this.localTypePage];
        this.$emit("update:typePage", this.localTypePage);
      }

      this.cancelDelete();
    },
    cancelDelete() {
      this.selectedItem = {};
      this.dialogDelete = false;
      this.ErrDeleteApp = [];
      this.ErrDeleteTask = [];
    },
  },
};
</script>
