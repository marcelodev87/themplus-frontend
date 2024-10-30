<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormDepartment from 'src/components/forms/FormDepartment.vue';
import { ref } from 'vue';

defineOptions({
  name: 'Department',
});

const showFormDepartment = ref<boolean>(false);

const openFormDepartment = (): void => {
  showFormDepartment.value = true;
};
const closeFormDepartment = (): void => {
  showFormDepartment.value = false;
};
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div class="col-5">
        <TitlePage title="Gerenciamento de departamentos" />
      </div>
      <div class="col-7 row items-center justify-end q-gutter-x-sm">
        <q-btn
          @click="openFormDepartment"
          color="blue-8"
          icon-right="groups"
          label="Departamentos"
          unelevated
          no-caps
          class="q-mr-sm"
        />
      </div>
    </header>
    <main>
      <FormDepartment
        :open="showFormDepartment"
        @update:open="closeFormDepartment"
      />
    </main>
  </section>
</template>
