<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { Notify } from 'quasar';
import { useOrderStore } from 'src/stores/order-store';
import { OrderCounter } from 'src/ts/interfaces/data/Order';

defineOptions({
  name: 'FormRequestUser',
});

const props = defineProps<{
  open: boolean;
  dataEdit: OrderCounter | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingEnterprise, listSearchEnterprise } =
  storeToRefs(useEnterpriseStore());
const { searchEnterprise, clearResultSearchEnterprise } = useEnterpriseStore();
const { loadingOrder } = storeToRefs(useOrderStore());
const { sendRequestEnterprise, updateRequestEnterprise } = useOrderStore();

const dataRequest = reactive({
  search: '' as string,
  description: '' as string,
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
    description: '',
  });
  clearResultSearchEnterprise();
};
const filterEnterprise = async () => {
  if (dataRequest.search.trim() !== '') {
    await searchEnterprise(dataRequest.search);
  } else {
    Notify.create({
      message: 'Necessário ter algum valor diferente de vazio',
      type: 'negative',
    });
  }
};
const sendRequest = async () => {
  const response = await sendRequestEnterprise(
    dataRequest.selectedUser?.value ?? '',
    dataRequest.description.trim() === '' ? null : dataRequest.description
  );
  if (response?.status === 201) {
    emit('update:open');
  }
};
const checkEdit = () => {
  if (props.dataEdit !== null) {
    Object.assign(dataRequest, {
      description: props.dataEdit.description,
    });
  }
};
const update = async () => {
  const response = await updateRequestEnterprise(
    props.dataEdit?.id ?? '',
    dataRequest.description.trim() === '' ? null : dataRequest.description
  );
  if (response?.status === 200) {
    emit('update:open');
  }
};

watch(open, async () => {
  if (open.value) {
    clear();
    checkEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic" style="min-width: 50vw">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="
            props.dataEdit === null
              ? 'Envie uma solicitação '
              : 'Edite a sua solicitação'
          "
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form>
          <div class="q-gutter-y-sm">
            <q-input
              v-show="props.dataEdit === null"
              v-model="dataRequest.search"
              bg-color="white"
              label-color="black"
              filled
              label="Pesquise por E-mail, CPF ou CNPJ"
              dense
              input-class="text-black"
              :loading="loadingEnterprise"
              :readonly="loadingOrder"
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
              v-show="props.dataEdit === null"
              filled
              v-model="dataRequest.selectedUser"
              :label="
                listSearchEnterprise.length === 0
                  ? 'Sem resultado'
                  : 'Selecione um usuário'
              "
              :options="resultEnterpriseSelect"
              :loading="loadingEnterprise"
              :readonly="listSearchEnterprise.length === 0 || loadingOrder"
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
            <q-input
              v-model="dataRequest.description"
              style="height: 150px; max-height: 130px"
              bg-color="white"
              label-color="black"
              filled
              label="Digite uma descrição"
              dense
              input-class="text-black no-resize"
              type="textarea"
              class="no-resize"
            >
              <template v-slot:prepend>
                <q-icon name="description" color="black" size="20px" />
              </template>
            </q-input>
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
            :loading="loadingEnterprise || loadingOrder"
            color="primary"
            label="Solicitar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-show="props.dataEdit !== null"
            @click="update"
            :loading="loadingEnterprise || loadingOrder"
            color="primary"
            label="Atualizar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
