<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormAlert from 'src/components/forms/FormAlert.vue';
import { ref } from 'vue';

defineOptions({
  name: 'Alert',
});

const showFormAlert = ref<boolean>(false);

const openFormAlert = ():void => {
  showFormAlert.value = true;
};
const closeFormAlert = ():void => {
  showFormAlert.value = false;
};
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
        <div class="col-6">
            <TitlePage title="Gerenciamento de alertas"/>
        </div>
        <div class="col-6 row items-center justify-end q-gutter-x-sm">
        <q-btn
          @click="openFormAlert"
          color="blue-8"
          icon-right="warning"
          label="Alertas"
          class="q-mr-sm"
          unelevated
          no-caps
        />
      </div>
    </header>
    <main>
        <FormAlert
        :open="showFormAlert"
        @update:open="closeFormAlert"
      />
    </main>
  </section>
</template>
