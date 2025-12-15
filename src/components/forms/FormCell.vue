<!-- eslint-disable no-restricted-globals -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';
import { useMemberStore } from 'src/stores/member-store';
import { Cell } from 'src/ts/interfaces/data/Cell';
import { useCellStore } from 'src/stores/cell-store';
import { useNetworkStore } from 'src/stores/network-store';
import { frequencies } from 'src/utils/frequency';
import { weekDays } from 'src/utils/week-days';
import { searchCep } from 'src/services/cep-service';
import { useAuthStore } from 'src/stores/auth-store';

defineOptions({
  name: 'FormCell',
});

const props = defineProps<{
  open: boolean;
  dataEdit: Cell | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { createCell, updateCell } = useCellStore();
const { user } = storeToRefs(useAuthStore());
const { loadingCell } = storeToRefs(useCellStore());
const { getMembers } = useMemberStore();
const { loadingMember, listMember } = storeToRefs(useMemberStore());
const { getNetworks } = useNetworkStore();
const { loadingNetwork, listNetwork } = storeToRefs(useNetworkStore());

const loading = ref<boolean>(false);
const filterHost = ref<string>('');
const filterLeader = ref<string>('');
const filterNetwork = ref<string>('');
const dataCell = reactive({
  name: '' as string,
  dateFoundation: '' as string,
  dateEnd: '' as string,
  time: '' as string,
  cep: '' as string,
  uf: '' as string,
  address: '' as string,
  addressNumber: '' as string,
  neighborhood: '' as string,
  city: '' as string,
  complement: '' as string,
  location: '' as string,
});
const selectedLeader = ref<QuasarSelect<string | null> | null>(null);
const selectedHost = ref<QuasarSelect<string | null> | null>(null);
const selectedNetwork = ref<QuasarSelect<string | null> | null>(null);
const selectedDayWeek = ref<QuasarSelect<number>>({
  label: 'Segunda-Feira',
  value: 1,
});
const selectedFrequency = ref<QuasarSelect<string>>({
  label: 'Semanal',
  value: 'weekly',
});
const selectedStatus = ref<QuasarSelect<number>>({
  label: 'Ativo',
  value: 1,
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataCell.name.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome da célula',
    };
  }
  if (selectedLeader.value === null || selectedLeader.value?.value === null) {
    return {
      status: false,
      message: 'Selecione um membro dirigente',
    };
  }
  if (selectedHost.value === null || selectedHost.value?.value === null) {
    return {
      status: false,
      message: 'Selecione um membro anfitrião',
    };
  }
  if (selectedNetwork.value === null || selectedNetwork.value?.value === null) {
    return {
      status: false,
      message: 'Selecione uma rede',
    };
  }

  return { status: true };
};
const clearSpaces = (text: string) => {
  return text.trim().length > 0 ? text : null;
};
const clear = (): void => {
  Object.assign(dataCell, {
    name: '',
    dateFoundation: '',
    dateEnd: '',
    time: '',
    cep: '',
    uf: '',
    address: '',
    addressNumber: '',
    neighborhood: '',
    city: '',
    complement: '',
    location: '',
  });

  selectedHost.value = null;
  selectedLeader.value = null;
  selectedNetwork.value = null;
  selectedDayWeek.value = {
    label: 'Segunda-Feira',
    value: 1,
  };
  selectedFrequency.value = {
    label: 'Semanal',
    value: 'weekly',
  };
  selectedStatus.value = {
    label: 'Ativo',
    value: 1,
  };

  filterHost.value = '';
  filterLeader.value = '';
  filterNetwork.value = '';
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    const response = await createCell({
      name: dataCell.name,
      dateFoundation: dataCell.dateFoundation,
      dateEnd: dataCell.dateEnd,
      networkID: selectedNetwork.value!.value,
      leaderID: selectedLeader.value!.value,
      hostID: selectedHost.value!.value,
      active: selectedStatus.value.value,
      location: clearSpaces(dataCell.location),
      dayWeek: selectedDayWeek.value.value,
      frequency: selectedFrequency.value.value,
      time: clearSpaces(dataCell.time),
      cep: clearSpaces(dataCell.cep),
      uf: clearSpaces(dataCell.uf),
      address: clearSpaces(dataCell.address),
      addressNumber: clearSpaces(dataCell.addressNumber),
      neighborhood: clearSpaces(dataCell.neighborhood),
      city: clearSpaces(dataCell.city),
      complement: clearSpaces(dataCell.complement),
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
    const response = await updateCell({
      id: props.dataEdit?.id,
      name: dataCell.name,
      dateFoundation: dataCell.dateFoundation,
      dateEnd: dataCell.dateEnd,
      networkID: selectedNetwork.value!.value,
      leaderID: selectedLeader.value!.value,
      hostID: selectedHost.value!.value,
      active: selectedStatus.value.value,
      location: clearSpaces(dataCell.location),
      dayWeek: selectedDayWeek.value.value,
      frequency: selectedFrequency.value.value,
      time: clearSpaces(dataCell.time),
      cep: clearSpaces(dataCell.cep),
      uf: clearSpaces(dataCell.uf),
      address: clearSpaces(dataCell.address),
      addressNumber: clearSpaces(dataCell.addressNumber),
      neighborhood: clearSpaces(dataCell.neighborhood),
      city: clearSpaces(dataCell.city),
      complement: clearSpaces(dataCell.complement),
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
  await getMembers(1);
  if (listMember.value.length === 0) {
    Notify.create({
      message: 'Necessário cadastrar membro antes de cadastrar célula',
      type: 'negative',
    });
  }
};
const fetchNetworks = async () => {
  await getNetworks();
  if (listNetwork.value.length === 0) {
    Notify.create({
      message: 'Necessário cadastrar rede antes de cadastrar célula',
      type: 'negative',
    });
  }
};
const filterFnHost = (
  val: string,
  updateFilter: (callback: () => void) => void
) => {
  const needle = val.toLowerCase();
  updateFilter(() => {
    filterHost.value = needle;
  });
};
const filterFnNetwork = (
  val: string,
  updateFilter: (callback: () => void) => void
) => {
  const needle = val.toLowerCase();
  updateFilter(() => {
    filterNetwork.value = needle;
  });
};

const optionsMembers = computed(() => {
  const needle = filterHost.value.trim().toLowerCase();

  let filteredList = listMember.value.filter(
    (item) => item.enterprise_id === user?.value?.enterprise_id
  );

  if (needle !== '') {
    filteredList = filteredList.filter((item) =>
      item.name?.toLowerCase().includes(needle)
    );
  }

  const options = filteredList.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  return [...options];
});
const optionsNetworks = computed(() => {
  const needle = filterNetwork.value.trim().toLowerCase();

  let filteredList = listNetwork.value;

  if (needle !== '') {
    filteredList = listNetwork.value.filter((item) =>
      item.name?.toLowerCase().includes(needle)
    );
  }
  const options = filteredList.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  return [...options];
});
const optionsWeekDays = computed(() => {
  return [{ label: 'Não informado', value: null }, ...weekDays];
});
const optionsFrequencies = computed(() => {
  return [{ label: 'Não informado', value: null }, ...frequencies];
});
const optionsActive = computed(() => {
  return [
    {
      label: 'Ativo',
      value: 1,
    },
    {
      label: 'Inativo',
      value: 0,
    },
  ];
});
const isLoading = computed(() => {
  return loadingCell.value || loadingMember.value || loadingNetwork.value;
});

const mountData = () => {
  if (props.dataEdit) {
    Object.assign(dataCell, {
      name: props.dataEdit.name,
      dateFoundation: props.dataEdit.date_foundation ?? '',
      dateEnd: props.dataEdit.date_end ?? '',
      time: props.dataEdit.time ?? '',
      locationAddressMember: props.dataEdit.location_address_member,
      cep: props.dataEdit.cep ?? '',
      uf: props.dataEdit.uf ?? '',
      address: props.dataEdit.address ?? '',
      addressNumber: props.dataEdit.address_number ?? '',
      neighborhood: props.dataEdit.neighborhood ?? '',
      city: props.dataEdit.city ?? '',
      complement: props.dataEdit.complement ?? '',
      location: props.dataEdit.location ?? '',
      active: props.dataEdit.active,
    });

    const foundHost = listMember.value.find(
      (state) => state.id === props.dataEdit?.host_id
    );
    selectedHost.value = foundHost
      ? { label: foundHost.name, value: foundHost.id }
      : null;

    const foundNetwork = listNetwork.value.find(
      (state) => state.id === props.dataEdit?.network_id
    );
    selectedNetwork.value = foundNetwork
      ? { label: foundNetwork.name, value: foundNetwork.id }
      : null;

    const foundLeader = listMember.value.find(
      (state) => state.id === props.dataEdit?.leader_id
    );
    selectedLeader.value = foundLeader
      ? { label: foundLeader.name, value: foundLeader.id }
      : null;

    selectedDayWeek.value = {
      label:
        weekDays.find((state) => state.value === props.dataEdit?.day_week)
          ?.label || 'Não informado',
      value: props.dataEdit.day_week,
    };

    selectedFrequency.value = {
      label:
        frequencies.find((state) => state.value === props.dataEdit?.frequency)
          ?.label || 'Não informado',
      value: props.dataEdit.frequency,
    };

    selectedStatus.value = {
      label:
        optionsActive.value.find(
          (state) => state.value === props.dataEdit?.active
        )?.label || 'Não informado',
      value: props.dataEdit.active,
    };
  }
};

watch(
  () => dataCell.cep,
  async (cep: string) => {
    dataCell.cep = dataCell.cep.replace(/\D/g, '');
    if (cep.trim().length === 8) {
      loading.value = true;
      const response = await searchCep(cep);
      if (response.status === 200) {
        dataCell.neighborhood = response.data.bairro;
        dataCell.uf = response.data.estado;
        dataCell.city = response.data.localidade;
        dataCell.address = response.data.logradouro;
      }
    } else {
      dataCell.neighborhood = '';
      dataCell.uf = '';
      dataCell.city = '';
      dataCell.address = '';
    }
    loading.value = false;
  }
);
watch(open, async () => {
  if (open.value) {
    clear();
    await fetchNetworks();
    await fetchMembers();
    mountData();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="
            props.dataEdit === null
              ? 'Cadastro de célula'
              : 'Atualização de célula'
          "
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataCell.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome da célula"
            dense
            input-class="text-black no-spinners"
          >
            <template v-slot:prepend>
              <q-icon name="badge" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataCell.dateFoundation"
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
            v-model="dataCell.dateEnd"
            bg-color="white"
            label-color="black"
            outlined
            label="Data do término"
            dense
            input-class="text-black"
            mask="##/##/####"
          >
            <template v-slot:prepend>
              <q-icon name="calendar_today" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="selectedLeader"
            :options="optionsMembers"
            label="Dirigente"
            outlined
            dense
            options-dense
            map-options
            bg-color="white"
            label-color="black"
            @filter="filterFnHost"
            use-input
            input-debounce="0"
            behavior="menu"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-model="selectedNetwork"
            :options="optionsNetworks"
            label="Rede"
            outlined
            dense
            options-dense
            map-options
            bg-color="white"
            label-color="black"
            @filter="filterFnNetwork"
            use-input
            input-debounce="0"
            behavior="menu"
          >
            <template v-slot:prepend>
              <q-icon name="group_work" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-model="selectedStatus"
            :options="optionsActive"
            label="Status"
            outlined
            dense
            options-dense
            map-options
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="check" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataCell.location"
            bg-color="white"
            label-color="black"
            outlined
            label="Local"
            dense
            input-class="text-black no-spinners"
          >
            <template v-slot:prepend>
              <q-icon name="location_on" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="selectedDayWeek"
            :options="optionsWeekDays"
            label="Dia da semana"
            outlined
            dense
            options-dense
            map-options
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="calendar_month" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-model="selectedFrequency"
            :options="optionsFrequencies"
            label="Frequência"
            outlined
            dense
            options-dense
            map-options
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="event_repeat" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataCell.time"
            bg-color="white"
            label-color="black"
            outlined
            label="Horário"
            mask="##:##"
            dense
            input-class="text-black no-spinners"
          >
            <template v-slot:prepend>
              <q-icon name="timer" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="selectedHost"
            :options="optionsMembers"
            label="Anfitrião"
            outlined
            dense
            options-dense
            map-options
            bg-color="white"
            label-color="black"
            @filter="filterFnHost"
            use-input
            input-debounce="0"
            behavior="menu"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataCell.cep"
            bg-color="white"
            label-color="black"
            outlined
            label="Digite o CEP"
            dense
            input-class="text-black"
            maxlength="8"
            :loading="loading"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="black" size="20px" />
            </template>
          </q-input>
          <div class="row justify-between">
            <q-input
              v-model="dataCell.uf"
              bg-color="white"
              label-color="black"
              outlined
              label="UF"
              dense
              input-class="text-black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="location_on" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataCell.city"
              bg-color="white"
              label-color="black"
              outlined
              label="Cidade"
              dense
              input-class="text-black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="location_on" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="dataCell.neighborhood"
            bg-color="white"
            label-color="black"
            outlined
            label="Bairro"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="location_on" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataCell.address"
            bg-color="white"
            label-color="black"
            outlined
            label="Logradouro"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="location_on" color="black" size="20px" />
            </template>
          </q-input>
          <div class="row justify-between">
            <q-input
              v-model="dataCell.addressNumber"
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
                <q-icon name="location_on" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataCell.complement"
              bg-color="white"
              label-color="black"
              outlined
              label="Complemento"
              dense
              input-class="text-black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="location_on" color="black" size="20px" />
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
            v-if="props.dataEdit === null"
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="isLoading"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="isLoading"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
      <q-inner-loading
        :showing="loadingMember || loadingNetwork"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
