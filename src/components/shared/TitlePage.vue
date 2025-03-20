<script setup lang="ts">
defineOptions({
  name: 'TitlePage',
});

const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <q-toolbar class="bg-grey-1">
    <q-toolbar-title>{{ props.title }}</q-toolbar-title>
  </q-toolbar>
</template>
