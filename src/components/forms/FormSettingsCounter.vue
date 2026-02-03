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
    <q-card class="form-basic bg-grey-2">
      <q-card-section class="q-pa-none">
        <div class="row items-center q-pa-sm bg-grey-1">
          <TitlePage title="Acessos da contabilidade" />
        </div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <q-form class="column q-gutter-y-md">
          <q-expansion-item
            group="settings"
            icon="manage_accounts"
            label="Permissões de Usuários"
            header-class="text-weight-bold text-primary"
            class="overflow-hidden border-grey rounded-borders shadow-1"
            default-opened
          >
            <q-list separator>
              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Adicionar Usuários</q-item-label>
                  <q-item-label caption
                    >Permite criar novos perfis na organização</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <q-toggle
                    v-model="dataSettings.allowAddUser"
                    :true-value="1"
                    :false-value="0"
                    color="green"
                  />
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Editar Usuários</q-item-label>
                  <q-item-label caption
                    >Permite alterar dados de membros existentes</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <q-toggle
                    v-model="dataSettings.allowEditUser"
                    :true-value="1"
                    :false-value="0"
                    color="green"
                  />
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Deletar Usuários</q-item-label>
                  <q-item-label caption
                    >Permite remover perfis da organização</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <q-toggle
                    v-model="dataSettings.allowDeleteUser"
                    :true-value="1"
                    :false-value="0"
                    color="red"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-expansion-item
            group="settings"
            icon="receipt_long"
            label="Permissões de Movimentações"
            header-class="text-weight-bold text-primary"
            class="overflow-hidden border-grey rounded-borders shadow-1"
          >
            <q-list separator>
              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Editar Movimentações</q-item-label>
                  <q-item-label caption
                    >Alterar registros em relatórios já entregues</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <q-toggle
                    v-model="dataSettings.allowEditMovement"
                    :true-value="1"
                    :false-value="0"
                    color="green"
                  />
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Deletar Movimentações</q-item-label>
                  <q-item-label caption
                    >Remover registros em relatórios já entregues</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <q-toggle
                    v-model="dataSettings.allowDeleteMovement"
                    :true-value="1"
                    :false-value="0"
                    color="red"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md bg-grey-1">
        <q-btn
          flat
          label="Cancelar"
          color="red"
          v-close-popup
          no-caps
          class="q-px-md"
        />
        <q-btn
          @click="update"
          :loading="loadingDelivery"
          label="Salvar"
          color="primary"
          unelevated
          no-caps
          class="q-px-lg text-weight-bold"
        />
      </q-card-actions>

      <q-inner-loading :showing="loadingDelivery">
        <q-spinner-dots size="50px" color="primary" />
      </q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.border-grey {
  border: 1px solid #e0e0e0;
}
</style>
