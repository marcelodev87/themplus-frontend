<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormAccount from 'src/components/forms/FormAccount.vue';
import { ref } from 'vue';

defineOptions({
  name: 'Account',
});

const showFormAccount = ref<boolean>(false);

const openFormAccount = (): void => {
  showFormAccount.value = true;
};
const closeFormAccount = (): void => {
  showFormAccount.value = false;
};

</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div class="col-6">
        <TitlePage title="Gerenciamento de contas"/>
      </div>
      <div class="col-6 row items-center justify-end ">
        <q-btn
          @click="openFormAccount"
          color="blue-8"
          icon-right="assured_workload"
          label="Contas"
          class="q-mr-sm"
          unelevated
          no-caps
        />
      </div>
    </header>
    <main>
      <FormAccount
        :open="showFormAccount"
        @update:open="closeFormAccount"
      />
    </main>
  </section>
</template>
