<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { searchCep } from 'src/services/cep-service';
import { storeToRefs } from 'pinia';
import { DataListFamily, MemberChurch } from 'src/ts/interfaces/data/Member';
import { useMemberStore } from 'src/stores/member-store';
import { useRoleStore } from 'src/stores/role-store';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';
import { states } from 'src/utils/state';
import { education } from 'src/utils/education';
import { marital } from 'src/utils/marital';
import { useMinistryStore } from 'src/stores/ministry-store';

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

const { createMember, updateMember } = useMemberStore();
const { getRoles } = useRoleStore();
const { loadingRole, listRole } = storeToRefs(useRoleStore());
const { listMinistry, loadingMinistry } = storeToRefs(useMinistryStore());
const { getMinistries } = useMinistryStore();

const tab = ref<'individual' | 'contact' | 'address' | 'ministry' | 'family'>(
  'individual'
);
const dataListFamily = ref<DataListFamily[]>([]);
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
const selectedActive = ref<QuasarSelect<number>>({
  label: 'Ativo',
  value: 1,
});
const selectedRole = ref<QuasarSelect<string>[]>([]);
const selectedMinistry = ref<QuasarSelect<string>[]>([]);
const selectedTypeMinistry = ref<QuasarSelect<string>>({
  label: 'Visitante',
  value: 'visitor',
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
const selectedMemberFamily = ref<QuasarSelect<string | null>>({
  label: 'Não informado',
  value: null,
});
const selectedStatusFamily = ref<QuasarSelect<string | null>>({
  label: 'Não informado',
  value: null,
});
// const columnsListMember = reactive<QuasarTable[]>([
//   {
//     name: 'member',
//     label: 'Membro',
//     field: 'member',
//     align: 'left',
//   },
//   {
//     name: 'family',
//     label: 'Parentesco',
//     field: 'family',
//     align: 'left',
//   },
//   {
//     name: 'action',
//     label: 'Ações',
//     field: 'action',
//     align: 'right',
//   },
// ]);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const optionsRoles = computed(() => {
  return listRole.value.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
});
const optionsMinistries = computed(() => {
  return listMinistry.value.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
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

  const validateDate = (value: string, label: string) => {
    if (value.trim() === '') return null;

    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(regex);

    if (!match) {
      return `${label} deve estar no formato DD/MM/YYYY`;
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    if (month < 1 || month > 12) {
      return `${label}: mês inválido`;
    }

    if (day < 1 || day > 31) {
      return `${label}: dia inválido`;
    }

    const lastDay = new Date(year, month, 0).getDate();

    if (day > lastDay) {
      return `${label}: dia inválido para o mês informado`;
    }

    if (year < 1900 || year > 2100) {
      return `${label}: ano fora do intervalo permitido`;
    }

    return null;
  };

  const dateFields = [
    { field: dataMember.dateBirth, label: 'Data de nascimento' },
    { field: dataMember.dateBaptismo, label: 'Data de batismo' },
    { field: dataMember.startDate, label: 'Data de início' },
    { field: dataMember.endDate, label: 'Data de término' },
  ];

  for (const item of dateFields) {
    const error = validateDate(item.field, item.label);
    if (error) return { status: false, message: error };
  }

  return { status: true };
};

const clear = (): void => {
  tab.value = 'individual';
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

  selectedRole.value = [];
  selectedMinistry.value = [];

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

  selectedMemberFamily.value = {
    label: 'Não informado',
    value: null,
  };

  selectedStatusFamily.value = {
    label: 'Não informado',
    value: null,
  };

  dataListFamily.value = [];
};
// const getDataFamily = () => {
//   if (!dataListFamily.value || dataListFamily.value.length === 0) {
//     return null;
//   }

//   return dataListFamily.value.map((item) => {
//     return {
//       memberID: item.member.value!,
//       kinship: item.family.value!,
//     };
//   });
// };
const save = async () => {
  const check = checkData();
  if (check.status) {
    const response = await createMember({
      name: dataMember.name,
      dateBirth: dataMember.dateBirth,
      profession: clearSpaces(dataMember.profession),
      naturalness: selectedNaturalness.value.value,
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
      startDate: clearSpaces(dataMember.startDate),
      endDate: clearSpaces(dataMember.endDate),
      churchStartDate: clearSpaces(dataMember.churchStartDate),
      churchEndDate: clearSpaces(dataMember.churchEndDate),
      roles: selectedRole.value.map((role) => role.value),
      ministries: selectedMinistry.value.map((ministry) => ministry.value),
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
      naturalness: selectedNaturalness.value.value,
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
      startDate: clearSpaces(dataMember.startDate),
      endDate: clearSpaces(dataMember.endDate),
      churchStartDate: clearSpaces(dataMember.churchStartDate),
      churchEndDate: clearSpaces(dataMember.churchEndDate),
      roles: selectedRole.value.map((role) => role.value),
      ministries: selectedMinistry.value.map((ministry) => ministry.value),
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
// const addFamily = () => {
//   dataListFamily.value.push({
//     member: selectedMemberFamily.value,
//     family: selectedStatusFamily.value,
//   });
// };
// const deleteFamily = (index: number): void => {
//   dataListFamily.value.splice(index, 1);
// };
const mountData = () => {
  if (props.dataEdit) {
    Object.assign(dataMember, {
      name: props.dataEdit.name,
      profession: props.dataEdit.profession ?? '',
      dateBirth: props.dataEdit.date_birth ?? '',
      cpf: props.dataEdit.cpf ?? '',
      email: props.dataEdit.email ?? '',
      emailProfessional: props.dataEdit.email_professional ?? '',
      phone: props.dataEdit.phone ?? '',
      phoneProfessional: props.dataEdit.phone_professional ?? '',
      cep: props.dataEdit.cep ?? '',
      uf: props.dataEdit.uf ?? '',
      address: props.dataEdit.address ?? '',
      neighborhood: props.dataEdit.neighborhood ?? '',
      addressNumber: props.dataEdit.address_number ?? '',
      city: props.dataEdit.city ?? '',
      complement: props.dataEdit.complement ?? '',
      dateBaptismo: props.dataEdit.date_baptismo ?? '',
      startDate: props.dataEdit.start_date ?? '',
      churchStartDate: props.dataEdit.church_start_date ?? '',
      endDate: props.dataEdit.end_date ?? '',
      churchEndDate: props.dataEdit.church_end_date ?? '',
    });

    selectedNaturalness.value = {
      label:
        states.find((state) => state.value === props.dataEdit?.naturalness)
          ?.label || 'Não informado',
      value: props.dataEdit.naturalness,
    };

    selectedMaritalStatus.value = {
      label:
        marital.find((state) => state.value === props.dataEdit?.marital_status)
          ?.label || 'Não informado',
      value: props.dataEdit.marital_status,
    };

    selectedEducation.value = {
      label:
        education.find((state) => state.value === props.dataEdit?.education)
          ?.label || 'Não informado',
      value: props.dataEdit.education,
    };

    selectedRole.value = props.dataEdit.roles.map((role) => {
      return {
        label: role.name,
        value: role.id,
      };
    });
    selectedMinistry.value = props.dataEdit.ministries.map((role) => {
      return {
        label: role.name,
        value: role.id,
      };
    });

    selectedTypeMinistry.value = {
      label: props.dataEdit.type === 'visitor' ? 'Visitante' : 'Membro',
      value: props.dataEdit.type,
    };

    selectedActive.value = {
      label: props.dataEdit.active === 1 ? 'Ativo' : 'Inativo',
      value: props.dataEdit.active,
    };
  }
};
const fetchMinistries = async () => {
  await getMinistries();
};
const fetchRoles = async () => {
  await getRoles();
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
    const digits = value.replace(/\D/g, '');
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
// const optionsMembers = computed(() => {
//   const options = listMember.value.map((item) => {
//     return {
//       label: item.name,
//       value: item.id,
//     };
//   });

//   return [{ label: 'Não informado', value: null }, ...options];
// });
// const optionsStatusFamily = computed(() => {
//   return [{ label: 'Não informado', value: null }, ...statusFamily];
// });
const isLoading = computed(() => {
  return loading.value || loadingRole.value || loadingMinistry.value;
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
    await fetchMinistries();
    mountData();
    loading.value = false;
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      class="bg-grey-2 form-basic"
      style="min-width: 98vw; max-width: 98vw"
    >
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="
            props.dataEdit ? 'Atualização de membro' : 'Cadastro de membro'
          "
        />
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey bg-grey-2"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="individual" label="Dados Pessoais" />
          <q-tab name="contact" label="Contatos" />
          <q-tab name="address" label="Endereço" />
          <q-tab name="ministry" label="Dados Ministeriais" />
          <!-- <q-tab name="family" label="Família" /> -->
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="individual">
            <q-form class="q-gutter-y-sm">
              <q-input
                v-model="dataMember.name"
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
              <q-input
                v-model="dataMember.profession"
                bg-color="white"
                label-color="black"
                outlined
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
                outlined
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
                outlined
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
                outlined
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
                :options="marital"
                label="Estado civil"
                outlined
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
                outlined
                dense
                options-dense
                map-options
                bg-color="white"
                label-color="black"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="school" color="black" size="20px" />
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
                outlined
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
                outlined
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
                outlined
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
                outlined
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
              <q-input
                v-model="dataMember.uf"
                bg-color="white"
                label-color="black"
                outlined
                label="UF"
                dense
                input-class="text-black"
                :disable="loading"
                :maxlength="2"
              >
                <template v-slot:prepend>
                  <q-icon name="arrow_right" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.city"
                bg-color="white"
                label-color="black"
                outlined
                label="Cidade"
                dense
                input-class="text-black"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="arrow_right" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.neighborhood"
                bg-color="white"
                label-color="black"
                outlined
                label="Bairro"
                dense
                input-class="text-black"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="arrow_right" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.address"
                bg-color="white"
                label-color="black"
                outlined
                label="Endereço"
                dense
                input-class="text-black"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="arrow_right" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.addressNumber"
                bg-color="white"
                label-color="black"
                outlined
                label="Nº"
                dense
                input-class="text-black"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="arrow_right" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="dataMember.complement"
                bg-color="white"
                label-color="black"
                outlined
                label="Complemento"
                dense
                input-class="text-black"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="arrow_right" color="black" size="20px" />
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
                outlined
                dense
                options-dense
                map-options
                bg-color="white"
                label-color="black"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="person" color="black" size="20px" />
                </template>
              </q-select>
              <q-select
                v-model="selectedActive"
                :options="optionsActive"
                label="Situação"
                outlined
                dense
                options-dense
                map-options
                bg-color="white"
                label-color="black"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="check" color="black" size="20px" />
                </template>
              </q-select>
              <q-input
                v-model="dataMember.dateBaptismo"
                bg-color="white"
                label-color="black"
                outlined
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
                v-model="selectedMinistry"
                :options="optionsMinistries"
                label="Selecione o ministério"
                outlined
                dense
                multiple
                options-dense
                map-options
                bg-color="white"
                label-color="black"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="arrow_right" color="black" size="20px" />
                </template>
              </q-select>
              <q-select
                v-model="selectedRole"
                :options="optionsRoles"
                label="Selecione o cargo"
                outlined
                dense
                multiple
                options-dense
                map-options
                bg-color="white"
                label-color="black"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="arrow_right" color="black" size="20px" />
                </template>
              </q-select>
              <q-input
                v-model="dataMember.startDate"
                bg-color="white"
                label-color="black"
                outlined
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
                outlined
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
                outlined
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
                outlined
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
          <!-- <q-tab-panel name="family">
            <q-form v-if="listMember.length > 0" class="q-gutter-y-sm">
              <div class="col q-gutter-y-sm">
                <q-select
                  v-model="selectedMemberFamily"
                  :options="optionsMembers"
                  label="Membro"
                  outlined
                  dense
                  options-dense
                  map-options
                  bg-color="white"
                  label-color="black"
                  class="full-width"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" color="black" size="20px" />
                  </template>
                </q-select>
                <q-select
                  v-model="selectedStatusFamily"
                  :options="optionsStatusFamily"
                  label="Parentesco"
                  outlined
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
              </div>
              <div class="row justify-end">
                <q-btn
                  @click="addFamily"
                  color="secondary"
                  label="Adicionar"
                  size="md"
                  unelevated
                  no-caps
                />
              </div>
              <div>
                <q-table
                  :rows="dataListFamily"
                  :rows-per-page-options="[10]"
                  :columns="columnsListMember"
                  flat
                  bordered
                  dense
                  row-key="index"
                  no-data-label="Nenhum familiar para mostrar"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props" class="bg-grey-2">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        <span style="font-size: 13px">{{ col.label }}</span>
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:top>
                    <span class="text-subtitle2">Lista de familiares</span>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props" style="height: 28px">
                      <q-td key="member" :props="props" class="text-left">
                        <span class="text-subtitle2">{{
                          props.row.member.label
                        }}</span>
                      </q-td>
                      <q-td key="family" :props="props" class="text-left">
                        <span class="text-subtitle2">{{
                          props.row.family.label
                        }}</span>
                      </q-td>
                      <q-td key="action" :props="props">
                        <q-btn
                          @click="deleteFamily(props.rowIndex)"
                          size="sm"
                          flat
                          round
                          color="red"
                          icon="delete"
                        />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </q-form>
            <q-banner v-else dense class="text-white bg-red" rounded>
              Não é possível configurar a sessão de família pois não há membros
              cadastrados.
            </q-banner>
          </q-tab-panel> -->
        </q-tab-panels>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-between q-gutter-x-sm">
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
      </q-card-actions>
      <q-inner-loading
        :showing="loading"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
