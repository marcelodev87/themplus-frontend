import axios from 'axios';

const baseUrl = 'https://viacep.com.br/ws';

export const searchCep = async (
  cep: string
): Promise<{
  status: number;
  data: {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    estado: string;
  };
}> => {
  const url = `${baseUrl}/${cep}/json/`;

  try {
    const response = await axios.get(url);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    throw new Error('Erro ao buscar o CEP');
  }
};
