<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { useAuthStore } from 'src/stores/auth-store';
import Paginate from 'src/components/general/Paginate.vue';
import { useMemberStore } from 'src/stores/member-store';
import { MemberChurch, PreRegistration } from 'src/ts/interfaces/data/Member';
import FormMember from 'src/components/forms/FormMember.vue';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import ManageRole from 'src/components/manage/ManageRole.vue';
import MemberMovementInfo from 'src/components/info/MemberMovementInfo.vue';
// import ManageRelationship from 'src/components/manage/ManageRelationship.vue';
import MemberFamilyInfo from 'src/components/info/MemberFamilyInfo.vue';
import ManagePreRegistration from 'src/components/manage/ManagePreRegistration.vue';

defineOptions({
  name: 'Member',
});

const { user } = storeToRefs(useAuthStore());
const { listMember, loadingMember, filledData } = storeToRefs(useMemberStore());
const {
  getMembers,
  deleteMember,
  updateActiveMember,
  downloadCertificateBaptismo,
} = useMemberStore();

const router = useRouter();

const subscripitonName = computed(
  () => user.value?.enterprise.subscription.name
);

const showConfirmAction = ref<boolean>(false);
const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(10);
const showAlertDataEnterprise = ref<boolean>(false);
const showMemberFamily = ref<boolean>(false);
const showFormMember = ref<boolean>(false);
const showMemberMovementInfo = ref<boolean>(false);
const showManageRole = ref<boolean>(false);
const showManagePreRegistration = ref<boolean>(false);
// const showManageRelationship = ref<boolean>(false);
const selectedStatusActive = ref({
  value: 'all',
  label: 'Todos',
});
const filterMember = ref<string>('');
const selectedDataEdit = ref<MemberChurch | null>(null);
const dataExclude = ref<string | null>(null);
const dataPreRegistration = ref<PreRegistration | null>(null);
const columnsMember = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const clear = (): void => {
  selectedDataEdit.value = null;
  dataExclude.value = null;
  filterMember.value = '';
  dataPreRegistration.value = null;
  selectedStatusActive.value = {
    value: 'all',
    label: 'Todos',
  };
};
const fetchMembers = async () => {
  await getMembers();
};
const openFormMember = (): void => {
  showFormMember.value = true;
};
const closeFormMember = async () => {
  showFormMember.value = false;
  clear();
};
const openManagePreRegistration = (): void => {
  showManagePreRegistration.value = true;
};
const closeManagePreRegistrationWithoutData = async () => {
  showManagePreRegistration.value = false;
  selectedDataEdit.value = null;
  dataExclude.value = null;
  filterMember.value = '';
};
const closeManagePreRegistration = async () => {
  showManagePreRegistration.value = false;
  clear();
};
const openMemberMovementInfo = (member: MemberChurch): void => {
  selectedDataEdit.value = member;
  showMemberMovementInfo.value = true;
};
const closeMemberMovementInfo = async () => {
  showMemberMovementInfo.value = false;
  clear();
};
const openManageRole = (): void => {
  showManageRole.value = true;
};
const closeManageRole = async (): Promise<void> => {
  showManageRole.value = false;
  clear();
  await fetchMembers();
};
// const openManageRelationship = (): void => {
//   showManageRelationship.value = true;
// };
// const closeManageRelationship = (): void => {
//   showManageRelationship.value = false;
//   clear();
// };
const openMemberFamilyInfo = (member: MemberChurch): void => {
  selectedDataEdit.value = member;
  showMemberFamily.value = true;
};
const closeMemberFamilyInfo = (): void => {
  showMemberFamily.value = false;
  clear();
};
const handleEdit = (member: MemberChurch) => {
  selectedDataEdit.value = member;
  openFormMember();
};
const exclude = async (id: string) => {
  await deleteMember(id);
  clear();
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const closeConfirmActionOk = async (): Promise<void> => {
  showConfirmAction.value = false;
  await exclude(dataExclude.value ?? '');
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  dataExclude.value = null;
};
const openConfirmAction = (id: string): void => {
  dataExclude.value = id;
  showConfirmAction.value = true;
};
const setActive = async (active: number, userId: string) => {
  await updateActiveMember(active, userId);
};
const openFormMemberByPreRegistration = (data: PreRegistration): void => {
  dataPreRegistration.value = data;
  openFormMember();
};
const openPlansPage = async () => {
  await router.push({ name: 'admin-subscription' });
};
const downloadCertificate = async (memberID: string) => {
  await downloadCertificateBaptismo(memberID);
};

const listMemberCurrent = computed(() => {
  const status = selectedStatusActive.value.value;

  let filtered = listMember.value;

  if (status !== 'all') {
    filtered = listMember.value.filter((member) => {
      if (status === 'active') return member.active === 1;
      if (status === 'inactive') return member.active === 0;
      return true;
    });
  }

  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;

  return filtered.slice(start, end);
});
const maxPages = computed(() => {
  return Math.ceil(listMember.value.length / rowsPerPage.value);
});
const optionsActive = computed(() => [
  {
    value: 'all',
    label: 'Todos',
  },
  {
    value: 'active',
    label: 'Ativos',
  },
  {
    value: 'inactive',
    label: 'Inativos',
  },
]);
const getInitials = (name: string) => {
  if (!name) return '';

  const parts = name.split(' ');

  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
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
  await fetchMembers();
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
        <TitlePage title="Gerenciamento de membros" />
      </div>
      <div
        class="col-6 row items-center justify-end q-gutter-x-sm"
        :class="!$q.screen.lt.sm ? '' : 'q-mb-sm'"
      >
        <!-- <q-btn
          v-show="user?.enterprise_id === user?.view_enterprise_id"
          @click="openManageRelationship"
          icon-right="add"
          label="Família"
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
          flat
        /> -->
        <q-btn
          v-show="
            user?.enterprise_id === user?.view_enterprise_id &&
            subscripitonName !== 'free'
          "
          @click="openManagePreRegistration"
          icon-right="assignment_add"
          label="Formulário"
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
          flat
        />
        <q-btn
          v-show="
            user?.enterprise_id === user?.view_enterprise_id &&
            subscripitonName !== 'free'
          "
          @click="openManageRole"
          icon-right="add"
          label="Cargos"
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
          flat
        />
        <q-btn
          v-show="
            user?.enterprise_id === user?.view_enterprise_id &&
            subscripitonName !== 'free'
          "
          @click="openFormMember"
          icon-right="add"
          label="Membros"
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
        />
      </div>
    </header>
    <q-banner v-if="subscripitonName === 'free'" class="q-pa-sm" rounded dense>
      <div
        class="bg-red-1 text-red-10 row items-center justify-between q-pa-sm rounded-borders"
      >
        <div class="text-subtitle2">
          🚀 Para acessar a gestão completa de membros e recursos para igrejas,
          contrate o <b>Plano Básico</b> ou seja cliente do
          <b>Contabilidade para igrejas</b>.
        </div>

        <q-btn
          label="Ver planos"
          color="red"
          text-color="white"
          unelevated
          no-caps
          @click="openPlansPage"
        />
      </div>
    </q-banner>
    <q-scroll-area
      :class="!$q.screen.lt.sm ? 'main-scroll' : 'category-scroll'"
    >
      <main
        class="q-pa-sm q-mb-md"
        :style="!$q.screen.lt.sm ? '' : 'width: 98vw'"
      >
        <q-table
          grid
          :rows="loadingMember ? [] : listMemberCurrent"
          :columns="columnsMember"
          :loading="loadingMember"
          :filter="filterMember"
          row-key="index"
          no-data-label="Nenhum membro para mostrar"
          virtual-scroll
          :rows-per-page-options="[rowsPerPage]"
        >
        <template v-slot:top>
            <div
              :class="!$q.screen.lt.md ? 'row full-width' : 'column full-width'"
            >
              <span class="text-subtitle2">Lista de membros</span>
              <q-space />
              <div v-if="!$q.screen.lt.sm" class="row">
                <q-select
                  v-model="selectedStatusActive"
                  :options="optionsActive"
                  dense
                  options-dense
                  outlined
                  label="Status"
                  :style="!$q.screen.lt.sm ? 'width: 200px' : 'width: 49%'"
                  class="q-mr-sm"
                  bg-color="white"
                />
                <q-input
                  outlined
                  v-model="filterMember"
                  dense
                  label="Pesquisar"
                  :style="!$q.screen.lt.sm ? 'width: 200px' : 'width: 49%'"
                  bg-color="white"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <q-expansion-item
                v-else
                expand-separator
                icon="filter_alt"
                label="Filtros"
                class="border-form"
              >
                <q-input
                  filled
                  v-model="filterMember"
                  dense
                  label="Pesquisar"
                  class="full-width q-mt-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </q-expansion-item>
            </div>
          </template>
          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
              <q-card flat bordered class="q-py-sm">
                <q-item>
                  <q-item-section avatar>
                    <q-avatar size="50px" color="primary" text-color="white">
                      <img
                        v-if="props.row.image_url"
                        :src="props.row.image_url"
                      />
                      <span v-else>{{ getInitials(props.row.name) }}</span>
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-bold text-subtitle1">
                      {{ props.row.name }}
                    </q-item-label>
                    <q-item-label caption>
                      <q-badge
                        :color="props.row.active ? 'positive' : 'negative'"
                        rounded
                        class="q-mr-xs"
                      />
                      {{ props.row.active ? 'Ativo' : 'Inativo' }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <div class="row items-center">
                      <q-btn
                        @click="handleEdit(props.row)"
                        v-show="
                          user?.enterprise_id === user?.view_enterprise_id &&
                          subscripitonName !== 'free'
                        "
                        flat
                        round
                        size="sm"
                        icon="edit"
                        color="grey-7"
                      />

                      <q-btn flat round size="sm" icon="more_vert">
                        <q-menu auto-close cover>
                          <q-list style="min-width: 150px">
                            <q-item
                              clickable
                              @click="downloadCertificate(props.row.id)"
                              v-if="
                                user?.enterprise_id ===
                                  user?.view_enterprise_id &&
                                props.row.date_baptismo
                              "
                            >
                              <q-item-section avatar
                                ><q-icon name="download" color="secondary"
                              /></q-item-section>
                              <q-item-section>Certificado</q-item-section>
                            </q-item>

                            <q-item
                              clickable
                              @click="
                                setActive(
                                  props.row.active === 1 ? 0 : 1,
                                  props.row.id
                                )
                              "
                              v-if="user && subscripitonName !== 'free'"
                            >
                              <q-item-section avatar>
                                <q-icon
                                  :name="props.row.active ? 'block' : 'check'"
                                  :color="props.row.active ? 'red' : 'green'"
                                />
                              </q-item-section>
                              <q-item-section>{{
                                props.row.active ? 'Inativar' : 'Ativar'
                              }}</q-item-section>
                            </q-item>

                            <q-item
                              clickable
                              @click="openMemberFamilyInfo(props.row)"
                              v-if="props.row.family?.length > 0"
                            >
                              <q-item-section avatar
                                ><q-icon name="group" color="secondary"
                              /></q-item-section>
                              <q-item-section>Família</q-item-section>
                            </q-item>

                            <q-item
                              clickable
                              @click="openMemberMovementInfo(props.row)"
                            >
                              <q-item-section avatar
                                ><q-icon name="attach_money" color="primary"
                              /></q-item-section>
                              <q-item-section>Contribuições</q-item-section>
                            </q-item>

                            <q-separator />

                            <q-item
                              clickable
                              @click="openConfirmAction(props.row.id)"
                              v-if="user?.position === 'admin'"
                            >
                              <q-item-section avatar
                                ><q-icon name="delete" color="negative"
                              /></q-item-section>
                              <q-item-section>Excluir</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </div>
                  </q-item-section>
                </q-item>
              </q-card>
            </div>
          </template>
        </q-table>
        <FormMember
          :open="showFormMember"
          :data-edit="selectedDataEdit"
          :data-pre-registration="dataPreRegistration"
          @update:open="closeFormMember"
        />
        <MemberMovementInfo
          :open="showMemberMovementInfo"
          :member-selected="selectedDataEdit"
          @update:open="closeMemberMovementInfo"
        />
        <MemberFamilyInfo
          :open="showMemberFamily"
          v-model="selectedDataEdit"
          @update:open="closeMemberFamilyInfo"
        />
        <ManageRole :open="showManageRole" @update:open="closeManageRole" />
        <ManagePreRegistration
          :open="showManagePreRegistration"
          @update:open="closeManagePreRegistration"
          @update:open-by-registration="closeManagePreRegistrationWithoutData"
          @showFormMemberByRegistration="openFormMemberByPreRegistration"
        />
        <!-- <ManageRelationship
          :open="showManageRelationship"
          @update:open="closeManageRelationship"
        /> -->
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
        <ConfirmAction
          :open="showConfirmAction"
          label-action="Continuar"
          title="Confirmação de exclusão"
          message="Este processo é irreversível. Caso tenha certeza, clique em 'Continuar' para prosseguir."
          @update:open="closeConfirmAction"
          @update:ok="closeConfirmActionOk"
        />
      </main>
    </q-scroll-area>
  </section>
</template>

<style scoped lang="scss">
.category-scroll {
  height: calc(100vh - 180px);
}
</style>
