<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { searchCep } from 'src/services/cep-service';
import { storeToRefs } from 'pinia';
import { MemberChurch } from 'src/ts/interfaces/data/Member';
import { useMemberStore } from 'src/stores/member-store';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';

defineOptions({
  name: 'FormMember',
});

const props = defineProps<{
  open: boolean;
  dataEdit: MemberChurch | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { createMember, updateMember } = useMemberStore();
const { loadingMember } = storeToRefs(useMemberStore());

const loading = ref<boolean>(false);
const dataMember = reactive({
  name: '' as string,
  profession: '' as string,
  dateBirth: '' as string,
  naturalness: '' as string,
  maritalStatus: '' as string,
  education: '' as string,
  cpf: '' as string,
  email: '' as string,
  emailProfessional: '' as string,
  phone: '' as string,
  phoneProfessional: '' as string,
  cep: '' as string,
  uf: '' as string,
  address: '' as string,
  neighborhood: '' as string,
  addressNumber: '' as string,
  city: '' as string,
  complement: '' as string,
  type: '' as string,
  dateBaptismo: '' as string,
  startDate: '' as string,
  reasonStartDate: '' as string,
  churchStartDate: '' as string,
  endDate: '' as string,
  reasonEndDate: '' as string,
  churchEndDate: '' as string,
});

const selectedActive = ref<QuasarSelect<number>>({
  label: 'Ativo',
  value: 1,
});
const selectedRole = ref<QuasarSelect<string | null>>({
  label: 'Sem cargo',
  value: null,
});
const selectedCongregation = ref<QuasarSelect<string | null>>({
  label: 'Sem congregação',
  value: null,
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const checkData = (): { status: boolean; message?: string } => {
  if (dataMember.name.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome do membro',
    };
  }
  if (dataMember.phone.trim() !== '') {
    if (!/^\+?[1-9]\d{1,14}$/.test(dataMember.phone.trim())) {
      return { status: false, message: 'Digite um telefone válido' };
    }
  }
  if (dataMember.phoneProfessional.trim() !== '') {
    if (!/^\+?[1-9]\d{1,14}$/.test(dataMember.phoneProfessional.trim())) {
      return { status: false, message: 'Digite um telefone válido' };
    }
  }

  return { status: true };
};
const clear = (): void => {
  Object.assign(dataMember, {
    name: '',
    profession: '',
    dateBirth: '',
    naturalness: '',
    maritalStatus: '',
    education: '',
    cpf: '',
    email: '',
    emailProfessional: '',
    phone: '',
    phoneProfessional: '',
    cep: '',
    uf: '',
    address: '',
    neighborhood: '',
    addressNumber: '',
    city: '',
    complement: '',
    type: '',
    dateBaptismo: '',
    startDate: '',
    reasonStartDate: '',
    churchStartDate: '',
    endDate: '',
    reasonEndDate: '',
    churchEndDate: '',
  });

  selectedActive.value = {
    label: 'Ativo',
    value: 1,
  };

  selectedRole.value = {
    label: 'Sem cargo',
    value: null,
  };

  selectedCongregation.value = {
    label: 'Sem congregação',
    value: null,
  };
};
const save = async () => {
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
  () => dataMember.cep,
  async (cep: string) => {
    dataMember.cep = dataMember.cep.replace(/\D/g, '');
    if (cep.trim().length === 8) {
      loading.value = true;
      const response = await searchCep(cep);
      if (response.status === 200) {
        dataMember.neighborhood = response.data.bairro;
        dataMember.city = response.data.localidade;
        dataMember.address = response.data.logradouro;
      }
    } else {
      dataMember.neighborhood = '';
      dataMember.city = '';
      dataMember.address = '';
    }
    loading.value = false;
  }
);
watch(
  [() => dataMember.cpf, () => dataMember.addressNumber],
  ([cpf, numberAdress]) => {
    dataMember.cpf = cpf.replace(/\D/g, '');
    dataMember.addressNumber = numberAdress.replace(/\D/g, '');
  }
);
watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="
            props.dataEdit ? 'Atualização de membro' : 'Cadastro de membro'
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
              v-if="props.dataEdit"
              @click="update"
              color="primary"
              label="Atualizar"
              size="md"
              :loading="loadingMember"
              unelevated
              no-caps
            />
            <q-btn
              v-else
              @click="save"
              color="primary"
              label="Salvar"
              size="md"
              :loading="loadingMember"
              unelevated
              no-caps
            />
          </div>
        </div>
      </q-card-actions>
      <q-inner-loading
        :showing="loadingMember"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
