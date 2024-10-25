<script setup lang="ts">
import Login from 'src/components/auth/Login.vue';
import Reset from 'src/components/auth/Reset.vue';
import { ref } from 'vue';

defineOptions({
  name: 'Auth',
});

const render = ref<'login' | 'reset'>('login');

const handleChangeRender = (value: 'login' | 'reset') => {
  render.value = value;
};
</script>
<template>
  <section class="container-view row justify-center items-center background-auth">
    <Login
      v-if="render == 'login'"
      @update:change-render="handleChangeRender"
    />
    <Reset
      v-else
      @update:change-render="handleChangeRender"
    />
  </section>
</template>
