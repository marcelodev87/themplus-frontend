<script setup lang="ts">
import { ref, computed, markRaw } from 'vue';
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

const splitterModel = ref<number>(280);
const optionSelected = ref<string>('Introdução');
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
      { label: 'Dashboard', component: markRaw(DashboardDocument) },
      { label: 'Movimentações', component: markRaw(MovementDocument) },
      { label: 'Agendamentos', component: markRaw(SchedulingDocument) },
      { label: 'Contabilidade', component: markRaw(FinancialDocument) },
      { label: 'Categorias', component: markRaw(CategoryDocument) },
      { label: 'Contas', component: markRaw(AccountDocument) },
      { label: 'Filiais', component: markRaw(OfficeDocument) },
    ],
  },
  {
    category: 'Funcionalidades Contador',
    icon: 'calculate',
    items: [
      { label: 'Solicitações', component: markRaw(OrderDocument) },
      { label: 'Vínculos', component: markRaw(BondDocument) },
      { label: 'Organização', component: markRaw(EnterpriseByCounterDocument) },
    ],
  },
];

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
};
</script>

<template>
  <section class="help-page">
    <TitlePage title="Painel de Ajuda" />

    <q-splitter
      v-model="splitterModel"
      style="height: calc(100vh - 110px)"
      class="help-splitter"
      unit="px"
    >
      <template v-slot:before>
        <q-scroll-area class="fit bg-grey-1">
          <q-list padding>
            <template v-for="(node, index) in menuStructure" :key="index">
              <q-item
                v-if="'label' in node"
                clickable
                v-ripple
                :active="optionSelected === node.label"
                @click="selectOption(node.label ?? '')"
                active-class="active-menu text-primary"
              >
                <q-item-section avatar>
                  <q-icon :name="node.icon" size="22px" />
                </q-item-section>
                <q-item-section class="text-weight-medium">
                  {{ node.label }}
                </q-item-section>
              </q-item>

              <q-expansion-item
                v-else
                :icon="node.icon"
                :label="node.category"
                header-class="text-weight-bold text-grey-9"
                default-opened
              >
                <q-item
                  v-for="sub in node.items"
                  :key="sub.label"
                  clickable
                  v-ripple
                  dense
                  class="q-pl-xl"
                  :active="optionSelected === sub.label"
                  @click="selectOption(sub.label)"
                  active-class="active-sub-menu text-primary"
                >
                  <q-item-section>{{ sub.label }}</q-item-section>
                </q-item>
              </q-expansion-item>
            </template>
          </q-list>
        </q-scroll-area>
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
  </section>
</template>

<style scoped>
.help-page {
  padding: 12px;
  background-color: #f8f9fa;
}

.help-splitter {
  background: white;
}

.active-menu {
  background: #e3f2fd;
  border-right: 4px solid var(--q-primary);
  font-weight: 600;
}

.active-sub-menu {
  font-weight: 800;
  background: #f1f8ff;
}

.content-container {
  max-width: 900px;
  margin: 0 auto;
}

.fade-page-enter-active,
.fade-page-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
