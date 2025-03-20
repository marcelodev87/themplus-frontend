<!-- eslint-disable no-restricted-globals -->
<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
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
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Visualização de dados de organização" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-banner dense inline-actions class="text-black bg-grey-4" rounded>
            Caso você tenha filial criada pela sua organização
            <span class="text-bold">matriz</span>, você poderá configurar a
            organização que deseja <span class="text-bold">visualizar</span> os
            dados da organização filial. Caso, selecione uma organização filial,
            será permitido apenas ação de
            <span class="text-bold">leitura.</span> Toda vez que você realizar
            login novamente, será resetada a configuração para visualizar os
            dados de sua organização, sendo necessário voltar aqui e selecionar
            a organização que deseja novamente.
          </q-banner>
          <q-select
            v-model="dataView.selectedEnterpriseView"
            :readonly="loadingEnterprise"
            :options="optionsEnteprise"
            label="Lista de organizações"
            filled
            dense
            options-dense
            map-options
            bg-color="white"
            label-color="black"
            use-input
            input-debounce="0"
            behavior="menu"
          >
            <template v-slot:prepend>
              <q-icon name="task_alt" color="black" size="20px" />
            </template>
          </q-select>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            unelevated
            no-caps
          />
          <q-btn
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingEnterprise"
            unelevated
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
