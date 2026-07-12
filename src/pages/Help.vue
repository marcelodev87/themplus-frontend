<script setup lang="ts">
import { ref, computed, markRaw } from 'vue';
import { useQuasar } from 'quasar';
import TitlePage from 'src/components/shared/TitlePage.vue';
import IntroDocument from 'src/components/document/IntroDocument.vue';
import StartDocument from 'src/components/document/StartDocument.vue';
import DashboardDocument from 'src/components/document/DashboardDocument.vue';
import CategoryDocument from 'src/components/document/CategoryDocument.vue';
import AccountDocument from 'src/components/document/AccountDocument.vue';
import DepartmenDocument from 'src/components/document/DepartmenDocument.vue';
import UsersDocument from 'src/components/document/UsersDocument.vue';
import OfficeDocument from 'src/components/document/OfficeDocument.vue';
import FinancialDocument from 'src/components/document/FinancialDocument.vue';
import MovementDocument from 'src/components/document/MovementDocument.vue';
import SchedulingDocument from 'src/components/document/SchedulingDocument.vue';
import ViewUserDocument from 'src/components/document/ViewUserDocument.vue';
import ViewCounterDocument from 'src/components/document/ViewCounterDocument.vue';
import OrderDocument from 'src/components/document/OrderDocument.vue';
import BondDocument from 'src/components/document/BondDocument.vue';
import EnterpriseByCounterDocument from 'src/components/document/EnterpriseByCounterDocument.vue';
import RegisterDocument from 'src/components/document/RegisterDocument.vue';

defineOptions({ name: 'Help' });

const $q = useQuasar();
const splitterModel = ref<number>(270);
const optionSelected = ref<string>('Introdução');
const mobileMenuOpen = ref(false);
const searchQuery = ref('');

const menuStructure = [
  {
    label: 'Introdução',
    icon: 'auto_stories',
    component: markRaw(IntroDocument),
  },
  {
    label: 'Começando',
    icon: 'rocket_launch',
    component: markRaw(StartDocument),
  },
  {
    label: 'Visão usuário',
    icon: 'visibility',
    component: markRaw(ViewUserDocument),
  },
  {
    label: 'Visão contador',
    icon: 'analytics',
    component: markRaw(ViewCounterDocument),
  },
  {
    label: 'Atividades',
    icon: 'assignment',
    component: markRaw(RegisterDocument),
  },
  {
    label: 'Departamentos',
    icon: 'lan',
    component: markRaw(DepartmenDocument),
  },
  { label: 'Usuários', icon: 'people', component: markRaw(UsersDocument) },
  {
    category: 'Funcionalidades Cliente',
    icon: 'person',
    items: [
      {
        label: 'Dashboard',
        icon: 'dashboard',
        component: markRaw(DashboardDocument),
      },
      {
        label: 'Movimentações',
        icon: 'swap_vert',
        component: markRaw(MovementDocument),
      },
      {
        label: 'Agendamentos',
        icon: 'calendar_month',
        component: markRaw(SchedulingDocument),
      },
      {
        label: 'Contabilidade',
        icon: 'account_balance',
        component: markRaw(FinancialDocument),
      },
      {
        label: 'Categorias',
        icon: 'label',
        component: markRaw(CategoryDocument),
      },
      {
        label: 'Contas',
        icon: 'account_balance_wallet',
        component: markRaw(AccountDocument),
      },
      {
        label: 'Filiais',
        icon: 'business',
        component: markRaw(OfficeDocument),
      },
    ],
  },
  {
    category: 'Funcionalidades Contador',
    icon: 'calculate',
    items: [
      {
        label: 'Solicitações',
        icon: 'request_page',
        component: markRaw(OrderDocument),
      },
      { label: 'Vínculos', icon: 'link', component: markRaw(BondDocument) },
      {
        label: 'Organização',
        icon: 'add_business',
        component: markRaw(EnterpriseByCounterDocument),
      },
    ],
  },
];

