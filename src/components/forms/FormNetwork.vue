<!-- eslint-disable no-restricted-globals -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';
import { useMemberStore } from 'src/stores/member-store';
import { useNetworkStore } from 'src/stores/network-store';
import { Network } from 'src/ts/interfaces/data/Network';

defineOptions({
  name: 'FormNetwork',
});

const props = defineProps<{
  open: boolean;
  dataEdit: Network | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { getMembers } = useMemberStore();
const { loadingMember, listMember } = storeToRefs(useMemberStore());
const { createNetwork, updateNetwork } = useNetworkStore();
const { loadingNetwork } = storeToRefs(useNetworkStore());

const dataNetwork = reactive({
  name: '' as string,
});
const selectedMember = ref<QuasarSelect<string | null>>({
  label: 'Não informado',
  value: null,
});
const selectedCongregation = ref<QuasarSelect<string | null>>({
  label: 'Não informado',
  value: null,
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataNetwork.name.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome da rede',
    };
  }
  if (selectedMember.value.value === null) {
    return {
      status: false,
      message: 'Selecione um membro para coordenar a rede',
    };
  }
  if (selectedCongregation.value.value === null) {
    return {
      status: false,
      message: 'Selecione uma congregação',
    };
  }

  return { status: true };
};
const clear = (): void => {
  Object.assign(dataNetwork, {
    name: '',
  });

  selectedMember.value = {
    label: 'Não informado',
    value: null,
  };
  selectedCongregation.value = {
    label: 'Não informado',
    value: null,
  };
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    const response = await createNetwork({
      name: dataNetwork.name,
      memberID: selectedMember.value.value,
      congregationID: selectedCongregation.value.value,
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
    const response = await updateNetwork({
      id: props.dataEdit?.id,
      name: dataNetwork.name,
      memberID: selectedMember.value.value,
      congregationID: selectedCongregation.value.value,
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
// const fetchCongregations = async () => {
//   await getCongregations();
// };
const mountData = () => {
  if (props.dataEdit) {
    Object.assign(dataNetwork, {
      name: props.dataEdit.name,
    });

    selectedMember.value = {
      label:
        listMember.value.find((state) => state.id === props.dataEdit?.member_id)
          ?.name || 'Não informado',
      value: props.dataEdit.member_id,
    };
    // selectedCongregation.value = {
    //   label:
    //     listCongregation.value.find(
    //       (state) => state.id === props.dataEdit?.congregation_id
    //     )?.name || 'Não informado',
    //   value: props.dataEdit.congregation_id,
    // };
  }
};

const optionsMembers = computed(() => {
  const options = listMember.value.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  return [{ label: 'Não informado', value: null }, ...options];
});
// const optionsCongregations = computed(() => {
//   const options = listCongregation.value.map((item) => {
//     return {
//       label: item.name,
//       value: item.id,
//     };
//   });

//   return [{ label: 'Não informado', value: null }, ...options];
// });

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchMembers();
    // await fetchCongregations();
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
            props.dataEdit === null ? 'Cadastro de rede' : 'Atualização de rede'
          "
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataNetwork.name"
            bg-color="white"
            label-color="black"
            filled
            label="Nome da rede"
            dense
            input-class="text-black no-spinners"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="selectedMember"
            :options="optionsMembers"
            label="Coordenador"
            filled
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
          <q-select
            v-model="selectedCongregation"
            :options="[]"
            label="Congregação"
            filled
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
            :loading="loadingMember || loadingNetwork"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingMember || loadingNetwork"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
      <q-inner-loading
        :loading="loadingMember"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
