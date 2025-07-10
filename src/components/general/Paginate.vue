<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'Paginate',
});

const currentPage = defineModel<number>({ required: true });
const props = withDefaults(
  defineProps<{
    maxPages?: number;
    max: number;
    length: number;
  }>(),
  {
    maxPages: 6,
  }
);

const hasItem = computed(() => {
  return props.length > 0;
});
</script>

<template>
  <div
    v-show="hasItem"
    class="flex justify-between full-width items-center q-py-sm"
  >
    <q-pagination
      style="width: 96%; justify-content: center"
      v-show="hasItem"
      class="flex justify-between"
      v-model="currentPage"
      :max="props.max"
      :max-pages="props.maxPages"
      rounded
      direction-links
      boundary-links
      color="contabilidade"
      active-text-color="white"
      text-color="red-9"
      icon-first="skip_previous"
      icon-last="skip_next"
      icon-prev="fast_rewind"
      icon-next="fast_forward"
    />
    <span class="text-red-9">Total: {{ props.length }}</span>
  </div>
</template>
