<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormCategoryMovement from 'src/components/forms/FormCategoryMovement.vue';
import FormEntry from 'src/components/forms/FormEntry.vue';
import FormOut from 'src/components/forms/FormOut.vue';
import FormTransfer from 'src/components/forms/FormTransfer.vue';
import { ref } from 'vue';

defineOptions({
  name: 'Movement',
});

const showFormCategoryMovement = ref<boolean>(false);
const showFormTransfer = ref<boolean>(false);
const showFormEntry = ref<boolean>(false);
const showFormOut = ref<boolean>(false);

const openFormCategoryMovement = ():void => {
  showFormCategoryMovement.value = true;
};
const closeFormCategoryMovement = ():void => {
  showFormCategoryMovement.value = false;
};
const openFormTransfer = (): void => {
  showFormTransfer.value = true;
};
const closeFormTransfer = (): void => {
  showFormTransfer.value = false;
};
const openFormEntry = ():void => {
  showFormEntry.value = true;
};
const closeFormEntry = ():void => {
  showFormEntry.value = false;
};
const openFormOut = ():void => {
  showFormOut.value = true;
};
const closeFormOut = ():void => {
  showFormOut.value = false;
};
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div class="col-5">
        <TitlePage title="Gerenciamento de movimentações"/>
      </div>
      <div class="col-7 row items-center justify-end q-gutter-x-sm">
        <q-btn
          @click="openFormCategoryMovement"
          flat
          color="black"
          icon-right="settings"
          label="Categorias"
          unelevated
          no-caps
        />
        <q-btn
          @click="openFormTransfer"
          color="blue-8"
          icon-right="assured_workload"
          label="Transferências"
          unelevated
          no-caps
        />
        <q-btn
          @click="openFormOut"
          color="negative"
          icon-right="remove"
          label="Saida"
          unelevated
          no-caps
        />
        <q-btn
          @click="openFormEntry"
          color="positive"
          icon-right="add"
          label="Entrada"
          class="q-mr-sm"
          unelevated
          no-caps
        />
      </div>
    </header>
    <main>
      <FormCategoryMovement
        :open="showFormCategoryMovement"
        @update:open="closeFormCategoryMovement"
      />
      <FormTransfer
        :open="showFormTransfer"
        @update:open="closeFormTransfer"
      />
      <FormEntry
        :open="showFormEntry"
        title="Registre uma entrada"
        mode="movement"
        @update:open="closeFormEntry"
      />
      <FormOut
        :open="showFormOut"
        title="Registre uma saída"
        mode="movement"
        @update:open="closeFormOut"
      />
    </main>
  </section>
</template>
