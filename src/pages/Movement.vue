<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';

defineOptions({
  name: 'Movement',
});
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-3">
      <div class="col-8">
        <TitlePage title="Gerenciamento de movimentações"/>
      </div>
      <div class="col-4 row items-center justify-end q-gutter-x-sm">
        <q-btn flat color="black" icon-right="settings" label="Categorias" unelevated no-caps/>
        <q-btn color="negative" icon-right="remove" label="Saida" unelevated no-caps/>
        <q-btn
          color="positive"
          icon-right="add"
          label="Entrada"
          class="q-mr-sm"
          unelevated
          no-caps
        />
      </div>
    </header>
  </section>
</template>
