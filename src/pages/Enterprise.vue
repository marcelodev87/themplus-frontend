<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { DataEnterprise } from 'src/ts/interfaces/data/Enterprise';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { storeToRefs } from 'pinia';
import { searchCep } from 'src/services/cep-service';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';

defineOptions({
  name: 'Enterprise',
});

const { createEnterpriseByCounter } = useEnterpriseStore();
const { loadingEnterprise } = storeToRefs(useEnterpriseStore());

const selectedIdentifier = ref<string>('CNPJ');
const loading = ref<boolean>(false);
const optionsIdentifier = reactive<string[]>(['CNPJ', 'CPF']);
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
  if (dataEnterprise.phone.trim() !== '') {
    if (!/^\+?[1-9]\d{1,14}$/.test(dataEnterprise.phone.trim())) {
      return { status: false, message: 'Digite um telefone válido' };
    }
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
  if (dataEnterprise.state.trim() === '') {
    return {
      status: false,
      message: 'Informe um UF válido',
    };
  }
  if (dataEnterprise.city.trim() === '') {
    return {
      status: false,
      message: 'Informe uma cidade válido',
    };
  }
  if (dataEnterprise.neighborhood.trim() === '') {
    return {
      status: false,
      message: 'Informe um bairro válido',
    };
  }
  if (dataEnterprise.address.trim() === '') {
    return {
      status: false,
      message: 'Informe um logradouro válido',
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
const save = async () => {
  const check = checkData();
  if (check.status) {
    const response = await createEnterpriseByCounter({
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
      cep: dataEnterprise.cep,
      state: dataEnterprise.state,
      city: dataEnterprise.city,
      neighborhood: dataEnterprise.neighborhood,
      address: dataEnterprise.address,
      complement:
        dataEnterprise.complement.trim() === ''
          ? null
          : dataEnterprise.complement,
      number_address: dataEnterprise.numberAddress,
      email: dataEnterprise.email.trim() === '' ? null : dataEnterprise.email,
      phone: dataEnterprise.phone.trim() === '' ? null : dataEnterprise.phone,
    });

    if (response?.status === 201) {
      clear();
    }
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};

const formattedPhone = computed({
  get() {
    const phone = (dataEnterprise.phone || '').replace(/\D/g, '');

    if (phone.length === 10) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
    }
    if (phone.length === 11) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
    }
    return phone;
  },
  set(value) {
    const digits = (value || '').replace(/\D/g, '');

    if (digits.length > 11) {
      return;
    }

    dataEnterprise.phone = digits;
  },
});

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
    () => dataEnterprise.numberAddress,
  ],
  ([cpf, cnpj, numberAdress]) => {
    dataEnterprise.cpf = cpf.replace(/\D/g, '');
    dataEnterprise.cnpj = cnpj.replace(/\D/g, '');
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

onMounted(() => {
  clear();
});
</script>

<template>
  <section>
    <header
      :class="
        !$q.screen.lt.sm
          ? 'row justify-between no-wrap bg-grey-1'
          : 'column justify-between no-wrap bg-grey-1'
      "
    >
      <div :class="!$q.screen.lt.sm ? 'col-5' : 'col-12'">
        <TitlePage title="Cadastro de organização" />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-py-sm q-mt-sm">
        <q-form class="q-gutter-y-sm q-pa-sm border-form">
          <q-input
            v-model="dataEnterprise.name"
            bg-color="grey-1"
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
            bg-color="grey-1"
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
            v-model="formattedPhone"
            bg-color="grey-1"
            label-color="black"
            filled
            label="Telefone da organização"
            dense
            input-class="text-black"
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
              bg-color="grey-1"
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
              bg-color="grey-1"
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
              bg-color="grey-1"
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
            bg-color="grey-1"
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
              bg-color="grey-1"
              label-color="black"
              filled
              label="UF"
              dense
              input-class="text-black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="map" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataEnterprise.city"
              bg-color="grey-1"
              label-color="black"
              filled
              label="Cidade"
              dense
              input-class="text-black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="pin_drop" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="dataEnterprise.neighborhood"
            bg-color="grey-1"
            label-color="black"
            filled
            label="Bairro"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEnterprise.address"
            bg-color="grey-1"
            label-color="black"
            filled
            label="Logradouro"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
            </template>
          </q-input>
          <div class="row justify-between">
            <q-input
              v-model="dataEnterprise.numberAddress"
              bg-color="grey-1"
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
              bg-color="grey-1"
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
        <div class="row justify-end q-mt-md">
          <q-btn
            @click="clear"
            :disable="loadingEnterprise"
            flat
            color="negative"
            label="Limpar"
            unelevated
            no-caps
          />
          <q-btn
            @click="save"
            color="primary"
            label="Salvar"
            unelevated
            no-caps
            :loading="loadingEnterprise"
          />
        </div>
      </main>
    </q-scroll-area>
  </section>
</template>
