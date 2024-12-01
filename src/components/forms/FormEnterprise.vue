<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { DataEnterprise } from 'src/ts/interfaces/data/Enterprise';
import { searchCep } from 'src/services/cep-service';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { storeToRefs } from 'pinia';
import ConfirmEditEnterprise from '../confirm/ConfirmEditEnterprise.vue';

defineOptions({
  name: 'FormEnterprise',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { updateEnterprise, getEnterprise } = useEnterpriseStore();
const { enterprise, loadingEnterprise } = storeToRefs(useEnterpriseStore());

const selectedIdentifier = ref<string>('CNPJ');
const showConfirmEditEnterprise = ref<boolean>(false);
const loading = ref<boolean>(false);
const dataEnterprise = reactive<DataEnterprise>({
  id: '',
  name: '',
  email: '',
  cnpj: '',
  cpf: '',
  cep: '',
  state: '',
  city: '',
  neighborhood: '',
  address: '',
  numberAddress: '',
  complement: '',
  phone: '',
});
const optionsIdentifier = reactive<string[]>(['CNPJ', 'CPF']);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const checkData = (): { status: boolean; message?: string } => {
  if (dataEnterprise.name.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome da organização',
    };
  }
  if (dataEnterprise.name.trim().length < 2) {
    return {
      status: false,
      message: 'Nome da organização deve ter mais de 2 caracteres',
    };
  }
  if (
    dataEnterprise.email.trim() === '' ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      dataEnterprise.email.trim()
    )
  ) {
    return { status: false, message: 'Informe um e-mail válido' };
  }
  if (
    selectedIdentifier.value === 'CPF' &&
    dataEnterprise.cpf.trim().length !== 11
  ) {
    return {
      status: false,
      message: 'Informe um CPF válido',
    };
  }
  if (
    selectedIdentifier.value === 'CNPJ' &&
    dataEnterprise.cnpj.trim().length !== 14
  ) {
    return {
      status: false,
      message: 'Informe um CNPJ válido',
    };
  }
  if (
    dataEnterprise.cep.trim() === '' ||
    dataEnterprise.cep.trim().length !== 8
  ) {
    return {
      status: false,
      message: 'Informe um CEP válido',
    };
  }
  if (dataEnterprise.numberAddress.trim() === '') {
    return {
      status: false,
      message: 'Informe um número de endereço válido',
    };
  }

  return { status: true };
};
const clear = (): void => {
  Object.assign(dataEnterprise, {
    id: '',
    name: '',
    cnpj: '',
    cpf: '',
    state: '',
    city: '',
    address: '',
    email: '',
    phone: '',
    numberAddress: '',
    complement: '',
    neighborhood: '',
    cep: '',
  });
};
const openConfirmEditEnterprise = (): void => {
  const check = checkData();
  if (check.status) {
    showConfirmEditEnterprise.value = true;
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const closeConfirmEditEnterprise = (): void => {
  showConfirmEditEnterprise.value = false;
};
const update = async () => {
  const check = checkData();
  if (check.status) {
    await updateEnterprise({
      id: dataEnterprise.id,
      name: dataEnterprise.name,
      cnpj:
        selectedIdentifier.value === 'CNPJ'
          ? dataEnterprise.cnpj.trim() === ''
            ? null
            : dataEnterprise.cnpj
          : null,
      cpf:
        selectedIdentifier.value === 'CPF'
          ? dataEnterprise.cpf.trim() === ''
            ? null
            : dataEnterprise.cpf
          : null,
      cep: dataEnterprise.cep.trim() === '' ? null : dataEnterprise.cep,
      state: dataEnterprise.state.trim() === '' ? null : dataEnterprise.state,
      city: dataEnterprise.city.trim() === '' ? null : dataEnterprise.city,
      neighborhood:
        dataEnterprise.neighborhood.trim() === ''
          ? null
          : dataEnterprise.neighborhood,
      address:
        dataEnterprise.address.trim() === '' ? null : dataEnterprise.address,
      complement:
        dataEnterprise.complement.trim() === ''
          ? null
          : dataEnterprise.complement,
      number_address:
        dataEnterprise.numberAddress.trim() === ''
          ? null
          : dataEnterprise.numberAddress,
      email: dataEnterprise.email.trim() === '' ? null : dataEnterprise.email,
      phone: dataEnterprise.phone.trim() === '' ? null : dataEnterprise.phone,
    });
    emit('update:open');
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const fetchEnterprise = async () => {
  const response = await getEnterprise();
  if (response?.status === 200) {
    Object.assign(dataEnterprise, {
      id: enterprise.value?.id,
      name: enterprise.value?.name,
      cnpj: enterprise.value?.cnpj ?? '',
      cpf: enterprise.value?.cpf ?? '',
      state: enterprise.value?.state ?? '',
      city: enterprise.value?.city ?? '',
      address: enterprise.value?.address ?? '',
      email: enterprise.value?.email ?? '',
      phone: enterprise.value?.phone ?? '',
      numberAddress: enterprise.value?.number_address ?? '',
      complement: enterprise.value?.complement ?? '',
      neighborhood: enterprise.value?.neighborhood ?? '',
      cep: enterprise.value?.cep ?? '',
    });

    if (enterprise.value?.cpf === null) {
      selectedIdentifier.value = 'CNPJ';
    } else {
      selectedIdentifier.value = 'CPF';
    }
  }
};

watch(
  () => dataEnterprise.cep,
  async (cep: string) => {
    dataEnterprise.cep = dataEnterprise.cep.replace(/\D/g, '');
    if (cep.trim().length === 8) {
      loading.value = true;
      const response = await searchCep(cep);
      if (response.status === 200) {
        dataEnterprise.neighborhood = response.data.bairro;
        dataEnterprise.state = response.data.estado;
        dataEnterprise.city = response.data.localidade;
        dataEnterprise.address = response.data.logradouro;
      }
    } else {
      dataEnterprise.neighborhood = '';
      dataEnterprise.state = '';
      dataEnterprise.city = '';
      dataEnterprise.address = '';
    }
    loading.value = false;
  }
);
watch(
  [
    () => dataEnterprise.cpf,
    () => dataEnterprise.cnpj,
    () => dataEnterprise.phone,
    () => dataEnterprise.numberAddress,
  ],
  ([cpf, cnpj, phone, numberAdress]) => {
    dataEnterprise.cpf = cpf.replace(/\D/g, '');
    dataEnterprise.cnpj = cnpj.replace(/\D/g, '');
    dataEnterprise.phone = phone.replace(/\D/g, '');
    dataEnterprise.numberAddress = numberAdress.replace(/\D/g, '');
  }
);
watch(
  selectedIdentifier,
  (identifier: string) => {
    if (identifier === 'CPF') {
      dataEnterprise.cnpj = '';
    } else {
      dataEnterprise.cpf = '';
    }
  },
  { immediate: true }
);
watch(open, () => {
  if (open.value) {
    clear();
    closeConfirmEditEnterprise();
    fetchEnterprise();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card v-if="!showConfirmEditEnterprise" class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Dados da organização" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataEnterprise.name"
            bg-color="white"
            label-color="black"
            filled
            label="Nome da organização"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEnterprise.email"
            bg-color="white"
            label-color="black"
            filled
            label="E-mail da organização"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="mail" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEnterprise.phone"
            bg-color="white"
            label-color="black"
            filled
            label="Telefone da organização"
            dense
            input-class="text-black"
            maxlength="15"
          >
            <template v-slot:prepend>
              <q-icon name="call" color="black" size="20px" />
            </template>
          </q-input>
          <div class="row justify-between">
            <q-select
              v-model="selectedIdentifier"
              :options="optionsIdentifier"
              label="Selecione o documento"
              filled
              dense
              options-dense
              bg-color="white"
              label-color="black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="info" color="black" size="20px" />
              </template>
            </q-select>
            <q-input
              v-if="selectedIdentifier === 'CNPJ'"
              v-model="dataEnterprise.cnpj"
              bg-color="white"
              label-color="black"
              filled
              label="Digite o CNPJ"
              dense
              input-class="text-black"
              class="input-divider"
              maxlength="14"
            >
              <template v-slot:prepend>
                <q-icon name="badge" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-else
              v-model="dataEnterprise.cpf"
              bg-color="white"
              label-color="black"
              filled
              label="Digite o CPF"
              dense
              input-class="text-black"
              class="input-divider"
              maxlength="11"
            >
              <template v-slot:prepend>
                <q-icon name="badge" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="dataEnterprise.cep"
            bg-color="white"
            label-color="black"
            filled
            label="Digite o CEP"
            dense
            input-class="text-black"
            :loading="loading"
            maxlength="8"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="black" size="20px" />
            </template>
          </q-input>
          <div class="row justify-between">
            <q-input
              v-model="dataEnterprise.state"
              bg-color="white"
              label-color="black"
              filled
              label="UF"
              dense
              input-class="text-black"
              class="input-divider"
              readonly
            >
              <template v-slot:prepend>
                <q-icon name="map" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataEnterprise.city"
              bg-color="white"
              label-color="black"
              filled
              label="Cidade"
              dense
              input-class="text-black"
              class="input-divider"
              readonly
            >
              <template v-slot:prepend>
                <q-icon name="pin_drop" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="dataEnterprise.neighborhood"
            bg-color="white"
            label-color="black"
            filled
            label="Bairro"
            dense
            input-class="text-black"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEnterprise.address"
            bg-color="white"
            label-color="black"
            filled
            label="Logradouro"
            dense
            input-class="text-black"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
            </template>
          </q-input>
          <div class="row justify-between">
            <q-input
              v-model="dataEnterprise.numberAddress"
              bg-color="white"
              label-color="black"
              filled
              label="Número"
              dense
              input-class="text-black"
              class="input-divider"
              maxlength="15"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataEnterprise.complement"
              bg-color="white"
              label-color="black"
              filled
              label="Complemento"
              dense
              input-class="text-black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" color="black" size="20px" />
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
            @click="openConfirmEditEnterprise"
            color="primary"
            label="Continuar"
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

    <div v-else>
      <ConfirmEditEnterprise
        @update:open="closeConfirmEditEnterprise"
        @update:ok="update"
      />
    </div>
  </q-dialog>
</template>
