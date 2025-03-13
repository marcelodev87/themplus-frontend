<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { DataEnterprise } from 'src/ts/interfaces/data/Enterprise';
import { searchCep } from 'src/services/cep-service';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth-store';
import { useOfficeStore } from 'src/stores/office-store';
import { useRouter } from 'vue-router';
import ConfirmEditEnterprise from '../confirm/ConfirmEditEnterprise.vue';
import ConfirmDeleteEnterprise from '../confirm/ConfirmDeleteEnterprise.vue';

defineOptions({
  name: 'FormEnterprise',
});

const props = defineProps<{
  open: boolean;
  mode: 'actual' | 'office';
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { updateEnterprise, getEnterprise, deleteEnterprise } =
  useEnterpriseStore();
const { enterprise, loadingEnterprise } = storeToRefs(useEnterpriseStore());
const { createOffice } = useOfficeStore();
const { loadingOffice } = storeToRefs(useOfficeStore());
const { user } = storeToRefs(useAuthStore());
const { setToken, setUser } = useAuthStore();

const router = useRouter();
const selectedIdentifier = ref<string>('CNPJ');
const showConfirmEditEnterprise = ref<boolean>(false);
const showConfirmDeleteEnterprise = ref<boolean>(false);
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
    props.mode === 'actual' &&
    (dataEnterprise.email.trim() === '' ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        dataEnterprise.email.trim()
      ))
  ) {
    return { status: false, message: 'Informe um e-mail válido' };
  }
  if (dataEnterprise.phone.trim() !== '') {
    if (!/^\+?[1-9]\d{1,14}$/.test(dataEnterprise.phone.trim())) {
      return { status: false, message: 'Digite um telefone válido' };
    }
  }
  if (
    props.mode === 'actual' &&
    selectedIdentifier.value === 'CPF' &&
    dataEnterprise.cpf.trim().length !== 11
  ) {
    return {
      status: false,
      message: 'Informe um CPF válido',
    };
  }
  if (
    props.mode === 'actual' &&
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
const saveOffice = async () => {
  const check = checkData();
  if (check.status) {
    await createOffice(
      dataEnterprise.name,
      selectedIdentifier.value === 'CNPJ'
        ? dataEnterprise.cnpj.trim() === ''
          ? null
          : dataEnterprise.cnpj
        : null,
      selectedIdentifier.value === 'CPF'
        ? dataEnterprise.cpf.trim() === ''
          ? null
          : dataEnterprise.cpf
        : null,
      dataEnterprise.cep,
      dataEnterprise.state,
      dataEnterprise.city,
      dataEnterprise.neighborhood,
      dataEnterprise.address,
      dataEnterprise.complement.trim() === ''
        ? null
        : dataEnterprise.complement,
      dataEnterprise.numberAddress,
      dataEnterprise.email.trim() === '' ? null : dataEnterprise.email,
      dataEnterprise.phone.trim() === '' ? null : dataEnterprise.phone
    );
    emit('update:open');
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
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
const openConfirmDeleteEnterprise = (): void => {
  showConfirmDeleteEnterprise.value = true;
};
const closeConfirmDeleteEnterprise = (): void => {
  showConfirmDeleteEnterprise.value = false;
};
const exclude = async () => {
  const response = await deleteEnterprise(dataEnterprise.id);
  if (response?.status === 200) {
    setToken(null);
    setUser(null);
    router.push({ name: 'auth' });
  }
};
const formattedPhone = computed({
  get() {
    const phone = dataEnterprise.phone.replace(/\D/g, '');
    if (phone.length === 10) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
    }
    if (phone.length === 11) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
    }
    return phone;
  },
  set(value) {
    console.log('value ', value);
    const digits = value.replace(/\D/g, '');
    console.log('digits ', digits);
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
watch(open, () => {
  if (open.value) {
    clear();
    closeConfirmEditEnterprise();
    if (props.mode === 'actual') {
      fetchEnterprise();
    }
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      v-if="!showConfirmEditEnterprise && !showConfirmDeleteEnterprise"
      class="bg-grey-2 form-basic"
    >
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="
            props.mode === 'office' ? 'Dados da filial' : 'Dados da organização'
          "
        />
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
            :readonly="user?.position !== 'admin'"
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
            :readonly="user?.position !== 'admin'"
          >
            <template v-slot:prepend>
              <q-icon name="mail" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="formattedPhone"
            bg-color="white"
            label-color="black"
            filled
            label="Telefone da organização"
            dense
            input-class="text-black"
            :readonly="user?.position !== 'admin'"
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
              :readonly="user?.position !== 'admin'"
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
              :readonly="user?.position !== 'admin'"
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
              :readonly="user?.position !== 'admin'"
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
            :readonly="user?.position !== 'admin'"
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
              :readonly="user?.position !== 'admin'"
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
              :readonly="user?.position !== 'admin'"
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
            :readonly="user?.position !== 'admin'"
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
            :readonly="user?.position !== 'admin'"
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
              :readonly="user?.position !== 'admin'"
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
              :readonly="user?.position !== 'admin'"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" color="black" size="20px" />
              </template>
            </q-input>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions>
        <div class="row justify-between full-width">
          <div>
            <q-btn
              @click="openConfirmDeleteEnterprise"
              v-show="props.mode === 'actual' && user?.position === 'admin'"
              color="negative"
              label="Deletar organização"
              size="md"
              :loading="loadingEnterprise || loadingOffice"
              unelevated
              no-caps
            />
          </div>
          <div class="q-gutter-x-sm">
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
              v-if="props.mode === 'actual'"
              @click="openConfirmEditEnterprise"
              v-show="user?.position === 'admin'"
              color="primary"
              label="Continuar"
              size="md"
              :loading="loadingEnterprise || loadingOffice"
              unelevated
              no-caps
            />
            <q-btn
              v-else
              @click="saveOffice"
              v-show="user?.position === 'admin'"
              color="primary"
              label="Salvar"
              size="md"
              :loading="loadingEnterprise || loadingOffice"
              unelevated
              no-caps
            />
          </div>
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

    <div v-else-if="showConfirmEditEnterprise && !showConfirmDeleteEnterprise">
      <ConfirmEditEnterprise
        @update:open="closeConfirmEditEnterprise"
        @update:ok="update"
      />
    </div>
    <div v-else>
      <ConfirmDeleteEnterprise
        @update:open="closeConfirmDeleteEnterprise"
        @update:ok="exclude"
      />
    </div>
  </q-dialog>
</template>
