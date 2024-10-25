<script setup lang="ts">
import FormPerfil from 'src/components/forms/FormPerfil.vue';
import Navbar from 'src/components/headers/Navbar.vue';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

defineOptions({
  name: 'MainLayout',
});

const route = useRoute();
const leftDrawerOpen = ref<boolean>(false);
const showFormPerfil = ref<boolean>(false);

const menuList = computed(() => [
  {
    icon: 'rss_feed',
    label: 'Feed',
    separator: true,
    name: 'admin-feed',
  },
  {
    icon: 'space_dashboard',
    label: 'Dashboard',
    separator: true,
    name: 'admin-dashboard',
  },
  {
    icon: 'attach_money',
    label: 'Movimentações',
    separator: true,
    name: 'admin-movement',
  },
  {
    icon: 'calendar_month',
    label: 'Agendamentos',
    separator: true,
    name: 'admin-scheduling',
  },
  {
    icon: 'account_balance',
    label: 'Contas',
    separator: true,
    name: 'admin-account',
  },
  {
    icon: 'inventory',
    label: 'Relatórios',
    separator: true,
    name: 'admin-reports',
  },
  {
    icon: 'person',
    label: 'Usuários',
    separator: true,
    name: 'admin-users',
  },
  {
    icon: 'group_work',
    label: 'Departamentos',
    separator: true,
    name: 'admin-departments',
  },
  {
    icon: 'savings',
    label: 'Contabilidade',
    separator: true,
    name: 'admin-financial-control',
  },
  {
    icon: 'help',
    label: 'Ajuda',
    separator: true,
    name: 'admin-help',
  },
]);

const isActive = (routeName: string) => route.name === routeName;
const openFormPerfil = ():void => {
  showFormPerfil.value = true;
};
const closeFormPerfil = ():void => {
  showFormPerfil.value = false;
};
</script>
<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-grey-2">
      <Navbar @update:open-form-perfil="openFormPerfil"/>
    </q-header>

    <q-drawer
    show-if-above
      v-model="leftDrawerOpen"
      side="left"
      behavior="desktop"
      bordered
      class="text-black"
      :width="200"
    >
      <q-list>
          <q-item
           v-for="(menuItem, index) in menuList"
           :key="index"
            clickable
            v-ripple
            :to="{ name: menuItem.name }"
            :active="isActive(menuItem.name)"
            active-class="bg-red-10 text-white"
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <FormPerfil
        :open="showFormPerfil"
        @update:open="closeFormPerfil"
      />
    </q-page-container>
  </q-layout>
</template>
