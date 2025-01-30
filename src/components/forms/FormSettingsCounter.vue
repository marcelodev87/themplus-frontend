<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useFinancialStore } from 'src/stores/financial-store';

defineOptions({
  name: 'FormSettingsCounter',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { updateSettingsCounter, getSettingsCounter } = useFinancialStore();
const { loadingDelivery, settingsCounter } = storeToRefs(useFinancialStore());

const dataSettings = reactive({
  allowAddUser: 0 as number,
  allowEditUser: 0 as number,
  allowDeleteUser: 0 as number,
  allowEditMovement: 0 as number,
  allowDeleteMovement: 0 as number,
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const mountData = () => {
  if (settingsCounter.value) {
    Object.assign(dataSettings, {
      allowAddUser: settingsCounter.value.allow_add_user,
      allowEditUser: settingsCounter.value.allow_edit_user,
      allowDeleteUser: settingsCounter.value.allow_delete_user,
      allowEditMovement: settingsCounter.value.allow_edit_movement,
      allowDeleteMovement: settingsCounter.value.allow_delete_movement,
    });
  }
};
const clear = (): void => {
  Object.assign(dataSettings, {
    allowAddUser: 1,
    allowEditUser: 1,
    allowDeleteUser: 1,
    allowEditMovement: 0,
    allowDeleteMovement: 0,
  });
};
const update = async () => {
  const response = await updateSettingsCounter(
    dataSettings.allowAddUser,
    dataSettings.allowEditUser,
    dataSettings.allowEditUser,
    dataSettings.allowEditMovement,
    dataSettings.allowDeleteMovement
  );
  if (response?.status === 200) {
    emit('update:open');
  }
};
const fetchSettings = async () => {
  await getSettingsCounter();
  mountData();
};

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchSettings();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage
          title="Configurações de vínculo com contabilidade"
          class="bg-grey-4"
        />
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-form class="column q-gutter-y-sm">
          <q-toggle
            v-model="dataSettings.allowAddUser"
            :true-value="1"
            :false-value="0"
          >
            <span>
              Permitir contabilidade
              <span class="text-bold">adicionar usuários</span> á sua
              organização
            </span>
          </q-toggle>
          <q-toggle
            v-model="dataSettings.allowEditUser"
            :true-value="1"
            :false-value="0"
          >
            <span>
              Permitir contabilidade
              <span class="text-bold">editar usuários</span> da sua organização
            </span>
          </q-toggle>
          <q-toggle
            v-model="dataSettings.allowDeleteUser"
            :true-value="1"
            :false-value="0"
          >
            <span>
              Permitir contabilidade
              <span class="text-bold">deletar usuários</span> da sua organização
            </span>
          </q-toggle>
          <q-toggle
            v-model="dataSettings.allowEditMovement"
            :true-value="1"
            :false-value="0"
          >
            <span>
              Permitir contabilidade
              <span class="text-bold">editar movimentações</span> de relatórios
              entregues da sua organização
            </span>
          </q-toggle>
          <q-toggle
            v-model="dataSettings.allowDeleteMovement"
            :true-value="1"
            :false-value="0"
          >
            <span>
              Permitir contabilidade
              <span class="text-bold">deletar movimentações</span> de relatórios
              entregues da sua organização
            </span>
          </q-toggle>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            @click="open = false"
            color="red"
            label="Fechar"
            size="md"
            flat
            unelevated
            no-caps
          />
          <q-btn
            @click="update"
            :loading="loadingDelivery"
            color="primary"
            label="Salvar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
      <q-inner-loading
        :showing="loadingDelivery"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
