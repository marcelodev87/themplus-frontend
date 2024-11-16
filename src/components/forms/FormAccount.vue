<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { Account, DataAccount } from 'src/ts/interfaces/data/Account';
import { useAccountStore } from 'src/stores/account-store';
import { storeToRefs } from 'pinia';
import { banks } from 'src/utils/banks';

defineOptions({
  name: 'FormAccount',
});

const props = defineProps<{
  open: boolean;
  dataEdit: Account | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { createAccount, deleteAccount, updateAccount } = useAccountStore();
const { loadingAccount } = storeToRefs(useAccountStore());

const selectedBank = ref<string | null>(null);
const dataAccount = reactive<DataAccount>({
  name: '',
  agency: '',
  account: '',
  description: '',
});
const optionsBanks = ref(banks);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  if (selectedBank.value === null && dataAccount.name.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome do banco' };
  }
  return { status: true };
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    await createAccount(
      selectedBank.value !== null ? selectedBank.value : dataAccount.name,
      dataAccount.account.trim() === '' ? null : dataAccount.account,
      dataAccount.agency.trim() === '' ? null : dataAccount.agency,
      dataAccount.description.trim() === '' ? null : dataAccount.description
    );
    emit('update:open');
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const clear = (): void => {
  Object.assign(dataAccount, {
    name: '',
    agency: '',
    account: '',
    description: '',
  });
  selectedBank.value = null;
};
const filterBank = (
  val: string,
  update: (arg0: { (): void; (): void }) => void
) => {
  if (val === '') {
    update(() => {
      optionsBanks.value = banks;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    optionsBanks.value = banks.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
};
const update = async () => {
  const check = checkData();
  if (check.status) {
    await updateAccount(
      props.dataEdit?.id ?? '',
      selectedBank.value !== null ? selectedBank.value : dataAccount.name,
      dataAccount.account.trim() === '' ? null : dataAccount.account,
      dataAccount.agency.trim() === '' ? null : dataAccount.agency,
      dataAccount.description.trim() === '' ? null : dataAccount.description
    );
    emit('update:open');
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const checkDataEdit = () => {
  if (props.dataEdit !== null) {
    Object.assign(dataAccount, {
      name: props.dataEdit.name,
      agency: props.dataEdit.account_number ?? '',
      account: props.dataEdit.agency_number ?? '',
      description: props.dataEdit.description ?? '',
    });
  }
};
const exclude = async () => {
  await deleteAccount(props.dataEdit?.id ?? '');
  clear();
  emit('update:open');
};

watch(selectedBank, () => {
  if (selectedBank.value !== null) {
    dataAccount.name = '';
  }
});
watch(open, () => {
  if (open.value) {
    clear();
    checkDataEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="
            props.dataEdit === null
              ? 'Registre uma conta'
              : 'Atualize uma conta'
          "
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-select
            filled
            v-model="selectedBank"
            use-input
            input-debounce="0"
            label="Encontre seu banco"
            :options="optionsBanks"
            @filter="filterBank"
            style="width: 250px"
            behavior="menu"
            bg-color="white"
            clearable
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="black" size="20px" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sem resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input
            v-model="dataAccount.name"
            bg-color="white"
            label-color="black"
            filled
            label="Digite o nome do banco"
            dense
            input-class="text-black"
            :readonly="selectedBank !== null"
          >
            <template v-slot:prepend>
              <q-icon name="assured_workload" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataAccount.account"
            bg-color="white"
            label-color="black"
            filled
            label="Digite a conta do banco"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="info" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataAccount.agency"
            bg-color="white"
            label-color="black"
            filled
            label="Digite a agência do banco"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="info" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataAccount.description"
            style="height: 150px; max-height: 130px"
            bg-color="white"
            label-color="black"
            filled
            label="Digite uma descrição"
            dense
            input-class="text-black no-resize"
            type="textarea"
            class="no-resize"
          >
            <template v-slot:prepend>
              <q-icon name="description" color="black" size="20px" />
            </template>
          </q-input>
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
            @click="exclude"
            v-show="props.dataEdit !== null"
            :loading="loadingAccount"
            color="red"
            label="Excluir"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-if="props.dataEdit === null"
            @click="save"
            :loading="loadingAccount"
            color="primary"
            label="Salvar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            :loading="loadingAccount"
            color="primary"
            label="Atualizar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
