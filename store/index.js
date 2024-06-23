import Vue from "vue";
import Vuex from "vuex";
import db from "~/data/db.json";

Vue.use(Vuex);

const store = () =>
  new Vuex.Store({
    state: {
      tasks: [...db.tasks],
      servers: [
        ...db.servers.sort((a, b) =>
          a.name.localeCompare(b.name, { sensitivity: "base" })
        ),
      ],
      applications: [
        ...db.applications.sort((a, b) =>
          a.name.localeCompare(b.name, { sensitivity: "base" })
        ),
      ],
    },
    mutations: {
      updateTasks(state, tasks) {
        state.tasks = tasks;
      },
      updateServers(state, servers) {
        state.servers = servers;
      },
      updateApplications(state, applications) {
        state.applications = applications;
      },
    },
    actions: {
      setTasks({ commit }, tasks) {
        commit("updateTasks", tasks);
      },
      setServers({ commit }, servers) {
        commit("updateServers", servers);
      },
      setApplications({ commit }, applications) {
        commit("updateApplications", applications);
      },
    },
  });

export default store;
