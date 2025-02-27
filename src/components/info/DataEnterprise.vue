<script setup lang="ts">
import { Enterprise } from 'src/ts/interfaces/data/Enterprise';
import { computed } from 'vue';

defineOptions({
  name: 'DataEnterprise',
});

const props = defineProps<{
  enterprise: Enterprise;
}>();

const dataEnterprise = computed(() => props.enterprise);
</script>
<template>
  <section>
    <q-expansion-item
      expand-separator
      icon="work"
      label="Dados da organização"
      class="border-form"
    >
      <q-form class="q-gutter-y-sm">
        <q-input
          v-model="dataEnterprise.name"
          bg-color="white"
          label-color="black"
          filled
          label="Nome da organização"
          dense
          input-class="text-black"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="person" color="black" size="20px" />
          </template>
        </q-input>
        <q-input
          v-model="dataEnterprise.email"
          bg-color="white"
          label-color="black"
          filled
          label="E-mail da organização"
          dense
          input-class="text-black"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="mail" color="black" size="20px" />
          </template>
        </q-input>
        <q-input
          v-model="dataEnterprise.phone"
          bg-color="white"
          label-color="black"
          filled
          label="Telefone da organização"
          dense
          input-class="text-black"
          maxlength="15"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="call" color="black" size="20px" />
          </template>
        </q-input>
        <div class="row justify-between">
          <q-input
            v-if="dataEnterprise.cpf !== null"
            v-model="dataEnterprise.cpf"
            bg-color="white"
            label-color="black"
            filled
            label="CPF"
            dense
            input-class="text-black"
            maxlength="15"
            readonly
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="badge" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-else
            v-model="dataEnterprise.cnpj"
            bg-color="white"
            label-color="black"
            filled
            label="CNPJ"
            dense
            input-class="text-black"
            readonly
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="badge" color="black" size="20px" />
            </template>
          </q-input>
        </div>
        <q-input
          v-model="dataEnterprise.cep"
          bg-color="white"
          label-color="black"
          filled
          label="CEP"
          dense
          input-class="text-black"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="search" color="black" size="20px" />
          </template>
        </q-input>
        <div class="row justify-between">
          <q-input
            v-model="dataEnterprise.state"
            bg-color="white"
            label-color="black"
            filled
            label="UF"
            dense
            input-class="text-black"
            class="input-divider"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="map" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEnterprise.city"
            bg-color="white"
            label-color="black"
            filled
            label="Cidade"
            dense
            input-class="text-black"
            class="input-divider"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
            </template>
          </q-input>
        </div>
        <q-input
          v-model="dataEnterprise.neighborhood"
          bg-color="white"
          label-color="black"
          filled
          label="Bairro"
          dense
          input-class="text-black"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="pin_drop" color="black" size="20px" />
          </template>
        </q-input>
        <q-input
          v-model="dataEnterprise.address"
          bg-color="white"
          label-color="black"
          filled
          label="Logradouro"
          dense
          input-class="text-black"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="pin_drop" color="black" size="20px" />
          </template>
        </q-input>
        <div class="row justify-between">
          <q-input
            v-model="dataEnterprise.number_address"
            bg-color="white"
            label-color="black"
            filled
            label="Número"
            dense
            input-class="text-black"
            class="input-divider"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="numbers" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEnterprise.complement"
            bg-color="white"
            label-color="black"
            filled
            label="Complemento"
            dense
            input-class="text-black"
            class="input-divider"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="numbers" color="black" size="20px" />
            </template>
          </q-input>
        </div>
      </q-form>
    </q-expansion-item>
  </section>
</template>
