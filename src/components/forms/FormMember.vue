<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { searchCep } from 'src/services/cep-service';
import { storeToRefs } from 'pinia';
import { MemberChurch } from 'src/ts/interfaces/data/Member';
import { useMemberStore } from 'src/stores/member-store';
import { useRoleStore } from 'src/stores/role-store';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';
import { useCongregationStore } from 'src/stores/congregation-store';
import { useCellStore } from 'src/stores/cell-store';
import { useMinistryStore } from 'src/stores/ministry-store';
import { states } from 'src/utils/state';
import { education } from 'src/utils/education';

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

const memberID = computed(() => props.dataEdit?.id ?? '');

const { getCells } = useCellStore();
const { loadingCell, listCell } = storeToRefs(useCellStore());
const { createMember, updateMember } = useMemberStore();
const { loadingMember } = storeToRefs(useMemberStore());
const { getRoles } = useRoleStore();
const { getMinistries } = useMinistryStore();
const { loadingMinistry, listMinistry } = storeToRefs(useMinistryStore());
const { loadingRole, listRole } = storeToRefs(useRoleStore());
const { getCongregations } = useCongregationStore();
const { loadingCongregation, listCongregation } = storeToRefs(
  useCongregationStore()
);

const tab = ref<'individual' | 'contact' | 'address' | 'ministry' | 'family'>(
  'individual'
);
const loading = ref<boolean>(false);
const dataMember = reactive({
  name: '' as string,
  profession: '' as string,
  dateBirth: '' as string,
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

const selectedListMinistry = ref<QuasarSelect<string>[]>([]);
const selectedActive = ref<QuasarSelect<number>>({
  label: 'Ativo',
  value: 1,
});
const selectedRole = ref<QuasarSelect<string | null>>({
  label: 'Não informado',
  value: null,
});
const selectedTypeMinistry = ref<QuasarSelect<string>>({
  label: 'Visitante',
  value: 'visitor',
});
const selectedCongregation = ref<QuasarSelect<string | null>>({
  label: 'Não informado',
  value: null,
});
const selectedNaturalness = ref<QuasarSelect<string | null>>({
  label: 'Não informado',
  value: null,
});
const selectedMaritalStatus = ref<QuasarSelect<string | null>>({
  label: 'Não informado',
  value: null,
});
const selectedEducation = ref<QuasarSelect<string | null>>({
  label: 'Não informado',
  value: null,
});
const selectedCell = ref<QuasarSelect<string | null>>({
  label: 'Não informado',
  value: null,
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const clearSpaces = (text: string) => {
  return text.trim().length > 0 ? text : null;
};
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

  selectedNaturalness.value = {
    label: 'Não informado',
    value: null,
  };

  selectedMaritalStatus.value = {
    label: 'Não informado',
    value: null,
  };

  selectedEducation.value = {
    label: 'Não informado',
    value: null,
  };

  selectedTypeMinistry.value = {
    label: 'Visitante',
    value: 'visitor',
  };

  selectedCell.value = {
    label: 'Não informado',
    value: null,
  };

  selectedListMinistry.value = [];
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    const response = await createMember({
      name: dataMember.name,
      dateBirth: dataMember.dateBirth,
      profession: clearSpaces(dataMember.profession),
      naturalness: selectedEducation.value.value,
      maritalStatus: selectedMaritalStatus.value.value,
      education: selectedEducation.value.value,
      cpf: clearSpaces(dataMember.cpf),
      email: clearSpaces(dataMember.email),
      emailProfessional: clearSpaces(dataMember.emailProfessional),
      phone: clearSpaces(dataMember.phone),
      phoneProfessional: clearSpaces(dataMember.phoneProfessional),
      cep: clearSpaces(dataMember.cep),
      address: clearSpaces(dataMember.address),
      complement: clearSpaces(dataMember.complement),
      neighborhood: clearSpaces(dataMember.neighborhood),
      city: clearSpaces(dataMember.city),
      uf: clearSpaces(dataMember.uf),
      addressNumber: clearSpaces(dataMember.addressNumber),
      type: selectedTypeMinistry.value.value,
      active: selectedActive.value.value,
      dateBaptismo: clearSpaces(dataMember.dateBaptismo),
      congregationID: selectedCongregation.value.value,
      cellID: selectedCell.value.value,
      startDate: clearSpaces(dataMember.startDate),
      endDate: clearSpaces(dataMember.endDate),
      churchStartDate: clearSpaces(dataMember.churchStartDate),
      churchEndDate: clearSpaces(dataMember.churchEndDate),
      ministries: selectedListMinistry.value.map((item) => {
        return { id: item.value };
      }),
      roleID: selectedRole.value.value,
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
    const response = await updateMember(memberID.value, {
      name: dataMember.name,
      dateBirth: dataMember.dateBirth,
      profession: clearSpaces(dataMember.profession),
      naturalness: selectedEducation.value.value,
      maritalStatus: selectedMaritalStatus.value.value,
      education: selectedEducation.value.value,
      cpf: clearSpaces(dataMember.cpf),
      email: clearSpaces(dataMember.email),
      emailProfessional: clearSpaces(dataMember.emailProfessional),
      phone: clearSpaces(dataMember.phone),
      phoneProfessional: clearSpaces(dataMember.phoneProfessional),
      cep: clearSpaces(dataMember.cep),
      address: clearSpaces(dataMember.address),
      complement: clearSpaces(dataMember.complement),
      neighborhood: clearSpaces(dataMember.neighborhood),
      city: clearSpaces(dataMember.city),
      uf: clearSpaces(dataMember.uf),
      addressNumber: clearSpaces(dataMember.addressNumber),
      type: selectedTypeMinistry.value.value,
      active: selectedActive.value.value,
      dateBaptismo: clearSpaces(dataMember.dateBaptismo),
      congregationID: selectedCongregation.value.value,
      cellID: selectedCell.value.value,
      startDate: clearSpaces(dataMember.startDate),
      endDate: clearSpaces(dataMember.endDate),
      churchStartDate: clearSpaces(dataMember.churchStartDate),
      churchEndDate: clearSpaces(dataMember.churchEndDate),
      roleID: selectedRole.value.value,
      ministries: selectedListMinistry.value.map((item) => {
        return { id: item.value };
      }),
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
const fetchRoles = async () => {
  await getRoles();
};
const fetchCongregations = async () => {
  await getCongregations();
};
const fetchCells = async () => {
  await getCells();
};
const fetchMinistries = async () => {
  await getMinistries();
};

const formattedPhonePessoal = computed({
  get() {
    const phone = dataMember.phone.replace(/\D/g, '');
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
    dataMember.phone = digits;
  },
});
const formattedPhoneProfessional = computed({
  get() {
    const phone = dataMember.phoneProfessional.replace(/\D/g, '');
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
    dataMember.phoneProfessional = digits;
  },
});
const optionsTypeMinistry = computed(() => [
  {
    label: 'Visitante',
    value: 'visitor',
  },
  {
    label: 'Membro',
    value: 'member',
  },
]);
const optionsActive = computed(() => [
  {
    label: 'Ativo',
    value: 1,
  },
  {
    label: 'Inativo',
    value: 0,
  },
]);
const optionsCongregations = computed(() => {
  const options = listCongregation.value.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  return [{ label: 'Não informado', value: null }, ...options];
});
const optionsRoles = computed(() => {
  const options = listRole.value.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  return [{ label: 'Não informado', value: null }, ...options];
});
const optionsMinistries = computed(() => {
  return listMinistry.value.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
});
const optionsCells = computed(() => {
  const options = listCell.value.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  return [{ label: 'Não informado', value: null }, ...options];
});
const isLoading = computed(() => {
  return (
    loading.value ||
    loadingCongregation.value ||
    loadingMember.value ||
    loadingRole.value ||
    loadingMinistry.value ||
    loadingCell.value
  );
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
        dataMember.uf = response.data.uf;
        dataMember.address = response.data.logradouro;
      }
    } else {
      dataMember.neighborhood = '';
      dataMember.city = '';
      dataMember.address = '';
      dataMember.uf = '';
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
watch(open, async () => {
  if (open.value) {
    loading.value = true;
    clear();
    await fetchRoles();
    await fetchCongregations();
    await fetchCells();
    await fetchMinistries();
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
            props.dataEdit ? 'Atualização de membro' : 'Cadastro de membro'
          "
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="individual" label="Dados Pessoais" />
          <q-tab name="contact" label="Contatos" />
          <q-tab name="address" label="Endereço" />
          <q-tab name="ministry" label="Dados Ministeriais" />
          <q-tab name="family" label="Família" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="individual">
            <q-form class="q-gutter-y-sm">
              <q-input
                v-model="dataMember.name"
                bg-color="white"
                label-color="black"
                filled
                label="Nome"
                dense
                input-class="text-black"
              >
                <template v-slot:prepend>
                  <q-icon name="person" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.profession"
                bg-color="white"
                label-color="black"
                filled
                label="Profissão"
                dense
                input-class="text-black"
              >
                <template v-slot:prepend>
                  <q-icon name="engineering" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.dateBirth"
                bg-color="white"
                label-color="black"
                filled
                label="Data de nascimento"
                dense
                input-class="text-black"
                mask="##/##/####"
              >
                <template v-slot:prepend>
                  <q-icon name="calendar_today" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.cpf"
                bg-color="white"
                label-color="black"
                filled
                label="CPF"
                dense
                input-class="text-black"
                maxlength="11"
              >
                <template v-slot:prepend>
                  <q-icon name="badge" color="black" size="20px" />
                </template>
              </q-input>
              <q-select
                v-model="selectedNaturalness"
                :options="states"
                label="Naturalidade"
                filled
                clearable
                dense
                options-dense
                map-options
                bg-color="white"
                label-color="black"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="south_america" color="black" size="20px" />
                </template>
              </q-select>
              <q-select
                v-model="selectedMaritalStatus"
                :options="states"
                label="Estado civil"
                filled
                clearable
                dense
                options-dense
                map-options
                bg-color="white"
                label-color="black"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="favorite" color="black" size="20px" />
                </template>
              </q-select>
              <q-select
                v-model="selectedEducation"
                :options="education"
                label="Escolaridade"
                filled
                clearable
                dense
                options-dense
                map-options
                bg-color="white"
                label-color="black"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="favorite" color="black" size="20px" />
                </template>
              </q-select>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="contact">
            <q-form class="q-gutter-y-sm">
              <q-input
                v-model="dataMember.email"
                bg-color="white"
                label-color="black"
                filled
                label="E-mail pessoal"
                autocomplete="new-email"
                dense
                input-class="text-black"
              >
                <template v-slot:prepend>
                  <q-icon name="mail" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.emailProfessional"
                bg-color="white"
                label-color="black"
                filled
                label="E-mail profissional"
                autocomplete="new-email"
                dense
                input-class="text-black"
              >
                <template v-slot:prepend>
                  <q-icon name="mail" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="formattedPhonePessoal"
                bg-color="white"
                label-color="black"
                filled
                label="Telefone pessoal"
                dense
                input-class="text-black"
              >
                <template v-slot:prepend>
                  <q-icon name="call" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="formattedPhoneProfessional"
                bg-color="white"
                label-color="black"
                filled
                label="Telefone profissional"
                dense
                input-class="text-black"
              >
                <template v-slot:prepend>
                  <q-icon name="call" color="black" size="20px" />
                </template>
              </q-input>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="address">
            <q-form class="q-gutter-y-sm">
              <q-input
                v-model="dataMember.cep"
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
              <q-input
                v-model="dataMember.uf"
                bg-color="white"
                label-color="black"
                filled
                label="UF"
                dense
                input-class="text-black"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.address"
                bg-color="white"
                label-color="black"
                filled
                label="Endereço"
                dense
                input-class="text-black"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.neighborhood"
                bg-color="white"
                label-color="black"
                filled
                label="Bairro"
                dense
                input-class="text-black"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.complement"
                bg-color="white"
                label-color="black"
                filled
                label="Complemento"
                dense
                input-class="text-black"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.city"
                bg-color="white"
                label-color="black"
                filled
                label="Cidade"
                dense
                input-class="text-black"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on" color="black" size="20px" />
                </template>
              </q-input>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="ministry">
            <q-form class="q-gutter-y-sm">
              <q-select
                v-model="selectedTypeMinistry"
                :options="optionsTypeMinistry"
                label="Tipo"
                filled
                clearable
                dense
                options-dense
                map-options
                bg-color="white"
                label-color="black"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="chevron_right" color="black" size="20px" />
                </template>
              </q-select>
              <q-select
                v-model="selectedActive"
                :options="optionsActive"
                label="Situação"
                filled
                clearable
                dense
                options-dense
                map-options
                bg-color="white"
                label-color="black"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="chevron_right" color="black" size="20px" />
                </template>
              </q-select>
              <q-input
                v-model="dataMember.dateBaptismo"
                bg-color="white"
                label-color="black"
                filled
                label="Data de batismo"
                dense
                input-class="text-black"
                mask="##/##/####"
              >
                <template v-slot:prepend>
                  <q-icon name="calendar_today" color="black" size="20px" />
                </template>
              </q-input>
              <q-select
                v-model="selectedListMinistry"
                :options="optionsMinistries"
                label="Ministérios"
                filled
                clearable
                multiple
                dense
                options-dense
                map-options
                bg-color="white"
                label-color="black"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="church" color="black" size="20px" />
                </template>
              </q-select>
              <q-select
                v-model="selectedCongregation"
                :options="optionsCongregations"
                label="Congregação"
                filled
                clearable
                dense
                options-dense
                map-options
                bg-color="white"
                label-color="black"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="church" color="black" size="20px" />
                </template>
              </q-select>
              <q-select
                v-model="selectedRole"
                :options="optionsRoles"
                label="Selecione o cargo"
                filled
                clearable
                dense
                options-dense
                map-options
                bg-color="white"
                label-color="black"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="church" color="black" size="20px" />
                </template>
              </q-select>
              <q-select
                v-model="selectedCell"
                :options="optionsCells"
                label="Selecione a célula"
                filled
                clearable
                dense
                options-dense
                map-options
                bg-color="white"
                label-color="black"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="church" color="black" size="20px" />
                </template>
              </q-select>
              <q-input
                v-model="dataMember.startDate"
                bg-color="white"
                label-color="black"
                filled
                label="Membro desde:"
                dense
                input-class="text-black"
                mask="##/##/####"
              >
                <template v-slot:prepend>
                  <q-icon name="calendar_today" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.churchStartDate"
                bg-color="white"
                label-color="black"
                filled
                label="Igreja origem"
                dense
                input-class="text-black"
              >
                <template v-slot:prepend>
                  <q-icon name="church" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.endDate"
                bg-color="white"
                label-color="black"
                filled
                label="Data de saída:"
                dense
                input-class="text-black"
                mask="##/##/####"
              >
                <template v-slot:prepend>
                  <q-icon name="calendar_today" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.churchEndDate"
                bg-color="white"
                label-color="black"
                filled
                label="Igreja destino"
                dense
                input-class="text-black"
              >
                <template v-slot:prepend>
                  <q-icon name="church" color="black" size="20px" />
                </template>
              </q-input>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
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
              :loading="isLoading"
              unelevated
              no-caps
            />
            <q-btn
              v-else
              @click="save"
              color="primary"
              label="Salvar"
              size="md"
              :loading="isLoading"
              unelevated
              no-caps
            />
          </div>
        </div>
      </q-card-actions>
      <q-inner-loading
        :showing="loadingRole || loadingCongregation"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
