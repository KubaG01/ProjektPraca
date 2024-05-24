<template>
    <v-app>
      
        <v-btn @click="changeLanguage('en')" color="primary">EN</v-btn>
        <v-btn @click="changeLanguage('pl')" color="primary">PL</v-btn>
      
    </v-app>
  </template>
  
  <script>
  export default {
    name: 'LangSwitcher',
    methods: {
      changeLanguage(lang) {
        this.$i18n.locale = lang;
      },
    },
  };
  </script>

