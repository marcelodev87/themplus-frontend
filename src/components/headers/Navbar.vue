<script setup lang="ts">
import { ref } from 'vue';
import UserOptions from './UserOptions.vue';
import FormFeedback from '../forms/FormFeedback.vue';
import Notifications from '../info/Notifications.vue';

defineOptions({
  name: 'Navbar',
});

const emit = defineEmits<{
  'update:openFormPerfil': [void];
  'update:openFormEnterprise': [void];
  'update:openEmailInfo': [void];
  'update:changeOpenMenu': [void];
}>();

const showFormFedback = ref<boolean>(false);
const showNotifications = ref<boolean>(false);

const openFormFeedback = (): void => {
  showFormFedback.value = true;
};
const closeFormFeedback = (): void => {
  showFormFedback.value = false;
};
const openNotifications = (): void => {
  showNotifications.value = true;
};
const closeNotificattions = (): void => {
  showNotifications.value = false;
};
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
          class="cursor-pointer hidden-md"
          src="/images/logo.png"
          width="120px"
        />
      </div>
      <div class="row justify-end">
        <div v-if="!$q.screen.lt.md">
          <q-btn
            @click="emit('update:openEmailInfo')"
            flat
            color="black"
            icon-right="chat"
            rounded
          >
            <q-tooltip> Entrar em contato </q-tooltip>
          </q-btn>
          <q-btn
            @click="openFormFeedback"
            flat
            color="black"
            icon-right="fa-solid fa-headset"
            rounded
          >
            <q-tooltip> Enviar sugestão ou dúvida </q-tooltip>
          </q-btn>
          <q-btn
            @click="openNotifications()"
            flat
            color="black"
            icon-right="notifications"
            rounded
            class="q-mr-md"
          >
            <q-tooltip> Notificações </q-tooltip>
            <q-badge color="red" rounded floating />
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
              <q-item clickable v-ripple @click="openNotifications()">
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
        />
      </div>
    </q-toolbar>
    <FormFeedback :open="showFormFedback" @update:open="closeFormFeedback" />
    <Notifications
      :open="showNotifications"
      @update:open="closeNotificattions"
    />
  </nav>
</template>
