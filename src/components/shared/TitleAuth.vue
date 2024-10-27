<script setup lang="ts">
defineOptions({
  name: 'TitleAuth',
});

const props = defineProps<{
  title: string
}>();
</script>

<template>
  <q-toolbar >
    <q-toolbar-title>{{ props.title }}</q-toolbar-title>
  </q-toolbar>
</template>
