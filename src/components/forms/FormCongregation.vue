<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { searchCep } from 'src/services/cep-service';
import { storeToRefs } from 'pinia';
import { Congregation } from 'src/ts/interfaces/data/Congregation';
import { useMemberStore } from 'src/stores/member-store';
import { useCongregationStore } from 'src/stores/congregation-store';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';

defineOptions({
  name: 'FormCongregation',
});

const props = defineProps<{
  open: boolean;
  dataEdit: Congregation | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { getMembers } = useMemberStore();
const { loadingMember, listMember } = storeToRefs(useMemberStore());
const { createCongregation, updateCongregation } = useCongregationStore();
const { loadingCongregation } = storeToRefs(useCongregationStore());

const selectedIdentifier = ref<string>('CNPJ');
const loading = ref<boolean>(false);
const dataCongregation = reactive({
  name: '' as string,
  email: '' as string,
  cnpj: '' as string,
  cpf: '' as string,
  uf: '' as string,
  cep: '' as string,
  city: '' as string,
  neighborhood: '' as string,
  address: '' as string,
  addressNumber: '' as string,
  complement: '' as string,
  phone: '' as string,
  dateFoundation: '' as string,
});
const optionsIdentifier = reactive<string[]>(['CNPJ', 'CPF']);
const selectedMember = ref<QuasarSelect<string | null>>({
  label: 'Não informado',
  value: null,
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const checkData = (): { status: boolean; message?: string } => {
  if (dataCongregation.name.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome da organização',
    };
  }
  if (selectedMember.value.value === null) {
    return {
      status: false,
      message: 'Deve ser informado o dirigente',
    };
  }
  if (dataCongregation.dateFoundation.trim() !== '') {
    const cleanDate = dataCongregation.dateFoundation.replace(/[_\s]/g, '');

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(cleanDate)) {
      return {
        status: false,
        message: 'Formato de data inválido. Use DD/MM/AAAA',
      };
    }

    // Agora verifica se é uma data válida
    const [day, month, year] = cleanDate.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return {
        status: false,
        message: 'Data de fundação inválida',
      };
    }
  }
  if (dataCongregation.email.trim() !== '') {
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        dataCongregation.email.trim()
      )
    ) {
      return { status: false, message: 'Informe um e-mail válido' };
    }
  }
  if (dataCongregation.phone.trim() !== '') {
    if (!/^\+?[1-9]\d{1,14}$/.test(dataCongregation.phone.trim())) {
      return { status: false, message: 'Digite um telefone válido' };
    }
  }
  if (
    dataCongregation.cpf.trim() !== '' ||
    dataCongregation.cnpj.trim() !== ''
  ) {
    if (
      selectedIdentifier.value === 'CPF' &&
      dataCongregation.cpf.trim().length !== 11
    ) {
      return {
        status: false,
        message: 'Informe um CPF válido',
      };
    }
    if (
      selectedIdentifier.value === 'CNPJ' &&
      dataCongregation.cnpj.trim().length !== 14
    ) {
      return {
        status: false,
        message: 'Informe um CNPJ válido',
      };
    }
  }
  if (dataCongregation.cep.trim() !== '') {
    if (dataCongregation.cep.trim().length !== 8) {
      return {
        status: false,
        message: 'Informe um CEP válido',
      };
    }
  }

  return { status: true };
};
const clearSpaces = (text: string) => {
  return text.trim().length > 0 ? text : null;
};
const clear = (): void => {
  Object.assign(dataCongregation, {
    name: '',
    email: '',
    cnpj: '',
    cpf: '',
    uf: '',
    cep: '',
    city: '',
    neighborhood: '',
    address: '',
    addressNumber: '',
    complement: '',
    phone: '',
    dateFoundation: '',
  });

  selectedMember.value = {
    label: 'Não informado',
    value: null,
  };

  selectedIdentifier.value = 'CPF';
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    const response = await createCongregation({
      name: dataCongregation.name,
      email: clearSpaces(dataCongregation.email),
      cnpj: clearSpaces(dataCongregation.cnpj),
      cpf: clearSpaces(dataCongregation.cpf),
      cep: clearSpaces(dataCongregation.cep),
      uf: clearSpaces(dataCongregation.uf),
      city: clearSpaces(dataCongregation.city),
      neighborhood: clearSpaces(dataCongregation.neighborhood),
      address: clearSpaces(dataCongregation.address),
      addressNumber: clearSpaces(dataCongregation.addressNumber),
      complement: clearSpaces(dataCongregation.complement),
      phone: clearSpaces(dataCongregation.phone),
      dateFoundation: clearSpaces(dataCongregation.dateFoundation),
      memberID: selectedMember.value.value,
    });
    if (response?.status === 201) {
      emit('update:open');
    }
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
    const response = await updateCongregation({
      id: props.dataEdit?.id,
      name: dataCongregation.name,
      email: clearSpaces(dataCongregation.email),
      cnpj: clearSpaces(dataCongregation.cnpj),
      cpf: clearSpaces(dataCongregation.cpf),
      cep: clearSpaces(dataCongregation.cep),
      uf: clearSpaces(dataCongregation.uf),
      city: clearSpaces(dataCongregation.city),
      neighborhood: clearSpaces(dataCongregation.neighborhood),
      address: clearSpaces(dataCongregation.address),
      addressNumber: clearSpaces(dataCongregation.addressNumber),
      complement: clearSpaces(dataCongregation.complement),
      phone: clearSpaces(dataCongregation.phone),
      dateFoundation: clearSpaces(dataCongregation.dateFoundation),
      memberID: selectedMember.value.value,
    });
    if (response?.status === 200) {
      emit('update:open');
    }
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const fetchMembers = async () => {
  await getMembers();
};
const mountData = () => {
  if (props.dataEdit) {
    selectedIdentifier.value = props.dataEdit.cpf ? 'CPF' : 'CNPJ';
    Object.assign(dataCongregation, {
      name: props.dataEdit.name,
      email: props.dataEdit.email ?? '',
      cnpj: props.dataEdit.cnpj ?? '',
      cpf: props.dataEdit.cpf ?? '',
      uf: props.dataEdit.uf ?? '',
      cep: props.dataEdit.cep ?? '',
      city: props.dataEdit.city ?? '',
      neighborhood: props.dataEdit.neighborhood ?? '',
      address: props.dataEdit.address ?? '',
      addressNumber: props.dataEdit.address_number ?? '',
      complement: props.dataEdit.complement ?? '',
      phone: props.dataEdit.phone ?? '',
      dateFoundation: props.dataEdit.date_foundation ?? '',
    });

    selectedMember.value = {
      label:
        listMember.value.find(
          (member) => member.id === props.dataEdit?.member_id
        )?.name || 'Não informado',
      value: props.dataEdit.member_id,
    };
  }
};

const formattedPhone = computed({
  get() {
    const phone = dataCongregation.phone.replace(/\D/g, '');
    if (phone.length === 10) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
    }
    if (phone.length === 11) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
    }
    return phone;
  },
  set(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 11) {
      return;
    }
    dataCongregation.phone = digits;
  },
});
const optionsMembers = computed(() => {
  const options = listMember.value.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  return [{ label: 'Não informado', value: null }, ...options];
});

