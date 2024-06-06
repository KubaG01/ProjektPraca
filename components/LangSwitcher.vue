<template>
  <div>
    <v-btn
      @click="changeLanguage('en')"
      v-if="$i18n.locale !== 'en'"
      color="primary"
      class="me-2"
      >EN <v-icon class="ml-2">mdi-web</v-icon></v-btn
    >
    <v-btn
      @click="changeLanguage('pl')"
      v-if="$i18n.locale !== 'pl'"
      color="primary"
      class="me-2"
      >PL <v-icon class="ml-2">mdi-web</v-icon></v-btn
    >
  </div>
</template>
  
  <script>
export default {
  name: "LangSwitcher",
  methods: {
    changeLanguage(lang) {
      this.$i18n.setLocale(lang);
    },
  },
};
</script>

