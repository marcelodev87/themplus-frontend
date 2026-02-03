<!-- eslint-disable no-restricted-globals -->
<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';
import { useEnterpriseStore } from 'src/stores/enterprise-store';

defineOptions({
  name: 'FormViewEnterprise',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { getEnterprisesView, saveEnterpriseView } = useEnterpriseStore();
const { loadingEnterprise, listViewEnterprise } =
  storeToRefs(useEnterpriseStore());

const dataView = reactive({
  selectedEnterpriseView: null as QuasarSelect<string | null> | null,
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const optionsEnteprise = computed(() => {
  const arr: QuasarSelect<string | null>[] = [];
  listViewEnterprise.value.forEach((item) => {
    arr.push({
      label: item.name,
      value: item.id,
    });
  });
  arr.unshift({
    label: 'Organização atual',
    value: null,
  });
  return arr;
});

const clear = (): void => {
  Object.assign(dataView, {
    selectedEnterpriseView: { label: 'Organização atual', value: null },
  });
};
const fetchViewEnterprises = async () => {
  await getEnterprisesView();
};
const mountOptions = () => {
  listViewEnterprise.value.forEach((item) => {
    if (item.selected) {
      dataView.selectedEnterpriseView = {
        label: item.name,
        value: item.id,
      };
    }
  });
};
const save = async () => {
  await saveEnterpriseView(dataView.selectedEnterpriseView?.value ?? null);
  mountOptions();
  loadingEnterprise.value = false;
  emit('update:open');
};

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchViewEnterprises();
    mountOptions();

    loadingEnterprise.value = false;
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-white form-basic">
      <q-card-section class="bg-grey-1 text-grey-9">
        <div class="text-h6">Visualização de organização</div>
        <div class="text-caption opacity-80">
          Escolha qual organização deseja visualizar
        </div>
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <q-banner
          dense
          rounded
          class="bg-blue-1 text-blue-10 q-mb-md"
          icon="info"
        >
          Se sua organização possui filiais, você pode selecionar qual deseja
          visualizar. Ao escolher uma filial, o acesso será somente leitura. Ao
          fazer login novamente, a visualização volta para a organização atual.
        </q-banner>

        <div class="text-subtitle2 text-grey-8 q-mb-sm">
          Organização para visualização
        </div>

        <q-select
          v-model="dataView.selectedEnterpriseView"
          :readonly="loadingEnterprise"
          :options="optionsEnteprise"
          label="Selecione a organização"
          outlined
          options-dense
          map-options
          use-input
          input-debounce="0"
          behavior="menu"
          dense
        >
          <template v-slot:prepend>
            <q-icon name="apartment" color="grey-7" />
          </template>
        </q-select>
      </q-card-section>

      <q-card-actions class="q-pa-sm">
        <div class="row justify-end full-width q-gutter-sm">
          <q-btn
            flat
            color="red"
            label="Fechar"
            @click="open = false"
            no-caps
          />

          <q-btn
            unelevated
            color="primary"
            label="Salvar"
            :loading="loadingEnterprise"
            @click="save"
            no-caps
          />
        </div>
      </q-card-actions>
      <q-inner-loading
        :showing="loadingEnterprise"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
