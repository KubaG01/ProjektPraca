<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card>
        <v-card-title
          class="text-h1 font-weight-bold d-flex justify-center pa-16"
        >
          {{ $t("project") }}
        </v-card-title>
        <v-card-text class="d-flex justify-center px-14">
          <p>{{ $t("projectDescription") }}</p>
        </v-card-text>
        <v-card-actions>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "IndexPage",
};
</script>
