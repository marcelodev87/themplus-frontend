<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'Banner',
});

const slideBanner = ref<number>(1);
</script>
<template>
  <div class="full-width" v-show="!$q.screen.lt.md">
    <q-responsive style="width: 100%; height: 300px; overflow: hidden">
      <q-carousel
        animated
        v-model="slideBanner"
        arrows
        infinite
        :autoplay="4000"
        transition-prev="slide-right"
        transition-next="slide-left"
        class="q-pa-none"
      >
        <q-carousel-slide :name="1" class="q-pa-none">
          <q-img
            src="/images/banner/frame-1.png"
            fit="cover"
            class="img-banner"
            height="280px"
          />
        </q-carousel-slide>
        <q-carousel-slide :name="2" class="q-pa-none">
          <q-img
            src="/images/banner/frame-2.png"
            fit="cover"
            class="img-banner"
            height="280px"
          />
        </q-carousel-slide>
      </q-carousel>
    </q-responsive>
  </div>
</template>
