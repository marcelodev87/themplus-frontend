<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { DataTransfer } from 'src/ts/interfaces/data/Transfer';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { useAccountStore } from 'src/stores/account-store';

defineOptions({
  name: 'FormTransfer',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { accountsSelect, loadingAccount } = storeToRefs(useAccountStore());
const { createTransfer } = useAccountStore();

const dataTransfer = reactive<DataTransfer>({
  value: '0.00',
  date: null,
  account_out: null,
  account_enter: null,
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataTransfer.account_out === null) {
    return {
      status: false,
      message: 'Deve ser selecionado de onde está saindo a transferência',
    };
  }
  if (dataTransfer.account_enter === null) {
    return {
      status: false,
      message: 'Deve ser selecionado onde está entrando a transferência',
    };
  }
  if (dataTransfer.account_enter === dataTransfer.account_out) {
    return {
      status: false,
      message: 'Deve ser selecionado contas distintas para transferência',
    };
  }
  if (dataTransfer.value === null || dataTransfer.value.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o valor da transferência',
    };
  }
  if (
    dataTransfer.date?.trim() === '' ||
    !/^(0?[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(
      dataTransfer.date ?? ''
    )
  ) {
    return {
      status: false,
      message: 'A data deve ser informada no formato dd/mm/yyyy',
    };
  }

  return { status: true };
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    await createTransfer(
      dataTransfer.account_out?.value ?? '',
      dataTransfer.account_enter?.value ?? '',
      dataTransfer.value,
      dataTransfer.date ?? ''
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
  Object.assign(dataTransfer, {
    value: '0.00',
    date: null,
    account_enter: null,
    account_out: null,
  });
};

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
        <TitlePage title="Registre uma transferência" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm column items-center">
          <q-select
            v-model="dataTransfer.account_out"
            :options="accountsSelect"
            label="De onde está saindo?"
            filled
            clearable
            dense
            options-dense
            map-options
            bg-color="red-2"
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="account_balance" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-model="dataTransfer.account_enter"
            :options="accountsSelect"
            label="Para onde está indo?"
            filled
            clearable
            dense
            options-dense
            map-options
            bg-color="green-2"
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="account_balance" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataTransfer.value"
            bg-color="white"
            label-color="black"
            filled
            label="Digite o valor"
            dense
            input-class="text-black no-spinners"
            type="text"
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataTransfer.date"
            bg-color="white"
            label-color="black"
            label="Selecione uma data"
            class="full-width"
            filled
            dense
          >
            <template v-slot:prepend>
              <q-icon
                name="calendar_today"
                class="cursor-pointer"
                color="black"
                size="20px"
              >
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="dataTransfer.date" mask="DD/MM/YYYY">
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Fechar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
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
            :disable="false"
            unelevated
            no-caps
          />
          <q-btn
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingAccount"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
