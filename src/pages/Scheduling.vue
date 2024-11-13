<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormEntry from 'src/components/forms/FormEntry.vue';
import FormOut from 'src/components/forms/FormOut.vue';
import FormCategory from 'src/components/forms/FormCategory.vue';
import { ref } from 'vue';
import { Movement } from 'src/ts/interfaces/data/Movement';

defineOptions({
  name: 'Scheduling',
});

const showFormEntry = ref<boolean>(false);
const showFormOut = ref<boolean>(false);
const showFormCategory = ref<boolean>(false);
const selectedDataEdit = ref<Movement | null>(null);

const openFormEntry = (): void => {
  showFormEntry.value = true;
};
const closeFormEntry = (): void => {
  showFormEntry.value = false;
};
const openFormOut = (): void => {
  showFormOut.value = true;
};
const closeFormOut = (): void => {
  showFormOut.value = false;
};
const openFormCategory = (): void => {
  showFormCategory.value = true;
};
const closeFormCategory = (): void => {
  showFormCategory.value = false;
};
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div class="col-5">
        <TitlePage title="Gerenciamento de agendamentos" />
      </div>
      <div class="col-7 row items-center justify-end q-gutter-x-sm">
        <q-btn
          @click="openFormCategory"
          flat
          color="black"
          icon-right="settings"
          label="Categorias"
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
      <FormEntry
        :open="showFormEntry"
        :data-edit="selectedDataEdit"
        title="Agende uma entrada"
        mode="schedule"
        @update:open="closeFormEntry"
      />
      <FormOut
        :open="showFormOut"
        :data-edit="selectedDataEdit"
        title="Agende uma saída"
        mode="schedule"
        @update:open="closeFormOut"
      />
      <FormCategory :open="showFormCategory" @update:open="closeFormCategory" />
    </main>
  </section>
</template>
