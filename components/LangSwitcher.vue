<template>
  <div>
    <v-btn @click="changeLanguage('en')" color="primary" class="me-2">EN</v-btn>
    <v-btn @click="changeLanguage('pl')" color="primary" class="me-2">PL</v-btn>
  </div>
</template>
  
  <script>

export default {
  name: "LangSwitcher",
  methods: {
    async changeLanguage(lang) {
      if (this.$route.path === "/pl" || this.$route.path === "/en") {
        this.$router.push(`/${lang}`);
      } else if (this.$i18n.locale !== lang){
        this.$i18n.locale = lang;
        const currentPath = this.$router.currentRoute.path;
        const newPath = `/${lang}${currentPath.substr(3)}`;
        
        await this.$router.push(newPath);

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        window.location.reload();
      }
    },
  },
};
</script>

