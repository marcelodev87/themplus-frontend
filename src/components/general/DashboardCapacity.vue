<script setup lang="ts">
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'DashboardCapacity',
});
</script>

<template>
  <q-card class="bg-grey-2 full-width">
    <q-card-section class="q-pa-none">
      <TitlePage title="Painel de capacidade" />
    </q-card-section>
    <q-card-section class="q-pa-sm q-gutter-y-sm">
      DashboardCapacity
    </q-card-section>
  </q-card>
</template>
