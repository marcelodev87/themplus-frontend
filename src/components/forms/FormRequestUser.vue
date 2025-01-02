<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';
import { useEnterpriseStore } from 'src/stores/enterprise-store';

defineOptions({
  name: 'FormRequestUser',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingEnterprise, listSearchEnterprise } =
  storeToRefs(useEnterpriseStore());
const { searchEnterprise, clearResultSearchEnterprise } = useEnterpriseStore();

const dataRequest = reactive({
  search: '' as string,
  selectedUser: null as QuasarSelect<string> | null,
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const resultEnterpriseSelect = computed(() => {
  return listSearchEnterprise.value.map((item) => {
    return {
      label: `Nome: ${item.name} | E-mail: ${item.email} | ${item.cpf !== null ? `CPF: ${item.cpf}` : `CNPJ: ${item.cnpj}`}`,
      value: item.id,
    };
  });
});

const clear = (): void => {
  Object.assign(dataRequest, {
    selectedUser: null,
    search: '',
  });
  clearResultSearchEnterprise();
};
const filterEnterprise = async () => {
  await searchEnterprise(dataRequest.search);
};
const sendRequest = () => {
  console.log('teste');
};

watch(open, async () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic" style="min-width: 50vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Dados do perfil" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form>
          <div class="q-gutter-y-sm">
            <q-input
              v-model="dataRequest.search"
              bg-color="white"
              label-color="black"
              filled
              label="Pesquise por Nome, E-mail, CPF ou CNPJ"
              dense
              input-class="text-black"
              :loading="loadingEnterprise"
            >
              <template v-slot:prepend>
                <q-icon name="person" color="black" size="20px" />
              </template>
              <template v-slot:append>
                <q-icon
                  @click="filterEnterprise"
                  name="search"
                  color="black"
                  size="20px"
                  class="cursor-pointer"
                >
                  <q-tooltip> Pesquisar </q-tooltip>
                </q-icon>
              </template>
            </q-input>
            <q-select
              filled
              v-model="dataRequest.selectedUser"
              :label="
                listSearchEnterprise.length === 0
                  ? 'Sem resultado'
                  : 'Selecione um usuário'
              "
              :options="resultEnterpriseSelect"
              :loading="loadingEnterprise"
              :readonly="listSearchEnterprise.length === 0"
              style="width: 250px"
              behavior="menu"
              bg-color="white"
              clearable
              dense
              options-dense
              map-options
              label-color="black"
              class="full-width"
            >
              <template v-slot:prepend>
                <q-icon name="list" color="black" size="20px" />
              </template>
            </q-select>
          </div>
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
            v-show="dataRequest.selectedUser !== null"
            @click="sendRequest"
            :loading="loadingEnterprise"
            color="primary"
            label="Solicitar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
