<script setup lang="ts">
import FormPerfil from 'src/components/forms/FormPerfil.vue';
import FormEnterprise from 'src/components/forms/FormEnterprise.vue';
import Navbar from 'src/components/headers/Navbar.vue';
import EmailInfo from 'src/components/info/EmailInfo.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';

defineOptions({
  name: 'MainLayout',
});

const { user } = storeToRefs(useAuthStore());

const $q = useQuasar();
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
  // {
  //   icon: 'warning',
  //   label: 'Alertas',
  //   separator: true,
  //   name: 'admin-alert',
  // },
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
const mountRoute = () => {
  if (user.value?.position === 'admin') {
    menuList.value.splice(6, 0, {
      icon: 'person',
      label: 'Usuários',
      separator: true,
      name: 'admin-users',
    });
    menuList.value.splice(6, 0, {
      icon: 'group_work',
      label: 'Departamentos',
      separator: true,
      name: 'admin-departments',
    });
  }
};
const changeShowMenuList = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const closeDrawer = (): void => {
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false;
  }
};

onMounted(() => {
  mountRoute();
});
</script>
<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-grey-2">
      <Navbar
        @update:open-form-perfil="openFormPerfil"
        @update:open-form-enterprise="openFormEnterprise"
        @update:open-email-info="openEmailInfo"
        @update:change-open-menu="changeShowMenuList"
      />
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :show-if-above="!$q.screen.lt.md"
      :width="200"
      :breakpoint="700"
      side="left"
      behavior="desktop"
      bordered
      class="text-black"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item
            v-for="(menuItem, index) in menuList"
            :key="index"
            clickable
            :to="{ name: menuItem.name }"
            :active="isActive(menuItem.name)"
            active-class=" text-red text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
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
