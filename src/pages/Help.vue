<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { reactive, ref } from 'vue';
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

defineOptions({
  name: 'Help',
});

const openOptions = ref<boolean>(true);
const splitterModel = ref<number>(300);
const optionSelected = ref<string>('Introdução');
const optionsHelp = reactive<string[]>([
  'Introdução',
  'Começando',
  'Visão usuário',
  'Visão contador',
  'Dashboard',
  'Movimentações',
  'Agendamentos',
  'Solicitações',
  'Vínculos',
  'Organização',
  'Contabilidade',
  'Atividades',
  'Categorias',
  'Contas',
  'Departamentos',
  'Filiais',
  'Usuários',
]);

const isActive = (option: string): boolean => {
  return optionSelected.value === option;
};
const selectOption = (option: string): void => {
  optionSelected.value = option;
};
</script>
<template>
  <section>
    <TitlePage title="Painel de ajuda" />
    <q-splitter
      v-model="splitterModel"
      style="height: 85vh"
      unit="px"
      :limits="openOptions ? [200, 200] : [0, 0]"
    >
      <template v-slot:before>
        <q-list class="column justify-around">
          <q-item
            v-for="(item, index) in optionsHelp"
            @click="selectOption(item)"
            :key="index"
            :active="isActive(item)"
            active-class="text-bold"
            clickable
          >
            <q-item-section>
              <div class="column">
                <span class="">
                  {{ item }}
                </span>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </template>

      <template v-slot:after>
        <div class="q-pa-sm" @click="openOptions = !openOptions">
          <IntroDocument v-if="optionSelected === 'Introdução'" />
          <StartDocument v-else-if="optionSelected === 'Começando'" />
          <ViewUserDocument v-else-if="optionSelected === 'Visão usuário'" />
          <ViewCounterDocument
            v-else-if="optionSelected === 'Visão contador'"
          />
          <DashboardDocument v-else-if="optionSelected === 'Dashboard'" />
          <MovementDocument v-else-if="optionSelected === 'Movimentações'" />
          <SchedulingDocument v-else-if="optionSelected === 'Agendamentos'" />
          <OrderDocument v-else-if="optionSelected === 'Solicitações'" />
          <BondDocument v-else-if="optionSelected === 'Vínculos'" />
          <EnterpriseByCounterDocument
            v-else-if="optionSelected === 'Organização'"
          />
          <FinancialDocument v-else-if="optionSelected === 'Contabilidade'" />
          <RegisterDocument v-else-if="optionSelected === 'Atividades'" />
          <CategoryDocument v-else-if="optionSelected === 'Categorias'" />
          <AccountDocument v-else-if="optionSelected === 'Contas'" />
          <DepartmenDocument v-else-if="optionSelected === 'Departamentos'" />
          <OfficeDocument v-else-if="optionSelected === 'Filiais'" />
          <UsersDocument v-else-if="optionSelected === 'Usuários'" />
        </div>
      </template>
    </q-splitter>
  </section>
</template>
