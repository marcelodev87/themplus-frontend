<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormUser from 'src/components/forms/FormUser.vue';
import { ref } from 'vue';

defineOptions({
  name: 'User',
});

const showFormUser = ref<boolean>(false);

const openFormUser = (): void => {
  showFormUser.value = true;
};
const closeFormUser = (): void => {
  showFormUser.value = false;
};
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div class="col-6">
        <TitlePage title="Gerenciamento de usuários" />
      </div>
      <div class="col-6 row items-center justify-end q-gutter-x-sm">
        <q-btn
          @click="openFormUser"
          color="blue-8"
          icon-right="group_add"
          label="Usuários"
          class="q-mr-sm"
          unelevated
          no-caps
        />
      </div>
    </header>
    <main>
      <FormUser :open="showFormUser" @update:open="closeFormUser" />
    </main>
  </section>
</template>
