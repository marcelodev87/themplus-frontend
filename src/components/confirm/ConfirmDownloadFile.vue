<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, ref, watch } from 'vue';

defineOptions({
  name: 'ConfirmDownloadFile',
});

const props = defineProps<{
  open: boolean;
  title: string;
}>();
const emit = defineEmits<{
  'update:open': [void];
  'update:ok': ['Excel' | 'PDF'];
}>();

const fileType = ref<'Excel' | 'PDF'>('Excel');

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const confirm = () => {
  emit('update:ok', fileType.value);
};
const close = () => {
  emit('update:open');
};
const clear = (): void => {
  fileType.value = 'Excel';
};

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage :title="props.title" />
      </q-card-section>
      <q-card-section>
        <q-select
          v-model="fileType"
          :options="['Excel', 'PDF']"
          filled
          dense
          options-dense
          bg-color="grey-1"
          label-color="black"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" color="black" size="20px" />
          </template>
        </q-select>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            @click="close"
            color="black"
            flat
            label="Voltar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            @click="confirm"
            color="primary"
            label="Continuar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
