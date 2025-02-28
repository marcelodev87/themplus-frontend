<script setup lang="ts">
defineOptions({
  name: 'StartDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Cadastro</p>
    <ol class="text-body1 column q-gutter-y-md">
      <li>
        <p>Primeiramente, vamos fazer o cadastro na nossa tela de login</p>
        <q-img src="/images/document/login.png" width="600px" />
      </li>
      <li>
        <p>Ao apertar em cadastrar, aparecerá uma tela como essa abaixo:</p>
        <q-img src="/images/document/register-user.png" width="600px" />
      </li>
      <li>
        <p>
          Note que para <strong>começar como cliente</strong>, a opção "cliente"
          deve está selecionado ou para se
          <strong>registrar com organização de contabilidade</strong>, selecione
          a opção "contador", além de preencher todo o restante dos dados.
          Importante ressaltar que o
          <strong><i>"nome de sua organização"</i></strong
          >, é referente como sua organização/igreja vai ser nomeada.
        </p>
      </li>
      <li>
        <p>
          Após o cadastro ter sido realizado, consequentemente os dados
          validados, posteriormente
          <strong>surgirá esse novo modal abaixo:</strong>
        </p>
        <q-img src="/images/document/register-success-user.png" width="600px" />
      </li>
      <li>
        <p>
          Com isso será <strong>obrigatório apertar em continar</strong> para
          preeencher o restantes dos dados necessários para suas informações
          ficarem completas. Caso, volte para a tela de login e volte a fazer o
          login com a mesma conta,
          <strong>ainda sim continuará aparecendo este modal</strong>.
        </p>
        <q-img src="/images/document/form-register.png" width="600px" />
      </li>
      <li>
        <p>
          Após concluir este passo, estará livre para
          <strong>aproveitar o máximo do Themplus</strong>. Abordaremos com mais
          detalhes nas outras seções.
        </p>
        <q-img src="/images/document/themplus.png" width="600px">
          <div class="absolute-bottom text-subtitle1 text-center">
            Visão Cliente
          </div>
        </q-img>
        <q-img
          src="/images/document/themplus-counter.png"
          width="600px"
          class="q-mt-md"
        >
          <div class="absolute-bottom text-subtitle1 text-center">
            Visão Contador
          </div>
        </q-img>
      </li>
    </ol>
  </main>
</template>
