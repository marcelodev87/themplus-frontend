<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { ref } from 'vue';
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
            @click="selectOption('Introdução')"
            :active="isActive('Introdução')"
            active-class="text-bold"
            clickable
          >
            <q-item-section>
              <div class="column">
                <span> Introdução </span>
              </div>
            </q-item-section>
          </q-item>
          <q-item
            @click="selectOption('Começando')"
            :active="isActive('Começando')"
            active-class="text-bold"
            clickable
          >
            <q-item-section>
              <div class="column">
                <span> Começando </span>
              </div>
            </q-item-section>
          </q-item>
          <q-item
            @click="selectOption('Visão usuário')"
            :active="isActive('Visão usuário')"
            active-class="text-bold"
            clickable
          >
            <q-item-section>
              <div class="column">
                <span> Visão usuário </span>
              </div>
            </q-item-section>
          </q-item>
          <q-item
            @click="selectOption('Visão contador')"
            :active="isActive('Visão contador')"
            active-class="text-bold"
            clickable
          >
            <q-item-section>
              <div class="column">
                <span> Visão contador </span>
              </div>
            </q-item-section>
          </q-item>
          <q-item
            @click="selectOption('Atividades')"
            :active="isActive('Atividades')"
            active-class="text-bold"
            clickable
          >
            <q-item-section>
              <div class="column">
                <span> Atividades </span>
              </div>
            </q-item-section>
          </q-item>
          <q-item
            @click="selectOption('Departamentos')"
            :active="isActive('Departamentos')"
            active-class="text-bold"
            clickable
          >
            <q-item-section>
              <div class="column">
                <span> Departamentos </span>
              </div>
            </q-item-section>
          </q-item>
          <q-item
            @click="selectOption('Usuários')"
            :active="isActive('Usuários')"
            active-class="text-bold"
            clickable
          >
            <q-item-section>
              <div class="column">
                <span> Usuários </span>
              </div>
            </q-item-section>
          </q-item>

          <q-expansion-item
            expand-separator
            label="Funcionalidades para cliente"
            dense-toggle
          >
            <q-item
              @click="selectOption('Dashboard')"
              :active="isActive('Dashboard')"
              active-class="text-bold"
              clickable
            >
              <q-item-section>
                <div class="column">
                  <span> Dashboard </span>
                </div>
              </q-item-section>
            </q-item>
            <q-item
              @click="selectOption('Movimentações')"
              :active="isActive('Movimentações')"
              active-class="text-bold"
              clickable
            >
              <q-item-section>
                <div class="column">
                  <span> Movimentações </span>
                </div>
              </q-item-section>
            </q-item>
            <q-item
              @click="selectOption('Agendamentos')"
              :active="isActive('Agendamentos')"
              active-class="text-bold"
              clickable
            >
              <q-item-section>
                <div class="column">
                  <span> Agendamentos </span>
                </div>
              </q-item-section>
            </q-item>
            <q-item
              @click="selectOption('Contabilidade')"
              :active="isActive('Contabilidade')"
              active-class="text-bold"
              clickable
            >
              <q-item-section>
                <div class="column">
                  <span> Contabilidade </span>
                </div>
              </q-item-section>
            </q-item>
            <q-item
              @click="selectOption('Categorias')"
              :active="isActive('Categorias')"
              active-class="text-bold"
              clickable
            >
              <q-item-section>
                <div class="column">
                  <span> Categorias </span>
                </div>
              </q-item-section>
            </q-item>
            <q-item
              @click="selectOption('Contas')"
              :active="isActive('Contas')"
              active-class="text-bold"
              clickable
            >
              <q-item-section>
                <div class="column">
                  <span> Contas </span>
                </div>
              </q-item-section>
            </q-item>
            <q-item
              @click="selectOption('Filiais')"
              :active="isActive('Filiais')"
              active-class="text-bold"
              clickable
            >
              <q-item-section>
                <div class="column">
                  <span> Filiais </span>
                </div>
              </q-item-section>
            </q-item>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            label="Funcionalidades para contador"
            dense-toggle
          >
            <q-item
              @click="selectOption('Solicitações')"
              :active="isActive('Solicitações')"
              active-class="text-bold"
              clickable
            >
              <q-item-section>
                <div class="column">
                  <span> Solicitações </span>
                </div>
              </q-item-section>
            </q-item>
            <q-item
              @click="selectOption('Vínculos')"
              :active="isActive('Vínculos')"
              active-class="text-bold"
              clickable
            >
              <q-item-section>
                <div class="column">
                  <span> Vínculos </span>
                </div>
              </q-item-section>
            </q-item>
            <q-item
              @click="selectOption('Organização')"
              :active="isActive('Organização')"
              active-class="text-bold"
              clickable
            >
              <q-item-section>
                <div class="column">
                  <span> Organização </span>
                </div>
              </q-item-section>
            </q-item>
          </q-expansion-item>
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
