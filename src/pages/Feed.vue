<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import CardsNews from 'src/components/general/CardsNews.vue';
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

const fetchFeed = async () => {
  await getFeed();
};
const closeAlertDataEnterprise = async (): Promise<void> => {
  showAlertDataEnterprise.value = false;
  await fetchFeed();
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
      <div>
        <TitlePage title="Painel de notícias" />
      </div>
    </header>
    <div style="height: 2px">
      <q-linear-progress
        v-show="loadingFeed"
        indeterminate
        size="2px"
        color="black"
      />
    </div>
    <main>
      <q-scroll-area class="main-scroll column items-center">
        <CardsNews />
      </q-scroll-area>
      <AlertDataEnterprise
        :open="showAlertDataEnterprise"
        @update:open="closeAlertDataEnterprise"
      />
      <!-- <q-inner-loading
        :showing="loadingFeed"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      /> -->
    </main>
  </section>
</template>
