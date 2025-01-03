<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { storeToRefs } from 'pinia';
import { useOrderStore } from 'src/stores/order-store';
import TitlePage from '../shared/TitlePage.vue';
import ConfirmAction from '../confirm/ConfirmAction.vue';

defineOptions({
  name: 'CounterInfo',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { hasCounter } = storeToRefs(useOrderStore());
const { loadingEnterprise, counterSearch } = storeToRefs(useEnterpriseStore());
const { showEnterprise, unlinkCounter } = useEnterpriseStore();

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const showConfirmAction = ref<boolean>(false);

const closeConfirmActionOk = async (): Promise<void> => {
  showConfirmAction.value = false;
  const response = await unlinkCounter();
  if (response?.status === 200) {
    emit('update:open');
  }
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
};

const fetchDataCounter = async () => {
  await showEnterprise(hasCounter.value ?? '');
};
const unlink = () => {
  showConfirmAction.value = true;
};

watch(open, async () => {
  if (open.value) {
    await fetchDataCounter();
  }
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Dados da organização de contabilidade vinculada" />
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-banner dense inline-actions class="text-black bg-grey-4" rounded>
          Sua organização está vinculada a uma outra organização de
          contabilidade nomeada como:
          <span class="text-bold">{{
            counterSearch?.name ?? 'Sem nome cadastrado'
          }}</span
          >. As formas de contato são através do e-mail:
          <span class="text-bold">{{
            counterSearch?.email ?? 'Sem e-mail cadastrado'
          }}</span>
          e através do número:
          <span class="text-bold">{{
            counterSearch?.phone ?? 'Sem número cadastrado'
          }}</span
          >. A organização de contabilidade porta do documento de
          <span class="text-bold"
            >{{
              counterSearch && counterSearch.cpf
                ? `CPF: ${counterSearch.cpf}`
                : `CNPJ: ${counterSearch?.cnpj}`
            }}.</span
          >
          O endereço do mesmo, consta que se localiza no estado
          <span class="text-bold">{{ counterSearch?.state }}</span
          >, cidade <span class="text-bold">{{ counterSearch?.city }}</span
          >, bairro
          <span class="text-bold">{{ counterSearch?.neighborhood }}</span
          >, endereço
          <span class="text-bold">{{ counterSearch?.address }}</span> com número
          <span class="text-bold">{{ counterSearch?.number_address }}</span>
          {{
            counterSearch?.complement !== null
              ? ` e complemento ${counterSearch?.complement}`
              : ''
          }}.
        </q-banner>
        <q-inner-loading
          :showing="loadingEnterprise"
          label="Carregando os dados..."
          label-class="black"
          label-style="font-size: 1.1em"
          color="primary"
          size="50px"
        />
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            @click="open = false"
            color="red"
            flat
            label="Fechar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            @click="unlink"
            color="red"
            label="Desvincular"
            size="md"
            unelevated
            no-caps
          />
        </div>
        <ConfirmAction
          :open="showConfirmAction"
          label-action="Continuar"
          title="Confirmação de desvínculo"
          message="Este processo é irreversível. Caso tenha certeza, clique em 'Continuar' para prosseguir."
          @update:open="closeConfirmAction"
          @update:ok="closeConfirmActionOk"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
