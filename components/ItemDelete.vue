<template>
  <v-dialog v-model="dialogDelete" max-width="550px">
    <v-card>
      <v-card-title class="text-h5">{{ $t("deleteInfo") }}</v-card-title>

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
        <v-btn color="blue-darken-1" variant="text" @click="closeDelete">{{
          $t("no")
        }}</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogDelete: false,
      selectedItem: ""
    };
  },
  methods: {
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
  }
};
</script>