<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';
import { useUsersMembersStore } from 'src/stores/users-store';
import UserOptions from './UserOptions.vue';
import FormFeedback from '../forms/FormFeedback.vue';
import Inbox from '../general/Inbox.vue';

defineOptions({
  name: 'Navbar',
});

const { user, enterpriseName } = storeToRefs(useAuthStore());
const { notifications } = storeToRefs(useUsersMembersStore());
const emit = defineEmits<{
  'update:openFormPerfil': [void];
  'update:openFormEnterprise': [void];
  'update:openEmailInfo': [void];
  'update:openViewEnterprise': [void];
  'update:changeOpenMenu': [void];
}>();
const showFormFedback = ref<boolean>(false);
const showInbox = ref<boolean>(false);
const openFormFeedback = (): void => {
  showFormFedback.value = true;
};
const closeFormFeedback = (): void => {
  showFormFedback.value = false;
};
const openInbox = (): void => {
  showInbox.value = true;
};
const closeInbox = (): void => {
  showInbox.value = false;
};

const getEnterpriseInspect = computed(() => {
  if (user.value?.view_enterprise_code) {
    return `${user.value?.view_enterprise_code} - ${user.value?.view_enterprise_name}`;
  }
  return user.value?.view_enterprise_name;
});
</script>
<template>
  <nav>
    <q-toolbar class="row items-center justify-between">
      <div class="row items-center q-gutter-x-sm">
        <q-btn
          @click="emit('update:changeOpenMenu')"
          flat
          color="black"
          icon-right="menu"
          rounded
        />
        <img
          v-show="!$q.screen.lt.md"
          @click="$router.push({ name: 'admin-feed' })"
          class="cursor-pointer hover hidden-md"
          src="/images/logo.png"
          width="120px"
        />
      </div>
      <div class="row justify-end">
        <div v-if="!$q.screen.lt.md">
          <q-btn flat color="orange" icon-right="info" rounded>
            <q-tooltip class="text-subtitle2">
              Sua organização: {{ enterpriseName ?? 'Não definido' }}
            </q-tooltip>
          </q-btn>
          <q-btn
            style="
              max-width: 350px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
            v-show="user?.enterprise_id !== user?.view_enterprise_id"
            :label="getEnterpriseInspect"
            flat
            color="red"
            icon-right="holiday_village"
            rounded
          >
            <q-tooltip> Modo espectador ativado </q-tooltip>
          </q-btn>
          <q-btn
            @click="emit('update:openEmailInfo')"
            flat
            color="black"
            icon-right="fa-solid fa-headset"
            rounded
          >
            <q-tooltip> Entrar em contato </q-tooltip>
          </q-btn>
          <q-btn
            v-show="user?.enterprise_id === user?.view_enterprise_id"
            @click="openFormFeedback"
            flat
            color="black"
            icon-right="chat"
            rounded
          >
            <q-tooltip> Enviar sugestão ou dúvida </q-tooltip>
          </q-btn>
          <q-btn
            @click="openInbox"
            flat
            color="black"
            icon-right="notifications"
            rounded
            class="q-mr-md"
          >
            <q-tooltip> Notificações </q-tooltip>
            <q-badge
              v-show="notifications > 0"
              color="red"
              rounded
              floating
              :label="notifications"
            />
          </q-btn>
        </div>
        <div v-else>
          <q-btn-dropdown
            round
            flat
            class="q-pa-none q-px-md q-mr-sm text-black"
            ref="dropdown"
            dropdown-icon="info"
          >
            <q-list>
              <q-item clickable v-ripple @click="emit('update:openEmailInfo')">
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon name="chat" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>Entrar em contato</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="openFormFeedback">
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon name="fa-solid fa-headset" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>Enviar sugestão ou dúvida</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="openInbox">
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon name="notifications" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>Notificações</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <UserOptions
          @update:open-form-perfil="emit('update:openFormPerfil')"
          @update:open-form-enterprise="emit('update:openFormEnterprise')"
          @update:open-form-view-enterprise="emit('update:openViewEnterprise')"
        />
      </div>
    </q-toolbar>
    <FormFeedback :open="showFormFedback" @update:open="closeFormFeedback" />
    <Inbox :open="showInbox" @update:open="closeInbox" />
  </nav>
</template>
