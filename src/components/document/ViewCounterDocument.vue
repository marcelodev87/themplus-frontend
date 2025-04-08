<script setup lang="ts">
import { ref } from 'vue';
import ImageView from '../shared/ImageView.vue';

defineOptions({
  name: 'ViewCounterDocument',
});

const showImage = ref<boolean>(false);
const urlImage = ref<string | null>(null);

const openShowImage = (url: string) => {
  showImage.value = true;
  urlImage.value = url;
};
const closeShowImage = () => {
  showImage.value = false;
  urlImage.value = null;
};
</script>
<template>
  <main>
    <p class="text-h5 text-bold"># Explorando o Themplus: Visão Contador</p>
    <p class="text-body1">
      Themplus oferece uma experiência personalizada para cada perfil de
      usuário: "Cliente" ou "Contador". Esta seção explora as funcionalidades e
      recursos exclusivos para organizações contábeis.
    </p>
    <q-img
      @click="openShowImage('/images/document/view-counter.png')"
      src="/images/document/view-counter.png"
      style="width: 1000px; max-width: 95vw"
    />

    <p class="text-h6 q-mt-md"># Descobrindo as Ferramentas Essenciais:</p>
    <ul class="text-body1 column q-gutter-y-md">
      <li>
        <p>
          <strong>Feed:</strong> Receba atualizações relevantes e informações
          importantes através de banners informativos personalizados.
        </p>
      </li>
      <li>
        <p>
          <strong>Solicitações:</strong> Gerencie facilmente suas solicitações
          pendentes de vinculação com organizações "Cliente".
        </p>
      </li>
      <li>
        <p>
          <strong>Vínculos:</strong> Visualize e gerencie as organizações
          "Cliente" às quais sua organização contábil está conectada.
        </p>
      </li>
      <li>
        <p>
          <strong>Organização:</strong> Simplifique o processo de integração ao
          registrar uma organização "Cliente" e vincular-se automaticamente a
          ela.
        </p>
      </li>
      <li>
        <p>
          <strong>Atividades:</strong> Monitore as ações dos usuários dentro da
          sua organização, garantindo transparência e controle sobre as
          atividades internas.
        </p>
      </li>
      <li>
        <p>
          <strong>Configurações:</strong> Personalize o Themplus para otimizar o
          fluxo de trabalho da sua organização:
        </p>
        <ul>
          <li>
            <p>
              <strong>Departamentos:</strong> Organize sua estrutura interna,
              definindo e gerenciando os departamentos da sua organização
              contábil.
            </p>
          </li>
          <li>
            <p>
              <strong>Usuários:</strong> Gerencie os usuários da sua
              organização, controlando o acesso e as permissões para garantir a
              segurança dos dados.
            </p>
          </li>
        </ul>
      </li>
      <li>
        <p>
          <strong>Ajuda:</strong> Acesse a documentação completa do Themplus,
          com guias e informações detalhadas para maximizar a sua experiência.
        </p>
      </li>
    </ul>
    <ImageView
      :open="showImage"
      :url="urlImage"
      @update:open="closeShowImage"
    />
  </main>
</template>
