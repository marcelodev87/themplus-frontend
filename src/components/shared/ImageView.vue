<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'ImageView',
});

const props = defineProps<{
  open: boolean;
  url: string | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2" style="min-width: 1000px; max-width: 100vw">
      <div class="q-col-gutter-md row items-start">
        <q-img :src="props.url ?? ''">
          <div class="absolute-bottom text-subtitle1 text-center">
            <q-btn
              @click="open = false"
              color="red"
              icon="close"
              size="md"
              rounded
            />
          </div>
        </q-img>
      </div>
    </q-card>
  </q-dialog>
</template>
