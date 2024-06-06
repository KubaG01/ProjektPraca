<template>
  <v-dialog v-model="localDialogDelete" max-width="550px">
    <v-card>
      <v-card-title class="text-h5">{{ $t("deleteInfo") }}</v-card-title>

      <v-card-text>
        <ul>
          <li>{{ $t("ID") }}: {{ selectedItem.id }}</li>
          <li>{{ $t("name") }}: {{ selectedItem.name }}</li>
          <li v-if="selectedItem.serverName">{{ $t("server") }}: {{ selectedItem.serverName }}</li>
          <li v-if="selectedItem.appName">{{ $t("application") }}: {{ selectedItem.appName }}</li>
          <li>{{ $t("last") }}: {{ selectedItem.last }}</li>
          <li>{{ $t("dataCreate") }}: {{ selectedItem.dataCreate }}</li>
        </ul>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="confirmDelete"
        >{{ $t("yes") }}</v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="cancelDelete"
        >{{ $t("no") }}</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialogDelete: {
      type: Boolean,
      required: true,
    },
    selectedItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localDialogDelete: this.dialogDelete,
    };
  },
  watch: {
    dialogDelete(newValue) {
      this.localDialogDelete = newValue;
    },
    localDialogDelete(newValue) {
      if (!newValue) {
        this.$emit("closeDialog");
      }
    },
  },
  methods: {
    confirmDelete() {
      this.$emit("deleteItemConfirm");
      this.localDialogDelete = false;
    },
    cancelDelete() {
      this.localDialogDelete = false;
    },
  },
};
</script>
