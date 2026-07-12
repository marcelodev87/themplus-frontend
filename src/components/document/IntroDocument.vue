<script setup lang="ts">
defineOptions({ name: 'IntroDocument' });

const features = [
  {
    icon: 'smartphone',
    title: 'Controle na palma da mão',
    text: 'Compartilhe atividades, lance movimentações financeiras e acompanhe tudo em tempo real, de qualquer lugar, com interface adaptada para dispositivos móveis.',
  },
  {
    icon: 'handshake',
    title: 'Colaboração e transparência',
    text: 'Seu escritório de contabilidade tem visão clara e organizada das suas informações financeiras, facilitando análise e tomada de decisões estratégicas.',
  },
  {
    icon: 'security',
    title: 'Segurança e rastreabilidade',
    text: 'Todas as ações importantes são registradas em logs detalhados, permitindo que administradores monitorem atividades e garantam a integridade das informações.',
  },
  {
    icon: 'star',
    title: 'Compromisso com você',
    text: 'Ambiente produtivo que atende às suas necessidades, seja você usuário individual ou escritório de contabilidade. Sua opinião é fundamental para nosso crescimento.',
  },
];
</script>

<template>
  <main class="doc-content">
    <div class="doc-header">
      <div class="doc-header-icon">
        <q-icon name="auto_stories" color="white" size="28px" />
      </div>
      <div>
        <p class="text-h5 text-weight-bold q-mb-xs">Bem-vindo ao Themplus</p>
        <p class="text-body2 text-grey-6 q-mb-none">
          Sua ponte para uma contabilidade inteligente e eficaz
        </p>
      </div>
    </div>

    <p class="text-body1 doc-lead">
      O Themplus foi cuidadosamente desenvolvido para revolucionar a forma como
      você interage com seu escritório de contabilidade, proporcionando uma
      experiência organizada, transparente e colaborativa. Nossa plataforma
      conecta você e sua equipe diretamente com seus contadores, otimizando o
      fluxo de informações e garantindo uma gestão financeira mais eficiente.
    </p>

    <div class="row q-col-gutter-md">
      <div v-for="f in features" :key="f.title" class="col-12 col-sm-6">
        <div class="doc-feature-card q-pa-md full-height">
          <div class="row no-wrap items-start q-gutter-sm">
            <q-icon
              :name="f.icon"
              color="primary"
              size="22px"
              class="q-mt-xs"
            />
            <div>
              <p class="text-weight-bold text-body2 q-mb-xs">{{ f.title }}</p>
              <p
                class="text-caption text-grey-7 q-mb-none"
                style="line-height: 1.6"
              >
                {{ f.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="doc-callout doc-callout--info q-mt-xl">
      <q-icon name="support_agent" size="22px" class="q-mt-xs" />
      <p class="text-body2 q-mb-none" style="line-height: 1.6">
        Utilize o canal de <strong>suporte</strong> no menu de navegação para
        enviar sugestões, feedback ou entrar em contato com nossa equipe.
        Juntos, podemos construir uma solução ainda melhor!
      </p>
    </div>
  </main>
</template>
