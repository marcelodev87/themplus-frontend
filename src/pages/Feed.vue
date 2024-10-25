<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import Banner from 'src/components/shared/Banner.vue';

defineOptions({
  name: 'Feed',
});
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-3">
      <div class="col-5">
        <TitlePage title="Painel de notícias"/>
      </div>
    </header>
    <main>
      <Banner />
    </main>
  </section>
</template>
