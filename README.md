# ScoutApp - Plataforma de Avaliação de Desempenho e Scout de Atletas

Projeto desenvolvido para a disciplina **CCP150 - Desenvolvimento de Aplicativos Móveis** do Centro Universitário FEI.

---

## 1. Visão Geral e Requisitos

### Motivação e Tema
O **ScoutApp** é um aplicativo voltado para comissões técnicas, treinadores e olheiros acompanharem o rendimento individual e coletivo de atletas esportivos. Em muitos clubes amadores e escolinhas de futebol, os dados de desempenho ainda são anotados em pranchetas de papel ou planilhas desconexas, dificultando a análise histórica e a tomada de decisão sobre escalações.

O aplicativo resolve esse problema fornecendo uma interface prática para cadastro de atletas, registro de scouts em tempo real durante jogos e comparação técnica entre jogadores.

### Atendimento aos Requisitos da Disciplina
* **Mínimo de 6 telas distintas**: 
  1. `DashboardScreen`: Resumo geral e métricas do time.
  2. `PlayerListScreen`: Listagem de atletas cadastrados com filtros e busca.
  3. `PlayerDetailScreen`: Perfil detalhado e barras de atributos do jogador.
  4. `PlayerFormScreen`: Cadastro e edição de atleta.
  5. `MatchScoutScreen`: Registro de scout de partida com atuador de vibração.
  6. `PlayerCompareScreen`: Comparador frente a frente entre dois atletas.
  *(Nenhuma tela de login ou cadastro foi contabilizada nesse total).*
* **Navegação com React Navigation**: Combinação de Bottom Tab Navigation (Painel, Elenco, Comparador) com Native Stack Navigation (Ficha do Jogador, Formulário e Registro de Scout).
* **Imagens**: Exibição de fotos dos jogadores e ícones de interface.
* **Armazenamento em Banco de Dados (CRUD Completo no Firebase Firestore)**:
  * *Create*: Cadastro de novos atletas e gravação de partidas de scout.
  * *Read*: Consulta e listagem dinâmica de jogadores e estatísticas.
  * *Update*: Atualização cadastral de jogadores e recálculo de médias após jogos.
  * *Delete*: Exclusão de atletas com diálogo de confirmação.
* **Atuador**: Uso da API nativa de vibração (`Vibration`) para fornecer feedback tátil durante o incremento de estatísticas de jogo e na conclusão do salvamento.
* **Interface e UX**: Layout com espaçamentos padronizados, paleta sóbria, hierarquia visual clara e retorno imediato ao usuário.

---

## 2. Tecnologias Utilizadas

* **React Native / Expo**: Framework principal para desenvolvimento mobile híbrido.
* **JavaScript**: Linguagem utilizada em toda a base de código.
* **React Navigation**:
  * `@react-navigation/native`
  * `@react-navigation/bottom-tabs`
  * `@react-navigation/native-stack`
* **Firebase Firestore**: Banco de dados NoSQL em nuvem para persistência do CRUD.
* **Expo Vector Icons (Ionicons)**: Conjunto de ícones para ações e navegação.
* **Vibration API**: Atuador nativo de feedback tátil.

---

## 3. Funcionalidades Desenvolvidas

1. **Painel Geral (Dashboard)**:
   * Exibe cartões de métricas rápidas: total de atletas, nota média da equipe, soma de gols e assistências.
   * Apresenta os três melhores atletas ranqueados por média de nota.
   * Acesso rápido para cadastro e listagem.

2. **Plantel de Atletas (Listagem & Filtros)**:
   * Lista visual dos atletas com foto, posição, camisa e nota.
   * Filtros rápidos por posição (Goleiro, Defesa, Meio-Campo, Atacante).
   * Busca em tempo real por nome.
   * Ação de exclusão com confirmação e vibração.

3. **Ficha Detalhada do Jogador**:
   * Exibe informações biométricas (idade, pé dominante).
   * Histórico de jogos, gols e assistências acumuladas.
   * Barras de progresso com notas de atributos: Velocidade, Passe, Finalização e Força Física.
   * Botões de atalho para registrar novo scout ou editar dados.

4. **Cadastro e Edição de Jogador**:
   * Formulário com validação de campos obrigatórios.
   * Seletores customizados para posições em campo e pé dominante.
   * Configuração de atributos técnicos iniciais (escala de 0 a 100).

5. **Registro de Scout de Partida**:
   * Ferramenta para o treinador pontuar o jogador em uma partida real.
   * Contadores com feedback de vibração nos botões de incremento e decremento para gols, assistências, passes certos e desarmes.
   * Atribuição de nota de atuação (1.0 a 10.0) e campo de observações técnicas.
   * Recálculo automático das médias do atleta no banco de dados.

6. **Comparador de Jogadores (Head-to-Head)**:
   * Seleção modal de dois atletas do elenco.
   * Comparação simultânea de métricas de jogo e atributos técnicos.
   * Destaque visual (em verde) para o atleta superior em cada quesito avaliado.

---

## 4. Demonstração

*(Inserir GIF ou capturas de tela demonstrando o fluxo entre as telas do aplicativo)*

---

## 5. Instalação e Execução

### Pré-requisitos
* Node.js (versão 20 LTS ou superior)
* Gerenciador de pacotes npm
* Aplicativo **Expo Go** instalado no smartphone (Android ou iOS)

### Passo a Passo

1. Clone o repositório privado:
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd scout-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o Firebase:
No arquivo `src/services/firebase.js`, insira as credenciais do seu projeto Firebase Firestore:
```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "SEU_MESSAGING_ID",
  appId: "SEU_APP_ID"
};
```

4. Inicie o servidor Expo:
```bash
npx expo start
```

5. Abra o aplicativo **Expo Go** no celular e escaneie o QR Code exibido no terminal.

---

## 6. Aprendizados e Próximos Passos

### Aprendizados
O desenvolvimento deste projeto permitiu consolidar a arquitetura de navegação aninhada no React Navigation, integrando Bottom Tabs com Stacks sem perda de contexto entre as rotas. A comunicação com o Firebase Firestore em modo modular evidenciou a importância de manter um arquivo centralizado de serviços (`playerService.js`) para separar a lógica de negócio da camada visual de componentes. O uso do atuador de vibração trouxe um ganho perceptível na experiência do usuário, tornando a interface mais interativa durante o registro de eventos.

### Próximos Passos
* Implementar upload direto de fotos de perfil tiradas pela câmera do aparelho via Expo ImagePicker.
* Adicionar exportação de relatórios da partida em formato PDF para envio à diretoria.
* Gerar gráficos de radar para visualização dos atributos dos jogadores.
