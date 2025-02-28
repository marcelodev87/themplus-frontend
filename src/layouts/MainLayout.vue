<script setup lang="ts">
import FormPerfil from 'src/components/forms/FormPerfil.vue';
import FormEnterprise from 'src/components/forms/FormEnterprise.vue';
import Navbar from 'src/components/headers/Navbar.vue';
import EmailInfo from 'src/components/info/EmailInfo.vue';
import FormViewEnterprise from 'src/components/forms/FormViewEnterprise.vue';
import { ref, watch } from 'vue';
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
const changeShowMenuList = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const closeDrawer = (): void => {
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false;
  }
};
watch(
  () => route.name,
  (name) => {
    if (name === 'admin-help') {
      leftDrawerOpen.value = false;
    }
  },
  { immediate: true }
);
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
      :width="220"
      :breakpoint="700"
      side="left"
      behavior="desktop"
      bordered
      class="text-black"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item
            clickable
            :to="{ name: 'admin-feed' }"
            :active="isActive('admin-feed')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="rss_feed" />
            </q-item-section>
            <q-item-section> Feed </q-item-section>
          </q-item>
          <q-item
            v-show="enterprisePosition === 'client'"
            clickable
            :to="{ name: 'admin-dashboard' }"
            :active="isActive('admin-dashboard')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="space_dashboard" />
            </q-item-section>
            <q-item-section> Dashboard </q-item-section>
          </q-item>
          <q-item
            v-show="enterprisePosition === 'client'"
            clickable
            :to="{ name: 'admin-movement' }"
            :active="isActive('admin-movement')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="attach_money" />
            </q-item-section>
            <q-item-section> Movimentações </q-item-section>
          </q-item>
          <q-item
            v-show="enterprisePosition === 'client'"
            clickable
            :to="{ name: 'admin-scheduling' }"
            :active="isActive('admin-scheduling')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="calendar_month" />
            </q-item-section>
            <q-item-section> Agendamentos </q-item-section>
          </q-item>
          <q-item
            v-show="
              enterprisePosition === 'client' && user?.position === 'admin'
            "
            clickable
            :to="{ name: 'admin-financial-control' }"
            :active="isActive('admin-financial-control')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="savings" />
            </q-item-section>
            <q-item-section> Contabilidade </q-item-section>
          </q-item>
          <q-item
            v-show="enterprisePosition === 'counter'"
            clickable
            :to="{ name: 'admin-order' }"
            :active="isActive('admin-order')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="person_search" />
            </q-item-section>
            <q-item-section> Solicitações </q-item-section>
          </q-item>
          <q-item
            v-show="enterprisePosition === 'counter'"
            clickable
            :to="{ name: 'admin-bond' }"
            :active="isActive('admin-bond')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="how_to_reg" />
            </q-item-section>
            <q-item-section> Vínculos </q-item-section>
          </q-item>
          <q-item
            v-show="enterprisePosition === 'counter'"
            clickable
            :to="{ name: 'admin-enterprise' }"
            :active="isActive('admin-enterprise')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="work" />
            </q-item-section>
            <q-item-section> Organização </q-item-section>
          </q-item>
          <q-item
            v-show="user?.position === 'admin'"
            clickable
            :to="{ name: 'admin-records' }"
            :active="isActive('admin-records')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="content_paste_search" />
            </q-item-section>
            <q-item-section> Atividades </q-item-section>
          </q-item>
          <q-expansion-item
            expand-separator
            icon="settings"
            label="Configurações"
            dense-toggle
          >
            <q-item
              v-show="enterprisePosition === 'client'"
              clickable
              :to="{ name: 'admin-category' }"
              :active="isActive('admin-category')"
              active-class=" active-option-menu text-bold"
              @click="closeDrawer"
            >
              <q-item-section avatar>
                <q-icon name="category" />
              </q-item-section>
              <q-item-section> Categorias </q-item-section>
            </q-item>
            <q-item
              v-show="enterprisePosition === 'client'"
              clickable
              :to="{ name: 'admin-account' }"
              :active="isActive('admin-account')"
              active-class=" active-option-menu text-bold"
              @click="closeDrawer"
            >
              <q-item-section avatar>
                <q-icon name="account_balance" />
              </q-item-section>
              <q-item-section> Contas </q-item-section>
            </q-item>
            <q-item
              v-show="user?.position === 'admin'"
              clickable
              :to="{ name: 'admin-departments' }"
              :active="isActive('admin-departments')"
              active-class=" active-option-menu text-bold"
              @click="closeDrawer"
            >
              <q-item-section avatar>
                <q-icon name="group_work" />
              </q-item-section>
              <q-item-section> Departamentos </q-item-section>
            </q-item>
            <q-item
              v-show="
                enterpriseCreated === null &&
                enterprisePosition === 'client' &&
                user?.enterprise_id === user?.view_enterprise_id &&
                user?.position === 'admin'
              "
              clickable
              :to="{ name: 'admin-office' }"
              :active="isActive('admin-office')"
              active-class=" active-option-menu text-bold"
              @click="closeDrawer"
            >
              <q-item-section avatar>
                <q-icon name="holiday_village" />
              </q-item-section>
              <q-item-section> Filiais </q-item-section>
            </q-item>
            <q-item
              v-show="user?.position === 'admin'"
              clickable
              :to="{ name: 'admin-users' }"
              :active="isActive('admin-users')"
              active-class=" active-option-menu text-bold"
              @click="closeDrawer"
            >
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section> Usuários </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-item
            clickable
            :to="{ name: 'admin-help' }"
            :active="isActive('admin-help')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="help" />
            </q-item-section>
            <q-item-section> Ajuda </q-item-section>
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
