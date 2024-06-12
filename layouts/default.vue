<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" app>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `${miniVariant ? "menu" : "chevron-left"}` }}</v-icon>
      </v-btn>

      <v-spacer />
      <LangSwitcher direction="bottom" class="ml-2" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer :absolute="!fixed" app>
      <v-spacer /><span>&copy; {{ new Date().getFullYear() }} Jakub Głąbiak</span>
    </v-footer>
  </v-app>
</template>

<script>
import LangSwitcher from "~/components/LangSwitcher";

export default {
  name: "DefaultLayout",
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      miniVariant: false,
      right: false,
      rightDrawer: true,
      title: "Vuetify.js",
    };
  },
  computed: {
    items() {
      const locale = this.$i18n.locale;
      const paths = {
        en: {
          servers: "servers",
          applications: "applications",
          tasks: "tasks",
        },
        pl: {
          servers: "serwery",
          applications: "aplikacje",
          tasks: "zadania",
        },
      };

      return [
        {
          icon: "mdi-server",
          title: this.$t("servers"),
          to: `/${locale}/servers`,// to: `/${locale}/${paths[locale].servers}`,
        },
        {
          icon: "mdi-application-braces",
          title: this.$t("applications"),
          to: `/${locale}/applications`,// to: `/${locale}/${paths[locale].applications}`,
        },
        {
          icon: "mdi-calendar-check-outline",
          title: this.$t("tasks"),
          to: `/${locale}/tasks`,// to: `/${locale}/${paths[locale].tasks}`,
        },
      ];
    },
  },
  components: {
    LangSwitcher,
  },
};
</script>

