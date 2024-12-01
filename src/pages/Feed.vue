<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import Banner from 'src/components/shared/Banner.vue';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useFeedStore } from 'src/stores/feed-store';

defineOptions({
  name: 'Feed',
});

const { loadingFeed, filledData } = storeToRefs(useFeedStore());
const { getFeed } = useFeedStore();

const showAlertDataEnterprise = ref<boolean>(false);

const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const fetchFeed = async () => {
  await getFeed();
};

watch(
  filledData,
  () => {
    if (!filledData.value) {
      showAlertDataEnterprise.value = true;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await fetchFeed();
});
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
      <q-inner-loading
        :showing="loadingFeed"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </main>
  </section>
</template>
