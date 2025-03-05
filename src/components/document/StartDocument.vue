<script setup lang="ts">
defineOptions({
  name: 'StartDocument',
});
</script>
<template>
  <main>
    <p class="text-h5 text-bold">
      # Boas-vindas ao Themplus: Seu Cadastro Facilitado
    </p>
    <ol class="text-body1 column q-gutter-y-md">
      <li class="q-pa-sm">
        <p>
          Para iniciarmos sua jornada no Themplus, o primeiro passo é realizar o
          cadastro através da nossa intuitiva tela de login:
        </p>
        <q-img
          src="/images/document/login.png"
          style="width: 600px; max-width: 80vw"
        />
      </li>
      <li class="q-pa-sm">
        <p>
          Ao selecionar a opção "Cadastrar", você será direcionado a uma tela
          dedicada, como demonstrado abaixo:
        </p>
        <q-img
          src="/images/document/register-user.png"
          style="width: 600px; max-width: 80vw"
        />
      </li>
      <li class="q-pa-sm">
        <p>
          É fundamental que você defina seu perfil no Themplus. Para
          <strong>acessar as funcionalidades como cliente</strong>,
          certifique-se de selecionar a opção "Cliente". Caso represente uma
          <strong>organização contábil</strong>, opte por "Contador". Preencha
          cuidadosamente todos os campos solicitados. Lembre-se que o campo
          <strong><i>"Nome de sua organização"</i></strong> deve refletir a
          denominação oficial da sua instituição/igreja.
        </p>
      </li>
      <li class="q-pa-sm">
        <p>
          Após a validação bem-sucedida dos seus dados, uma janela modal
          surgirá, confirmando o cadastro:
        </p>
        <q-img
          src="/images/document/register-success-user.png"
          style="width: 600px; max-width: 80vw"
        />
      </li>
      <li class="q-pa-sm">
        <p>
          Neste momento, é
          <strong>imprescindível clicar em "Continuar"</strong> para completar o
          seu perfil com informações adicionais. Este passo garante a
          personalização completa da sua experiência no Themplus. Mesmo que
          retorne à tela de login, o modal persistirá até que o preenchimento
          seja finalizado.
        </p>
        <q-img
          src="/images/document/form-register.png"
          style="width: 600px; max-width: 80vw"
        />
      </li>
      <li class="q-pa-sm">
        <p>
          Parabéns! Ao concluir o cadastro, você estará pronto para
          <strong>explorar todo o potencial do Themplus</strong>. As seções
          subsequentes deste guia detalharão as funcionalidades e recursos
          disponíveis em cada perfil.
        </p>
        <div class="column">
          <q-img
            src="/images/document/themplus.png"
            style="width: 600px; max-width: 80vw"
          >
            <div class="absolute-bottom text-subtitle1 text-center">
              Visão Cliente
            </div>
          </q-img>
          <q-img
            src="/images/document/themplus-counter.png"
            style="width: 600px; max-width: 80vw"
            class="q-mt-md"
          >
            <div class="absolute-bottom text-subtitle1 text-center">
              Visão Contador
            </div>
          </q-img>
        </div>
      </li>
    </ol>
  </main>
</template>
