<template>
  <v-data-table
    :headers="headers"
    :items="filtered"
    :items-per-page="itemsPerPage"
    :page.sync="localPage"
    :server-items-length="totalItems"
    :sort-by.sync="localSortBy"
    :sort-desc.sync="localSortDesc"
    :footer-props="{
      'items-per-page-options': [5, 10, 15, 20, 50, -1],
      'items-per-page-text': $t('itemsPerPage'),
      'items-per-page-all-text': $t('all'),
      'pagination-text': paginationText,
    }"
    :no-data-text="$t('noData')"
    @update:items-per-page="updateItemsPerPage"
    @edit-item="$emit('edit-item', $event)"
    @delete-item="$emit('delete-item', $event)"
  >
    <template v-slot:[`footer.page-text`]="{ pageStart, pageStop, itemsLength }">
      {{ pageStart }}-{{ pageStop }} {{ $t("of") }}
      {{ itemsLength }}
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        class="me-2"
        size="small"
        @click="$emit('edit-item', item)"
        color="primary"
      >
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="$emit('delete-item', item)" color="error">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    headers: Array,
    filtered: Array,
    itemsPerPage: Number,
    page: Number,
    totalItems: Number,
    sortBy: String,
    sortDesc: Boolean,
  },
  data() {
    return {
      localSortBy: this.sortBy,
      localSortDesc: this.sortDesc,
      localPage: this.page,
    };
  },
  methods: {
    updateItemsPerPage(value) {
      this.$emit("update:items-per-page", value);
    },
    updatePage() {
      this.$emit("update:page", this.localPage);
    },
  },
  computed: {
    paginationText() {
      const start = (this.page - 1) * this.itemsPerPage + 1;
      const end = Math.min(start + this.itemsPerPage - 1, this.totalItems);
      return `${start} - ${end} ${this.$t("of")} ${this.totalItems}`;
    },
  },
  watch: {
    sortBy(newVal) {
      this.localSortBy = newVal;
    },
    sortDesc(newVal) {
      this.localSortDesc = newVal;
    },
    localSortBy(newVal) {
      this.$emit("update:sort-by", newVal);
    },
    localSortDesc(newVal) {
      this.$emit("update:sort-desc", newVal);
    },
  },
};
</script>
