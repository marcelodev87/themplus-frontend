<script setup lang="ts">
defineOptions({
  name: 'UserOptions',
});
</script>

<template>
  <q-btn-dropdown rounded flat class="q-pa-none q-px-md q-mr-sm text-black" label="Carlos Davi">
    <template v-slot:label>
      <div class="row items-center no-wrap q-pa-none">
        <q-avatar class="q-ml-sm">
          <q-img size="sm" src="/images/user.png" />
        </q-avatar>
      </div>
    </template>
    <q-list>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-avatar>
            <q-icon name="account_circle" />
          </q-avatar>
        </q-item-section>
        <q-item-section>Perfil</q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-avatar>
            <q-icon name="logout" />
          </q-avatar>
        </q-item-section>
        <q-item-section>Sair</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