watch(
  () => dataCongregation.cep,
  async (cep: string) => {
    dataCongregation.cep = dataCongregation.cep.replace(/\D/g, '');
    if (cep.trim().length === 8) {
      loading.value = true;
      const response = await searchCep(cep);
      if (response.status === 200) {
        dataCongregation.neighborhood = response.data.bairro;
        dataCongregation.uf = response.data.uf;
        dataCongregation.city = response.data.localidade;
        dataCongregation.address = response.data.logradouro;
      }
    } else {
      dataCongregation.neighborhood = '';
      dataCongregation.uf = '';
      dataCongregation.city = '';
      dataCongregation.address = '';
    }
    loading.value = false;
  }
);
watch(
  [
    () => dataCongregation.cpf,
    () => dataCongregation.cnpj,
    () => dataCongregation.addressNumber,
  ],
  ([cpf, cnpj, numberAdress]) => {
    dataCongregation.cpf = cpf.replace(/\D/g, '');
    dataCongregation.cnpj = cnpj.replace(/\D/g, '');
    dataCongregation.addressNumber = numberAdress.replace(/\D/g, '');
  }
);
watch(
  selectedIdentifier,
  (identifier: string) => {
    if (identifier === 'CPF') {
      dataCongregation.cnpj = '';
    } else {
      dataCongregation.cpf = '';
    }
  },
  { immediate: true }
);
watch(open, async () => {
  if (open.value) {
    loading.value = true;
    clear();
    await fetchMembers();
    mountData();
    loading.value = false;
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="
            props.dataEdit
              ? 'Atualização de congregação'
              : 'Cadastro de congregação'
          "
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataCongregation.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="selectedMember"
            :options="optionsMembers"
            label="Dirigente"
            outlined
            dense
            options-dense
            map-options
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="category" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataCongregation.dateFoundation"
            bg-color="white"
            label-color="black"
            outlined
            label="Data de fundação"
            dense
            input-class="text-black"
            mask="##/##/####"
          >
            <template v-slot:prepend>
              <q-icon name="calendar_today" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataCongregation.email"
            bg-color="white"
            label-color="black"
            outlined
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
            bg-color="white"
            label-color="black"
            outlined
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
              outlined
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
              v-model="dataCongregation.cnpj"
              bg-color="white"
              label-color="black"
              outlined
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
              v-model="dataCongregation.cpf"
              bg-color="white"
              label-color="black"
              outlined
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
            v-model="dataCongregation.cep"
            bg-color="white"
            label-color="black"
            outlined
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
              v-model="dataCongregation.uf"
              bg-color="white"
              label-color="black"
              outlined
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
              v-model="dataCongregation.city"
              bg-color="white"
              label-color="black"
              outlined
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
            v-model="dataCongregation.neighborhood"
            bg-color="white"
            label-color="black"
            outlined
            label="Bairro"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataCongregation.address"
            bg-color="white"
            label-color="black"
            outlined
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
              v-model="dataCongregation.addressNumber"
              bg-color="white"
              label-color="black"
              outlined
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
              v-model="dataCongregation.complement"
              bg-color="white"
              label-color="black"
              outlined
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
            :loading="loading || loadingCongregation || loadingMember"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loading || loadingCongregation || loadingMember"
            unelevated
            no-caps
          />
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
