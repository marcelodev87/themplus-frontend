<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormCategoryMovement from 'src/components/forms/FormCategoryMovement.vue';
import FormEntry from 'src/components/forms/FormEntry.vue';
import { ref } from 'vue';

defineOptions({
  name: 'Movement',
});

const showFormCategoryMovement = ref<boolean>(false);
const showFormEntry = ref<boolean>(false);

const openFormCategoryMovement = ():void => {
  showFormCategoryMovement.value = true;
};
const closeFormCategoryMovement = ():void => {
  showFormCategoryMovement.value = false;
};
const openFormEntry = ():void => {
  showFormEntry.value = true;
};
const closeFormEntry = ():void => {
  showFormEntry.value = false;
};
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-3">
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
          color="blue-8"
          icon-right="assured_workload"
          label="Transferências"
          unelevated
          no-caps
        />
        <q-btn color="negative" icon-right="remove" label="Saida" unelevated no-caps/>
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
      <FormEntry
        :open="showFormEntry"
        @update:open="closeFormEntry"
      />
    </main>
  </section>
</template>
