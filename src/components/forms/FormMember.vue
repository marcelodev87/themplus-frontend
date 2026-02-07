<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { searchCep } from 'src/services/cep-service';
import { storeToRefs } from 'pinia';
import {
  DataListFamily,
  MemberChurch,
  PreRegistration,
} from 'src/ts/interfaces/data/Member';
import { useMemberStore } from 'src/stores/member-store';
import { useRoleStore } from 'src/stores/role-store';
import { QuasarSelect, QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { states } from 'src/utils/state';
import { education } from 'src/utils/education';
import { marital } from 'src/utils/marital';
import { useMinistryStore } from 'src/stores/ministry-store';
import { useRelationshipStore } from 'src/stores/relationship-store';

defineOptions({
  name: 'FormMember',
});

const props = defineProps<{
  open: boolean;
  dataEdit: MemberChurch | null;
  dataPreRegistration: PreRegistration | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const memberID = computed(() => props.dataEdit?.id ?? '');

const { deleteRegistration } = useMemberStore();
const { createMember, updateMember, getMembers } = useMemberStore();
const { getRoles } = useRoleStore();
const { listMember, loadingMember } = storeToRefs(useMemberStore());
const { loadingRole, listRole } = storeToRefs(useRoleStore());
const { listMinistry, loadingMinistry } = storeToRefs(useMinistryStore());
const { listRelationship, loadingRelationship } = storeToRefs(
  useRelationshipStore()
);
const { getRelationships } = useRelationshipStore();
const { getMinistries } = useMinistryStore();

const tab = ref<'individual' | 'contact' | 'address' | 'ministry' | 'family'>(
  'individual'
);
const filterMinistry = ref<string>('');
const filterRole = ref<string>('');
const filterMember = ref<string>('');
const filterRelationship = ref<string>('');
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
const selectedMemberFamily = ref<QuasarSelect<string | null> | null>(null);
const selectedStatusFamily = ref<QuasarSelect<string | null> | null>(null);
const columnsListFamily = reactive<QuasarTable[]>([
  {
    name: 'member',
    label: 'Membro',
    field: 'member',
    align: 'left',
  },
  {
    name: 'family',
    label: 'Parentesco',
    field: 'family',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ações',
    field: 'action',
    align: 'right',
  },
]);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const optionsRoles = computed(() => {
  const needle = filterRole.value.trim().toLowerCase();

  let filteredList = listRole.value;

  if (needle !== '') {
    filteredList = listRole.value.filter((item) =>
      item.name?.toLowerCase().includes(needle)
    );
  }

  return filteredList.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
});
const optionsMinistries = computed(() => {
  const needle = filterMinistry.value.trim().toLowerCase();

  let filteredList = listMinistry.value;

  if (needle !== '') {
    filteredList = listMinistry.value.filter((item) =>
      item.name?.toLowerCase().includes(needle)
    );
  }
  return filteredList.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
});

const clearSpaces = (text: string) => {
  return text.trim().length > 0 ? text : null;
};
const checkData = (): { status: boolean; messages?: string[] } => {
  const errors: string[] = [];

  if (dataMember.name.trim() === '') {
    errors.push('Deve ser informado o nome do membro');
  }

  if (dataMember.cpf.trim() === '' || dataMember.cpf.trim().length !== 11) {
    errors.push('Deve ser informado um CPF válido');
  }

  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  if (
    dataMember.phone.trim() !== '' &&
    !phoneRegex.test(dataMember.phone.trim())
  ) {
    errors.push('Digite um telefone pessoal válido');
  }

  if (
    dataMember.phoneProfessional.trim() !== '' &&
    !phoneRegex.test(dataMember.phoneProfessional.trim())
  ) {
    errors.push('Digite um telefone profissional válido');
  }

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  if (
    dataMember.email?.trim() !== '' &&
    !validateEmail(dataMember.email.trim())
  ) {
    errors.push('Digite um email pessoal válido');
  }

  if (
    dataMember.emailProfessional?.trim() !== '' &&
    !validateEmail(dataMember.emailProfessional.trim())
  ) {
    errors.push('Digite um email profissional válido');
  }

  const validateDate = (value: string, label: string) => {
    if (value.trim() === '') return;

    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(regex);

    if (!match) {
      errors.push(`${label} deve estar no formato DD/MM/YYYY`);
      return;
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    if (month < 1 || month > 12) {
      errors.push(`${label}: mês inválido`);
      return;
    }

    const dateCheck = new Date(year, month - 1, day);

    if (dateCheck.getMonth() !== month - 1 || dateCheck.getDate() !== day) {
      errors.push(`${label}: dia inválido para o mês informado`);
    }

    if (year < 1900 || year > 2100) {
      errors.push(`${label}: ano fora do intervalo permitido`);
    }
  };

  validateDate(dataMember.dateBirth, 'Data de nascimento');
  validateDate(dataMember.dateBaptismo, 'Data de batismo');
  validateDate(dataMember.startDate, 'Data de início');
  validateDate(dataMember.endDate, 'Data de término');

  if (errors.length > 0) {
    return {
      status: false,
      messages: errors,
    };
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

  selectedMemberFamily.value = null;

  selectedStatusFamily.value = null;

  dataListFamily.value = [];

  filterMinistry.value = '';
  filterRole.value = '';
  filterRelationship.value = '';
  filterMember.value = '';
};
const getDataFamily = () => {
  if (!dataListFamily.value || dataListFamily.value.length === 0) {
    return null;
  }

  return dataListFamily.value.map((item) => {
    return {
      memberID: item.member.value!,
      relationshipID: item.family.value!,
    };
  });
};
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
      family: getDataFamily(),
    });
    if (response?.status === 201) {
      if (props.dataPreRegistration) {
        await deleteRegistration(props.dataPreRegistration.id);
      }
      emit('update:open');
    }
  } else {
    Notify.create({
      message: (check.messages ?? []).join('<br>'),
      html: true,
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
      family: getDataFamily(),
    });
    if (response?.status === 200) {
      emit('update:open');
    }
  } else {
    Notify.create({
      message: (check.messages ?? []).join('<br>'),
      html: true,
      type: 'negative',
    });
  }
};
const addFamily = () => {
  const memberToAdd = selectedMemberFamily.value;
  const statusToAdd = selectedStatusFamily.value;

  if (memberToAdd?.value && statusToAdd?.value) {
    const memberAlreadyExists = dataListFamily.value.some(
      (item) => item.member.value === memberToAdd.value
    );

    if (memberAlreadyExists) {
      Notify.create({
        message: 'Não é possível ter 2 parentescos com o mesmo membro',
        type: 'negative',
      });
      return;
    }

    dataListFamily.value.push({
      member: memberToAdd,
      family: statusToAdd,
    });

    selectedMemberFamily.value = null;
    selectedStatusFamily.value = null;
  }
};
const deleteFamily = (index: number): void => {
  dataListFamily.value.splice(index, 1);
};
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

    if (props.dataEdit.family.length > 0) {
      props.dataEdit.family.forEach((item) => {
        const foundMember = listMember.value.find(
          (member) => member.id === item.pivot.related_member_id
        );

        const foundFamily = listRelationship.value.find(
          (relationship) => relationship.id === item.pivot.relationship_id
        );

        const memberOption = foundMember
          ? { label: foundMember.name, value: foundMember.id }
          : null;

        const familyOption = foundFamily
          ? { label: foundFamily.name, value: foundFamily.id }
          : null;

        if (memberOption && familyOption) {
          dataListFamily.value.push({
            member: memberOption,
            family: familyOption,
          });
        }
      });
    }
  }
  if (props.dataPreRegistration) {
    Object.assign(dataMember, {
      name: props.dataPreRegistration.name,
      email: props.dataPreRegistration.email ?? '',
      phone: props.dataPreRegistration.phone ?? '',
      cpf: props.dataPreRegistration.cpf ?? '',
      profession: props.dataPreRegistration.profession ?? '',
      dateBirth: props.dataPreRegistration.date_birth ?? '',
      cep: props.dataPreRegistration.cep ?? '',
      uf: props.dataPreRegistration.uf ?? '',
      address: props.dataPreRegistration.address ?? '',
      neighborhood: props.dataPreRegistration.neighborhood ?? '',
      addressNumber: props.dataPreRegistration.address_number ?? '',
      city: props.dataPreRegistration.city ?? '',
      complement: props.dataPreRegistration.complement ?? '',
      dateBaptismo: props.dataPreRegistration.date_baptismo ?? '',
    });

    selectedNaturalness.value = {
      label:
        states.find(
          (state) => state.value === props.dataPreRegistration?.naturalness
        )?.label || 'Não informado',
      value: props.dataPreRegistration.naturalness,
    };

    selectedMaritalStatus.value = {
      label:
        marital.find(
          (state) => state.value === props.dataPreRegistration?.marital_status
        )?.label || 'Não informado',
      value: props.dataPreRegistration.marital_status,
    };

    selectedEducation.value = {
      label:
        education.find(
          (state) => state.value === props.dataPreRegistration?.education
        )?.label || 'Não informado',
      value: props.dataPreRegistration.education,
    };
  }
};
const fetchMinistries = async () => {
  await getMinistries();
};
const fetchRoles = async () => {
  await getRoles();
};
const fetchMembers = async () => {
  await getMembers();
};
const fetchRelationships = async () => {
  await getRelationships();
};
const filterFnMinistry = (
  val: string,
  updateFilter: (callback: () => void) => void
) => {
  const needle = val.toLowerCase();
  updateFilter(() => {
    filterMinistry.value = needle;
  });
};
const filterFnRoles = (
  val: string,
  updateFilter: (callback: () => void) => void
) => {
  const needle = val.toLowerCase();
  updateFilter(() => {
    filterRole.value = needle;
  });
};
const filterFnMembers = (
  val: string,
  updateFilter: (callback: () => void) => void
) => {
  const needle = val.toLowerCase();
  updateFilter(() => {
    filterMember.value = needle;
  });
};
const filterFnRelationships = (
  val: string,
  updateFilter: (callback: () => void) => void
) => {
  const needle = val.toLowerCase();
  updateFilter(() => {
    filterRelationship.value = needle;
  });
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
const optionsMembers = computed(() => {
  const needle = filterMember.value.trim().toLowerCase();

  let filteredList = listMember.value;

  if (needle !== '') {
    filteredList = listMember.value.filter((item) =>
      item.name?.toLowerCase().includes(needle)
    );
  }

  return filteredList.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
});
const optionsStatusFamily = computed(() => {
  const needle = filterRelationship.value.trim().toLowerCase();

  let filteredList = listRelationship.value;

  if (needle !== '') {
    filteredList = listRelationship.value.filter((item) =>
      item.name?.toLowerCase().includes(needle)
    );
  }

  return filteredList
    .map((item) => ({
      label: item.name,
      value: item.id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
});

const isLoading = computed(() => {
  return (
    loading.value ||
    loadingRole.value ||
    loadingMinistry.value ||
    loadingMember.value ||
    loadingRelationship.value
  );
});
const disableBtnAddFamily = computed(() => {
  return selectedMemberFamily.value?.value && selectedStatusFamily.value?.value;
});
const showInfoRelationship = computed(() => {
  return (
    props.dataPreRegistration &&
    props.dataPreRegistration.relationships.length > 0
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
    await fetchMinistries();
    await fetchMembers();
    await fetchRelationships();
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
          <q-tab name="family" label="Família" />
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
                clearable
                dense
                multiple
                options-dense
                map-options
                bg-color="white"
                label-color="black"
                class="full-width"
                use-input
                input-debounce="0"
                behavior="menu"
                @filter="filterFnMinistry"
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
                use-input
                input-debounce="0"
                behavior="menu"
                @filter="filterFnRoles"
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
          <q-tab-panel name="family">
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
                  use-input
                  input-debounce="0"
                  behavior="menu"
                  @filter="filterFnMembers"
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
                  use-input
                  input-debounce="0"
                  behavior="menu"
                  @filter="filterFnRelationships"
                >
                  <template v-slot:prepend>
                    <q-icon name="favorite" color="black" size="20px" />
                  </template>
                </q-select>
              </div>
              <div class="row justify-end q-gutter-x-sm">
                <q-btn
                  v-if="showInfoRelationship"
                  color="secondary"
                  icon="info"
                  size="md"
                  unelevated
                  no-caps
                  round
                >
                  <q-tooltip class="bg-dark text-white">
                    <div class="column q-gutter-xs" style="min-width: 200px">
                      <div
                        v-for="(item, index) in props.dataPreRegistration
                          ?.relationships"
                        :key="index"
                        class="row items-center"
                      >
                        <span class="text-bold">{{ item.member }}</span>
                        <span class="q-ml-xs">— {{ item.kinship }}</span>
                      </div>
                    </div>
                  </q-tooltip>
                </q-btn>
                <q-btn
                  @click="addFamily"
                  :disable="!disableBtnAddFamily"
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
                  :columns="columnsListFamily"
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
          </q-tab-panel>
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
