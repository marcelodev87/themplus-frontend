<script setup lang="ts">
import FormPerfil from 'src/components/forms/FormPerfil.vue';
import FormEnterprise from 'src/components/forms/FormEnterprise.vue';
import Navbar from 'src/components/headers/Navbar.vue';
import EmailInfo from 'src/components/info/EmailInfo.vue';
import FormViewEnterprise from 'src/components/forms/FormViewEnterprise.vue';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';

defineOptions({
  name: 'MainLayout',
});

const { user, enterpriseCreated, enterprisePosition } =
  storeToRefs(useAuthStore());

const $q = useQuasar();
const route = useRoute();
const leftDrawerOpen = ref<boolean>(false);
const showFormPerfil = ref<boolean>(false);
const showFormEnterprise = ref<boolean>(false);
const showEmailInfo = ref<boolean>(false);
const showFormViewEnterprise = ref<boolean>(false);

const menuList = ref<
  {
    icon: string;
    label: string;
    separator: boolean;
    name: string;
  }[]
>([]);

const isActive = (routeName: string) => {
  return (
    route.name === routeName ||
    (route.name === 'admin-bond-with-id' && routeName === 'admin-bond')
  );
};
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
const openViewEnterprise = (): void => {
  showFormViewEnterprise.value = true;
};
const closeViewEnterprise = (): void => {
  showFormViewEnterprise.value = false;
};
const closeFormEnterprise = (): void => {
  showFormEnterprise.value = false;
};
const mountRoute = () => {
  menuList.value = [];
  menuList.value.push({
    icon: 'rss_feed',
    label: 'Feed',
    separator: true,
    name: 'admin-feed',
  });

  // {
  //   icon: 'warning',
  //   label: 'Alertas',
  //   separator: true,
  //   name: 'admin-alert',
  // },

  if (enterprisePosition.value === 'client') {
    menuList.value.push({
      icon: 'space_dashboard',
      label: 'Dashboard',
      separator: true,
      name: 'admin-dashboard',
    });
    menuList.value.push({
      icon: 'attach_money',
      label: 'Movimentações',
      separator: true,
      name: 'admin-movement',
    });
    menuList.value.push({
      icon: 'calendar_month',
      label: 'Agendamentos',
      separator: true,
      name: 'admin-scheduling',
    });
    menuList.value.push({
      icon: 'savings',
      label: 'Contabilidade',
      separator: true,
      name: 'admin-financial-control',
    });
    menuList.value.push({
      icon: 'category',
      label: 'Categorias',
      separator: true,
      name: 'admin-category',
    });
    menuList.value.push({
      icon: 'account_balance',
      label: 'Contas',
      separator: true,
      name: 'admin-account',
    });
    menuList.value.push({
      icon: 'content_paste_search',
      label: 'Registros',
      separator: true,
      name: 'admin-records',
    });
  }
  if (enterprisePosition.value === 'counter') {
    menuList.value.push({
      icon: 'person_search',
      label: 'Solicitações',
      separator: true,
      name: 'admin-order',
    });
    menuList.value.push({
      icon: 'how_to_reg',
      label: 'Vínculos',
      separator: true,
      name: 'admin-bond',
    });
    menuList.value.push({
      icon: 'work',
      label: 'Organização',
      separator: true,
      name: 'admin-enterprise',
    });
  }
  if (user.value?.position === 'admin') {
    menuList.value.push({
      icon: 'group_work',
      label: 'Departamentos',
      separator: true,
      name: 'admin-departments',
    });
    menuList.value.push({
      icon: 'person',
      label: 'Usuários',
      separator: true,
      name: 'admin-users',
    });
  }
  if (
    enterpriseCreated.value === null &&
    enterprisePosition.value === 'client' &&
    user.value?.enterprise_id === user.value?.view_enterprise_id
  ) {
    menuList.value.push({
      icon: 'holiday_village',
      label: 'Filiais',
      separator: true,
      name: 'admin-office',
    });
  }
  menuList.value.push({
    icon: 'help',
    label: 'Ajuda',
    separator: true,
    name: 'admin-help',
  });
};
const changeShowMenuList = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const closeDrawer = (): void => {
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false;
  }
};

watch(user, () => {
  mountRoute();
});

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
        @update:open-view-enterprise="openViewEnterprise"
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
            active-class=" active-option-menu text-bold"
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
      <FormViewEnterprise
        :open="showFormViewEnterprise"
        @update:open="closeViewEnterprise"
      />
      <FormEnterprise
        :open="showFormEnterprise"
        mode="actual"
        @update:open="closeFormEnterprise"
      />
    </q-page-container>
  </q-layout>
</template>
