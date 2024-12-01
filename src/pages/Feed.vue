<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import Banner from 'src/components/shared/Banner.vue';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { ref } from 'vue';

defineOptions({
  name: 'Feed',
});

const showAlertDataEnterprise = ref<boolean>(true);

const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div class="col-5">
        <TitlePage title="Painel de notícias" />
      </div>
    </header>
    <main>
      <Banner />
      <AlertDataEnterprise
        :open="showAlertDataEnterprise"
        @update:open="closeAlertDataEnterprise"
      />
    </main>
  </section>
</template>
