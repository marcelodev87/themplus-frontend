<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { reactive, ref } from 'vue';
import IntroDocument from 'src/components/document/IntroDocument.vue';
import StartDocument from 'src/components/document/StartDocument.vue';
import DashboardDocument from 'src/components/document/DashboardDocument.vue';
import CategoryDocument from 'src/components/document/CategoryDocument.vue';
import AccountDocument from 'src/components/document/AccountDocument.vue';
import DepartmenDocument from 'src/components/document/DepartmenDocument.vue';

defineOptions({
  name: 'Help',
});

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
  'Contabilidade',
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
      :limits="[200, 200]"
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
        <div class="q-pa-sm">
          <IntroDocument v-if="optionSelected === 'Introdução'" />
          <StartDocument v-else-if="optionSelected === 'Começando'" />
          <DashboardDocument v-else-if="optionSelected === 'Dashboard'" />
          <CategoryDocument v-else-if="optionSelected === 'Categorias'" />
          <AccountDocument v-else-if="optionSelected === 'Contas'" />
          <DepartmenDocument v-else-if="optionSelected === 'Departamentos'" />
        </div>
      </template>
    </q-splitter>
  </section>
</template>
