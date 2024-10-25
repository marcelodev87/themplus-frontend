<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  src: string;
  title: string;
  valueTitle: string | number;
  width: string;
  color: string;
}>();

const containerStyles = computed(() => ({
  overflow: 'hidden',
}));
const imageStyles = computed(() => ({
  width: '60px',
  height: 'auto',
}));
</script>

<template>
  <q-card flat :style="{ width: props.width }" :class="props.color">
    <q-card-section
      class="row justify-around items-center q-pa-none"
      :style="containerStyles"
    >
      <div>
        <q-img fit="contain" :style="imageStyles" :src="props.src" />
      </div>
      <q-card-section class="text column justify-between q-py-sm">
        <div>
          <div class="title">
            {{ title }}
          </div>
          <div class="value-title">
            {{ valueTitle }}
          </div>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>
