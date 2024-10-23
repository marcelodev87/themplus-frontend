<script setup lang="ts">
defineOptions({
  name: 'TitlePage',
});

const props = defineProps<{
  title: string
}>();
</script>

<template>
  <q-toolbar class="bg-grey-3">
    <q-toolbar-title>{{ props.title }}</q-toolbar-title>
  </q-toolbar>
</template>
