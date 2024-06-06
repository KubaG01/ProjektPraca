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
        <v-btn color="blue darken-1" text @click="dialogAdd = false">
          {{ $t("close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialogAdd: Boolean,
    newItem: Object,
    servers: Array,
    filteredAppsByServer: Array,
    nameError: Boolean,
    duplicateNameError: Boolean,
    serverError: Boolean,
  },
  methods: {
    checkName() {
      this.$emit("checkName");
    },
    checkServer() {
      this.$emit("checkServer");
    },
    resetApp() {
      this.$emit("resetApp");
    },
    save() {
      this.$emit("save");
    },
  },
};
</script>