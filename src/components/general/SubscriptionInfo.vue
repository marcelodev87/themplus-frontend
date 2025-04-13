<script setup lang="ts">
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'SubscriptionInfo',
});
</script>

<template>
  <q-card class="bg-grey-2 full-width">
    <q-card-section class="q-pa-none">
      <TitlePage title="Gerenciamento de assinatura" />
    </q-card-section>
    <q-card-section class="q-pa-sm q-gutter-y-sm">
      SubscriptionInfo
    </q-card-section>
  </q-card>
</template>