const filteredMenuStructure = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return menuStructure;
  return menuStructure.reduce(
    (acc: typeof menuStructure, item) => {
      if ('items' in item && item.items) {
        const filtered = item.items.filter((s) =>
          s.label.toLowerCase().includes(q)
        );
        if (filtered.length) acc.push({ ...item, items: filtered });
      } else if (item.label?.toLowerCase().includes(q)) {
        acc.push(item);
      }
      return acc;
    },
    [] as typeof menuStructure
  );
});

const currentComponent = computed(() => {
  const selected = optionSelected.value;

  const subItem = menuStructure
    .filter((item) => 'items' in item && item.items)
    .flatMap((item) => item.items!)
    .find((s) => s.label === selected);

  if (subItem) return subItem.component;

  const rootItem = menuStructure.find(
    (item) => !('items' in item) && item.label === selected
  );

  return rootItem?.component ?? markRaw(IntroDocument);
});

const selectOption = (option: string): void => {
  optionSelected.value = option;
  mobileMenuOpen.value = false;
};
</script>

<template>
  <section class="help-page">
    <TitlePage title="Painel de Ajuda" />

    <q-splitter
      v-if="!$q.screen.lt.md"
      v-model="splitterModel"
      style="height: calc(100vh - 110px)"
      class="help-splitter"
      unit="px"
    >
      <template v-slot:before>
        <div class="help-sidebar-inner">
          <div class="sidebar-search q-pa-sm">
            <q-input
              v-model="searchQuery"
              dense
              outlined
              placeholder="Buscar..."
              clearable
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="search" size="18px" color="grey-6" />
              </template>
            </q-input>
          </div>

          <q-scroll-area style="height: calc(100% - 58px)">
            <q-list padding>
              <template
                v-for="(node, index) in filteredMenuStructure"
                :key="index"
              >
                <q-item
                  v-if="'label' in node"
                  clickable
                  v-ripple
                  :active="optionSelected === node.label"
                  @click="selectOption(node.label ?? '')"
                  active-class="active-menu text-primary"
                  class="menu-item"
                >
                  <q-item-section avatar>
                    <q-icon :name="node.icon" size="20px" />
                  </q-item-section>
                  <q-item-section class="text-weight-medium text-body2">
                    {{ node.label }}
                  </q-item-section>
                </q-item>

                <q-expansion-item
                  v-else
                  :icon="node.icon"
                  :label="node.category"
                  header-class="text-weight-bold text-grey-8 text-body2"
                  default-opened
                  expand-icon-class="text-grey-5"
                >
                  <q-item
                    v-for="sub in node.items"
                    :key="sub.label"
                    clickable
                    v-ripple
                    dense
                    class="q-pl-xl sub-menu-item"
                    :active="optionSelected === sub.label"
                    @click="selectOption(sub.label)"
                    active-class="active-sub-menu text-primary"
                  >
                    <q-item-section avatar>
                      <q-icon :name="sub.icon" size="16px" />
                    </q-item-section>
                    <q-item-section class="text-body2">{{
                      sub.label
                    }}</q-item-section>
                  </q-item>
                </q-expansion-item>
              </template>

              <div
                v-if="filteredMenuStructure.length === 0"
                class="text-center text-grey-5 text-body2 q-pa-md"
              >
                Nenhum resultado encontrado
              </div>
            </q-list>
          </q-scroll-area>
        </div>
      </template>

      <template v-slot:after>
        <q-scroll-area class="fit bg-white">
          <div class="content-container q-pa-xl">
            <transition name="fade-page" mode="out-in">
              <div :key="optionSelected">
                <component :is="currentComponent" />
              </div>
            </transition>
          </div>
        </q-scroll-area>
      </template>
    </q-splitter>

    <template v-else>
      <div class="mobile-topbar row items-center q-px-sm q-py-xs">
        <q-btn
          flat
          dense
          round
          icon="menu_book"
          color="primary"
          @click="mobileMenuOpen = true"
        />
        <q-separator vertical class="q-mx-sm" />
        <span class="text-body2 text-weight-medium ellipsis">{{
          optionSelected
        }}</span>
      </div>

      <q-scroll-area style="height: calc(100vh - 160px)">
        <div class="q-pa-md q-pb-xl">
          <transition name="fade-page" mode="out-in">
            <div :key="optionSelected">
              <component :is="currentComponent" />
            </div>
          </transition>
        </div>
      </q-scroll-area>

      <q-btn
        class="mobile-fab"
        fab
        icon="menu_book"
        color="primary"
        @click="mobileMenuOpen = true"
      />
    </template>

    <q-dialog v-model="mobileMenuOpen" position="left" :maximized="false">
      <q-card class="mobile-menu-card">
        <q-toolbar class="bg-grey-1 sidebar-toolbar">
          <q-icon name="menu_book" color="primary" size="22px" />
          <q-toolbar-title class="text-body1 text-weight-bold q-ml-sm">
            Ajuda
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <div class="q-pa-sm">
          <q-input
            v-model="searchQuery"
            dense
            outlined
            placeholder="Buscar..."
            clearable
            bg-color="white"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="18px" color="grey-6" />
            </template>
          </q-input>
        </div>

        <q-scroll-area style="height: calc(100vh - 110px)">
          <q-list padding>
            <template
              v-for="(node, index) in filteredMenuStructure"
              :key="index"
            >
              <q-item
                v-if="'label' in node"
                clickable
                v-ripple
                :active="optionSelected === node.label"
                @click="selectOption(node.label ?? '')"
                active-class="active-menu text-primary"
                class="menu-item"
              >
                <q-item-section avatar>
                  <q-icon :name="node.icon" size="20px" />
                </q-item-section>
                <q-item-section class="text-weight-medium text-body2">
                  {{ node.label }}
                </q-item-section>
              </q-item>

              <q-expansion-item
                v-else
                :icon="node.icon"
                :label="node.category"
                header-class="text-weight-bold text-grey-8 text-body2"
                default-opened
                expand-icon-class="text-grey-5"
              >
                <q-item
                  v-for="sub in node.items"
                  :key="sub.label"
                  clickable
                  v-ripple
                  dense
                  class="q-pl-xl sub-menu-item"
                  :active="optionSelected === sub.label"
                  @click="selectOption(sub.label)"
                  active-class="active-sub-menu text-primary"
                >
                  <q-item-section avatar>
                    <q-icon :name="sub.icon" size="16px" />
                  </q-item-section>
                  <q-item-section class="text-body2">{{
                    sub.label
                  }}</q-item-section>
                </q-item>
              </q-expansion-item>
            </template>

            <div
              v-if="filteredMenuStructure.length === 0"
              class="text-center text-grey-5 text-body2 q-pa-md"
            >
              Nenhum resultado encontrado
            </div>
          </q-list>
        </q-scroll-area>
      </q-card>
    </q-dialog>
  </section>
</template>

<style scoped>
.help-page {
  padding: 12px;
  background-color: #f4f6f9;
}

.help-splitter {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.help-sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8fafc;
  border-right: 1px solid #e8edf2;
}

.sidebar-search {
  border-bottom: 1px solid #e8edf2;
}

.sidebar-toolbar {
  border-bottom: 1px solid #e8edf2;
  min-height: 48px;
}

.menu-item {
  border-radius: 6px;
  margin: 1px 4px;
}

.sub-menu-item {
  border-radius: 6px;
  margin: 1px 4px;
}

.active-menu {
  background: #e3f2fd;
  border-right: 3px solid var(--q-primary);
  font-weight: 600;
}

.active-sub-menu {
  background: #e8f4fd;
  font-weight: 700;
}

.content-container {
  max-width: 900px;
  margin: 0 auto;
}

.mobile-topbar {
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.mobile-fab {
  position: fixed;
  bottom: 24px;
  right: 20px;
  z-index: 100;
}

.mobile-menu-card {
  width: 285px;
  height: 100vh;
  max-height: 100vh;
  border-radius: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.fade-page-enter-active,
.fade-page-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.fade-page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
