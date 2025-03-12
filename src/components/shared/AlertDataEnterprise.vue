<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { DataEnterprise } from 'src/ts/interfaces/data/Enterprise';
import { Notify } from 'quasar';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { storeToRefs } from 'pinia';
import { searchCep } from 'src/services/cep-service';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';

defineOptions({
  name: 'AlertDataEnterprise',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { setToken, setUser } = useAuthStore();
const { updateEnterprise, getEnterprise } = useEnterpriseStore();
const { enterprise, loadingEnterprise } = storeToRefs(useEnterpriseStore());
const { enterprisePosition } = storeToRefs(useAuthStore());

const router = useRouter();
const step = ref<number>(1);
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
const update = async () => {
  const check = checkData();
  if (check.status) {
    const response = await updateEnterprise({
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
    if (response?.status === 200) {
      step.value = 3;
    }
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
const logout = (): void => {
  setToken(null);
  setUser(null);
  router.push({ name: 'auth' });
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
watch(step, () => {
  if (step.value === 2) {
    clear();
    fetchEnterprise();
  }
});
</script>

<template>
  <q-dialog v-model="open" persistent>
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
      style="width: 900px; max-width: 98%"
    >
      <q-step
        :name="1"
        title="Seja muito bem-vindo!"
        icon="favorite"
        :done="step > 1"
      >
        <p v-if="enterprisePosition === 'client'">
          <span class="text-bold">Bem-vindo ao ThemPlus!</span> Aqui, você
          poderá organizar melhor a gestão da sua igreja, tornando tudo mais
          fácil e permitindo que você se concentre no que realmente importa. Com
          nosso sistema, você poderá registrar movimentações, agendamentos,
          criar contas, convidar usuários para sua organização, categorizar
          usuários por departamentos, conceder permissões, entre outras
          funcionalidades. Antes de começar a utilizar nosso sistema, pedimos
          que você preencha alguns dados.
          <span class="text-bold">É rapidinho! Vamos lá?</span>
        </p>
        <p v-else>
          <span class="text-bold">Bem-vindo ao ThemPlus!</span> Aqui, você
          poderá organizar melhor a gestão de seus clientes, tornando tudo mais
          fácil e permitindo que você se concentre no que realmente importa.
          Antes de começar a utilizar nosso sistema, pedimos que você preencha
          alguns dados.
          <span class="text-bold">É rapidinho! Vamos lá?</span>
        </p>
      </q-step>

      <q-step
        :name="2"
        title="Preencher dados de sua organização"
        icon="church"
        :done="step > 2"
      >
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataEnterprise.name"
            bg-color="grey-2"
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
            bg-color="grey-2"
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
            bg-color="grey-2"
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
              bg-color="grey-2"
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
              bg-color="grey-2"
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
              bg-color="grey-2"
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
            bg-color="grey-2"
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
              bg-color="grey-2"
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
              bg-color="grey-2"
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
            bg-color="grey-2"
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
            bg-color="grey-2"
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
              bg-color="grey-2"
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
              bg-color="grey-2"
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
      </q-step>
      <q-step :name="3" title="Parabéns!" icon="celebration" :done="step > 3">
        <p v-if="enterprisePosition === 'client'">
          <span class="text-bold">Parabéns!</span> Seus dados foram salvos com
          sucesso. Agora você pode começar a usar o ThemPlus para organizar e
          gerenciar sua igreja de forma mais eficiente. <br /><br />
          Para aproveitar ao máximo todas as funcionalidades do sistema,
          sugerimos que leia o menu <span class="text-bold">Ajuda</span>, onde
          você encontrará informações detalhadas sobre como utilizar o ThemPlus
          de maneira otimizada. <br /><br />
          Caso tenha alguma dúvida não resolvida, clique no ícone de mensagem na
          barra superior para entrar em contato com nosso time. Estamos aqui
          para ajudar você por meio de nossos canais de atendimento.
          <br /><br />
          Comece a explorar o sistema agora mesmo e aproveite tudo o que o
          ThemPlus tem a oferecer!
        </p>
        <p v-else>
          <span class="text-bold">Parabéns!</span> Seus dados foram salvos com
          sucesso. Agora você pode começar a usar o ThemPlus para organizar e
          gerenciar seus clientes de forma mais eficiente. <br /><br />
          Para aproveitar ao máximo todas as funcionalidades do sistema,
          sugerimos que leia o menu <span class="text-bold">Ajuda</span>, onde
          você encontrará informações detalhadas sobre como utilizar o ThemPlus
          de maneira otimizada. <br /><br />
          Caso tenha alguma dúvida não resolvida, clique no ícone de mensagem na
          barra superior para entrar em contato com nosso time. Estamos aqui
          para ajudar você por meio de nossos canais de atendimento.
          <br /><br />
          Comece a explorar o sistema agora mesmo e aproveite tudo o que o
          ThemPlus tem a oferecer!
        </p>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation class="row justify-end q-gutter-x-sm">
          <q-btn
            v-show="step === 2"
            flat
            color="primary"
            @click="step = 1"
            label="Voltar"
            class="q-ml-sm"
            unelevated
            no-caps
          />
          <q-btn
            v-show="step === 1"
            @click="logout"
            color="primary"
            label="Entrar com outra conta"
            flat
            unelevated
            no-caps
          />
          <q-btn
            v-show="step === 1"
            @click="step = 2"
            color="primary"
            label="Continue"
            unelevated
            no-caps
          />
          <q-btn
            @click="update"
            v-show="step === 2"
            color="primary"
            label="Salvar"
            unelevated
            no-caps
            :loading="loadingEnterprise"
          />
          <q-btn
            @click="emit('update:open')"
            v-show="step === 3"
            color="primary"
            label="Navegar"
            unelevated
            no-caps
            :loading="loadingEnterprise"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-dialog>
</template>
