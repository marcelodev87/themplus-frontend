<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRegisterStore } from 'src/stores/register-store';
import TitlePage from './TitlePage.vue';

defineOptions({
  name: 'RegisterDetail',
});

const props = defineProps<{
  dataId: string | null;
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingRegisterDetail, registerDetail } =
  storeToRefs(useRegisterStore());
const { getRegisterDetail } = useRegisterStore();

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  if (open.value && props.dataId !== null) {
    await getRegisterDetail(props.dataId);
  }
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Detalhes do registro" />
      </q-card-section>
      <q-card-section>
        <div class="text-body2">
          {{ registerDetail }}
        </div>
        <q-inner-loading
          :showing="loadingRegisterDetail"
          label="Carregando os dados..."
          label-class="black"
          label-style="font-size: 1.1em"
          color="primary"
          size="50px"
        />
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            @click="emit('update:open')"
            color="red"
            flat
            label="Fechar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
