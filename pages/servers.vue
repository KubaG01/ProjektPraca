<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10">
      <v-card>
        <v-card-title class="headline">
          {{ $t("servers") }}
        </v-card-title>
        <v-card-text>
          <v-loyout row>
            <v-flex>
              <v-container fluid class="my-5">
                <v-card class="pa-3">
                  <v-layout row wrap class="pa-3">
                    <v-flex md1>
                      <v-btn
                        small
                        text
                        color="grey"
                        @click="sortBy('id')"
                        style="width: 100%"
                      >
                        <div class="caption grey--text text-capitalize">
                          ID
                          <span v-if="currentSort === 'id'">
                            {{ sortDirections.id === 1 ? "↑" : "↓" }}
                          </span>
                        </div>
                      </v-btn>
                    </v-flex>
                    <v-flex md2>
                      <v-btn
                        small
                        text
                        color="grey"
                        @click="sortBy('name')"
                        style="width: 100%"
                      >
                        <div class="caption grey--text text-capitalize">
                          Name
                          <span v-if="currentSort === 'name'">
                            {{ sortDirections.name === 1 ? "↑" : "↓" }}
                          </span>
                        </div>
                      </v-btn>
                    </v-flex>
                    <v-flex md2>
                      <v-btn
                        small
                        text
                        color="grey"
                        @click="sortBy('last')"
                        style="width: 100%"
                      >
                        <div class="caption grey--text text-capitalize">
                          Last Modified
                          <span v-if="currentSort === 'last'">
                            {{ sortDirections.last === 1 ? "↑" : "↓" }}
                          </span>
                        </div>
                      </v-btn>
                    </v-flex>
                    <v-flex md2>
                      <v-btn
                        small
                        text
                        color="grey"
                        @click="sortBy('dataCreate')"
                        style="width: 100%"
                      >
                        <div class="caption grey--text text-capitalize">
                          Creation Date
                          <span v-if="currentSort === 'dataCreate'">
                            {{ sortDirections.dataCreate === 1 ? "↑" : "↓" }}
                          </span>
                        </div>
                      </v-btn>
                    </v-flex>
                    
                  </v-layout>
                  <v-divider
                    :thickness="3"
                    color="grey"
                    class="my-3"
                  ></v-divider>
                  <div v-for="server in servers" :key="server.id">
                    <v-layout row wrap class="pa-3 align-center">
                      <v-flex xs6 sm1 md1>
                        <div class="text-center">{{ server.id }}</div>
                      </v-flex>
                      <v-flex md2>
                        <div class="text-center">{{ server.name }}</div>
                      </v-flex>
                      <v-flex md2>
                        <div class="text-center">{{ server.last }}r.</div>
                      </v-flex>
                      <v-flex md2>
                        <div class="text-center">{{ server.dataCreate }}r.</div>
                      </v-flex>
                      
                      <v-spacer></v-spacer>
                      <v-flex
                        xs6
                        sm2
                        md2
                        class="text-right"
                        :style="{ maxWidth: '100px' }"
                      >
                        <v-btn class="primary" :style="{ minWidth: '90px' }"
                          >Edytuj</v-btn
                        >
                      </v-flex>
                      <v-flex
                        xs6
                        sm2
                        md2
                        class="text-right mx-2"
                        :style="{ maxWidth: '100px' }"
                      >
                        <v-btn
                          class="error"
                          :style="{ minWidth: '90px' }"
                          @click="Delete = true"
                          >Usuń</v-btn
                        >
                      </v-flex>
                    </v-layout>
                    <v-divider
                      :thickness="3"
                      color="grey"
                      class="my-3"
                    ></v-divider>
                  </div>
                </v-card>
              </v-container>
            </v-flex>
          </v-loyout>
        </v-card-text>
        <v-card-actions md="6">
          <v-spacer />
          <v-dialog v-model="DeleteApp" persistent max-width="500">
            <v-card>
              <v-card-title class="headline"
                >Czy na pewno chcesz usunąć?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="Delete = false"
                  >Anuluj</v-btn
                >
                <v-btn color="red darken-1" text @click="deleteApp">Usuń</v-btn>
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
                <span class="text-h5">{{ $t("servers") }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="newServer.name"
                        label="Name*"
                        :error="nameError"
                        @blur="checkName"
                        required
                      ></v-text-field>
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
                  :disabled="!newServer.name"
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
      Add: false,
      servers: db.servers,
      selectedApp: null,
      currentSort: "id",
      newServer: {
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
    };
  },
  methods: {
    sortBy(prop) {
      if (this.currentSort !== prop) {
        this.currentSort = prop;
        this.sortDirections[prop] = 1;
      } else {
        this.sortDirections[prop] *= -1;
      }

      this.aplications.sort((a, b) => {
        if (a[prop] < b[prop]) return -1 * this.sortDirections[prop];
        if (a[prop] > b[prop]) return 1 * this.sortDirections[prop];
        return 0;
      });
    },
    checkName() {
      if (!this.newServer.name.trim()) {
        this.nameError = true;
      } else {
        this.nameError = false;
      }
    },
    resetApp() {
      this.nameError = false;
      this.newServer.name = "";
    },
    save() {
      const newId = Math.max(...this.aplications.map((app) => app.id)) + 1;

      const newServer = {
        id: newId,
        name: this.newServer.name,
        last: new Date().toLocaleDateString(),
        dataCreate: new Date().toLocaleDateString(),
      };

      this.aplications.push(newServer);

      this.resetApp();

      this.Add = false
      
    },
    confirmDelete() {
      this.Delete = true;
    },
  },
};
</script>
  