<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormAccount from 'src/components/forms/FormAccount.vue';
import { useAccountStore } from 'src/stores/account-store';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref, watch } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { Account } from 'src/ts/interfaces/data/Account';
import FormTransfer from 'src/components/forms/FormTransfer.vue';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';
import { useAuthStore } from 'src/stores/auth-store';

defineOptions({
  name: 'Account',
});

const { getAccounts, exportAccount, updateActiveAccount } = useAccountStore();
const { loadingAccount, listAccount, filledData } =
  storeToRefs(useAccountStore());
const { user } = storeToRefs(useAuthStore());

const showFormAccount = ref<boolean>(false);
const showAlertDataEnterprise = ref<boolean>(false);
const loadingExport = ref<boolean>(false);
const selectedDataEdit = ref<Account | null>(null);
const filterAccount = ref<string>('');
const showFormTransfer = ref<boolean>(false);
const columnsAccount = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Banco',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'account_number',
    label: 'Conta',
    field: 'account_number',
    align: 'left',
    sortable: true,
  },
  {
    name: 'agency_number',
    label: 'Agência',
    field: 'agency_number',
    align: 'left',
    sortable: true,
  },
  {
    name: 'balance',
    label: 'Saldo',
    field: 'balance',
    align: 'left',
    sortable: true,
  },
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const openFormAccount = (): void => {
  showFormAccount.value = true;
};
const closeFormAccount = (): void => {
  showFormAccount.value = false;
  selectedDataEdit.value = null;
};
const openFormTransfer = (): void => {
  showFormTransfer.value = true;
};
const closeFormTransfer = (): void => {
  showFormTransfer.value = false;
};
const handleEdit = (account: Account) => {
  selectedDataEdit.value = account;
  openFormAccount();
};
const exportData = async (): Promise<void> => {
  loadingExport.value = true;
  await exportAccount();
  loadingExport.value = false;
};
const reactivate = async (id: string) => {
  await updateActiveAccount(id);
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};

watch(
  filledData,
  () => {
    if (!filledData.value) {
      showAlertDataEnterprise.value = true;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await getAccounts();
});
</script>
<template>
  <section>
    <header
      :class="
        !$q.screen.lt.sm
          ? 'row justify-between no-wrap bg-grey-1'
          : 'column justify-between no-wrap bg-grey-1'
      "
    >
      <div :class="!$q.screen.lt.sm ? 'col-5' : 'col-12'">
        <TitlePage title="Gerenciamento de contas" />
      </div>
      <div
        v-if="!$q.screen.lt.sm"
        class="col-6 row items-center justify-end q-gutter-x-sm"
      >
        <q-btn
          @click="exportData"
          :loading="loadingExport"
          flat
          color="black"
          icon-right="download"
          label="Exportar"
          unelevated
          no-caps
        />
        <q-btn
          v-show="user?.enterprise_id === user?.view_enterprise_id"
          @click="openFormTransfer"
          class="bg-contabilidade"
          icon-right="assured_workload"
          label="Transferências"
          unelevated
          no-caps
        />
        <q-btn
          v-show="user?.enterprise_id === user?.view_enterprise_id"
          @click="openFormAccount"
          icon-right="add"
          label="Contas"
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
        />
      </div>
      <div v-else class="row justify-end q-mr-sm q-mb-sm">
        <q-btn-dropdown
          class="text-white"
          color="primary"
          ref="dropdown"
          label="Ações"
          unelevated
          no-caps
        >
          <q-list>
            <q-item
              v-show="user?.enterprise_id === user?.view_enterprise_id"
              clickable
              v-ripple
              @click="openFormAccount"
            >
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="add" />
                </q-avatar>
              </q-item-section>
              <q-item-section>Contas</q-item-section>
            </q-item>
            <q-item
              v-show="user?.enterprise_id === user?.view_enterprise_id"
              clickable
              v-ripple
              @click="openFormTransfer"
            >
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="assured_workload" />
                </q-avatar>
              </q-item-section>
              <q-item-section>Transferências</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="exportData">
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="download" />
                </q-avatar>
              </q-item-section>
              <q-item-section>Exportar</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm" :style="!$q.screen.lt.sm ? '' : 'width: 98vw'">
        <q-table
          :rows="loadingAccount ? [] : listAccount"
          :columns="columnsAccount"
          :filter="filterAccount"
          :loading="loadingAccount"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma conta para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de contas</span>
            <q-space />
            <q-input filled v-model="filterAccount" dense label="Pesquisar">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr
              :props="props"
              style="height: 28px"
              :class="props.row.balance < 0 ? 'text-red' : ''"
            >
              <q-td
                key="name"
                :props="props"
                class="text-left"
                :class="props.row.active === 0 ? 'text-grey-5' : ''"
              >
                <span class="text-subtitle2">{{ props.row.name }}</span>
              </q-td>
              <q-td
                key="account_number"
                :props="props"
                class="text-left"
                :class="props.row.active === 0 ? 'text-grey-5' : ''"
              >
                <span class="text-subtitle2">{{
                  props.row.account_number
                }}</span>
              </q-td>
              <q-td
                key="agency_number"
                :props="props"
                class="text-left"
                :class="props.row.active === 0 ? 'text-grey-5' : ''"
              >
                <span class="text-subtitle2">{{
                  props.row.agency_number
                }}</span>
              </q-td>
              <q-td
                key="balance"
                :props="props"
                class="text-left"
                :class="props.row.active === 0 ? 'text-grey-5' : ''"
              >
                <span class="text-subtitle2">{{
                  `${formatCurrencyBRL(props.row.balance)}`
                }}</span>
              </q-td>
              <q-td
                key="description"
                :props="props"
                class="text-left"
                :class="props.row.active === 0 ? 'text-grey-5' : ''"
              >
                <span class="text-subtitle2">{{ props.row.description }}</span>
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="handleEdit(props.row)"
                  v-show="
                    props.row.active === 1 &&
                    props.row.name !== 'Caixinha' &&
                    user?.enterprise_id === user?.view_enterprise_id
                  "
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  @click="reactivate(props.row.id)"
                  v-show="
                    props.row.active === 0 &&
                    props.row.name !== 'Caixinha' &&
                    user?.enterprise_id === user?.view_enterprise_id
                  "
                  size="sm"
                  flat
                  round
                  color="replay"
                  icon="replay"
                >
                  <q-tooltip> Reativar </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <FormAccount
          :open="showFormAccount"
          :data-edit="selectedDataEdit"
          @update:open="closeFormAccount"
        />
        <FormTransfer
          :open="showFormTransfer"
          @update:open="closeFormTransfer"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
