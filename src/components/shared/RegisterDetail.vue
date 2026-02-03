<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRegisterStore } from 'src/stores/register-store';

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
    <q-card style="width: 550px; max-width: 95vw">
      <q-card-section class="q-pa-none">
        <div
          class="bg-grey-1 text-grey-9 q-pa-md row items-center justify-between"
        >
          <div class="row items-center q-gutter-x-sm">
            <q-icon name="assignment" size="sm" />
            <div class="text-h6 text-weight-medium">Detalhes do Registro</div>
          </div>
          <q-btn icon="close" flat round dense v-close-popup color="white" />
        </div>
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <div
          v-if="!registerDetail && !loadingRegisterDetail"
          class="column items-center q-pa-xl text-grey-6"
        >
          <q-icon name="search_off" size="xl" color="grey-4" />
          <div class="text-subtitle1 q-mt-sm">
            Nenhuma informação disponível
          </div>
        </div>

        <q-list v-else dense class="q-gutter-y-sm">
          <div class="q-mt-md">
            <div class="q-pa-md rounded-borders text-body2 text-grey-9">
              {{ registerDetail }}
            </div>
          </div>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md bg-grey-1">
        <q-btn
          label="Fechar"
          color="red"
          v-close-popup
          unelevated
          no-caps
          class="q-px-md"
        />
      </q-card-actions>
      <q-inner-loading
        :showing="loadingRegisterDetail"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
