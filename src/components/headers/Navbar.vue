<script setup lang="ts">
import UserOptions from './UserOptions.vue';

defineOptions({
  name: 'Navbar',
});
</script>
<template>
  <nav>
    <q-toolbar class="row items-center justify-between">
      <img src="/images/logo.png" width="120px"/>
      <UserOptions />
    </q-toolbar>
  </nav>
</template>
