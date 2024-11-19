<script setup lang="ts">
import FormPerfil from 'src/components/forms/FormPerfil.vue';
import FormEnterprise from 'src/components/forms/FormEnterprise.vue';
import Navbar from 'src/components/headers/Navbar.vue';
import EmailInfo from 'src/components/info/EmailInfo.vue';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

defineOptions({
  name: 'MainLayout',
});

const route = useRoute();
const leftDrawerOpen = ref<boolean>(false);
const showFormPerfil = ref<boolean>(false);
const showFormEnterprise = ref<boolean>(false);
const showEmailInfo = ref<boolean>(false);

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
    icon: 'category',
    label: 'Categorias',
    separator: true,
    name: 'admin-category',
  },
  {
    icon: 'account_balance',
    label: 'Contas',
    separator: true,
    name: 'admin-account',
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
    icon: 'warning',
    label: 'Alertas',
    separator: true,
    name: 'admin-alert',
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
const openFormPerfil = (): void => {
  showFormPerfil.value = true;
};
const openEmailInfo = (): void => {
  showEmailInfo.value = true;
};
const closeEmailInfo = (): void => {
  showEmailInfo.value = false;
};
const closeFormPerfil = (): void => {
  showFormPerfil.value = false;
};
const openFormEnterprise = (): void => {
  showFormEnterprise.value = true;
};
const closeFormEnterprise = (): void => {
  showFormEnterprise.value = false;
};
</script>
<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-grey-2">
      <Navbar
        @update:open-form-perfil="openFormPerfil"
        @update:open-form-enterprise="openFormEnterprise"
        @update:open-email-info="openEmailInfo"
      />
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
          :to="{ name: menuItem.name }"
          :active="isActive(menuItem.name)"
          active-class=" text-red text-bold"
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
      <FormPerfil :open="showFormPerfil" @update:open="closeFormPerfil" />
      <EmailInfo :open="showEmailInfo" @update:open="closeEmailInfo" />
      <FormEnterprise
        :open="showFormEnterprise"
        @update:open="closeFormEnterprise"
      />
    </q-page-container>
  </q-layout>
</template>
