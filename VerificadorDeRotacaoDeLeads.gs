/**
 * @license
 * Copyright 2025 Gusthavo Henrique Esposito
 * SPDX-License-Identifier: Apache-2.0
 */

// --- ÁREA DE CONFIGURAÇÃO OBRIGATÓRIA ---
// Coluna que contém o código do lead (A=1, B=2, C=3, D=4, etc.)
const COLUNA_CODIGO = 4; 

// Coluna onde o status ("Está rodando" / "Não está rodando") será escrito
const COLUNA_STATUS = 3; 

// Nome EXATO da aba da planilha que contém a lista principal de leads
const NOME_PLANILHA_PRINCIPAL = "NOME_DA_SUA_ABA_PRINCIPAL_AQUI"; // <-- MUDE AQUI

// Lista de IDs das planilhas que vai definir se o status do lead, se está rodando ou não .
// O ID é o trecho longo na URL da planilha, entre /d/ e /edit
const IDS_PLANILHAS_RESTRITAS = [
  'ID_DA_PLANILHA_PIPELINE_ATIVA_1',
  'ID_DA_PLANILHA_LEADS_EM_PRETO',
  'ID_DA_PLANILHA_RECICLAGEM_SETEMBRO'
  // Adicione quantos IDs de planilhas forem necessárias
];

// --- FIM DA CONFIGURAÇÃO ---

// Função que cria o menu ao abrir a planilha
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Automação de Status de rotação')
    .addItem('Verificar rotação de Leads (Completo)', 'iniciarVerificacaoCompleta')
    .addToUi();
}

// Função para INICIAR o processo do zero
function iniciarVerificacaoCompleta() {
  // Limpa qualquer continuação antiga antes de começar
  PropertiesService.getUserProperties().deleteProperty('ultimaLinhaProcessada');
  
  // Chama a função principal para começar o trabalho
  verificarLeadsEmLotes();
}

// A função principal que agora trabalha em lotes
function verificarLeadsEmLotes() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOME_PLANILHA_PRINCIPAL);
  const dados = planilha.getDataRange().getValues();
  const propriedades = PropertiesService.getUserProperties();
  
  // Pega a última linha processada da memória, ou começa da linha 1 (abaixo do cabeçalho)
  let linhaInicial = parseInt(propriedades.getProperty('ultimaLinhaProcessada') || '1');

  // Define um tempo limite para a execução (4.5 minutos em milissegundos)
  const tempoLimite = new Date().getTime() + (4.5 * 60 * 1000);

  for (let i = linhaInicial; i < dados.length; i++) {
    // Se o tempo acabar, salva o progresso e agenda a continuação
    if (new Date().getTime() > tempoLimite) {
      propriedades.setProperty('ultimaLinhaProcessada', i); // Salva a linha onde parou
      ScriptApp.newTrigger('verificarLeadsEmLotes').timeBased().after(5 * 60 * 1000).create(); // Cria um gatilho para rodar de novo em 5 min
      Logger.log(`Pausa programada. O script continuará da linha ${i}.`);
      return; // Para a execução atual
    }
    
    const codigoLead = dados[i][COLUNA_CODIGO - 1];
    let statusAtual = dados[i][COLUNA_STATUS - 1];
    
    if (codigoLead && !statusAtual) {
      let encontrado = false;
      const arquivos = DriveApp.searchFiles(`fullText contains "${codigoLead}"`);
      
      while (arquivos.hasNext() && !encontrado) {
        const arquivo = arquivos.next();
        if (IDS_PLANILHAS_RESTRITAS.includes(arquivo.getId())) {
          encontrado = true;
        }
      }
      
      const statusFinal = encontrado ? 'Está rodando' : 'Não está rodando';
      planilha.getRange(i + 1, COLUNA_STATUS).setValue(statusFinal);
    }
  }
  
  // Se o loop terminar, significa que o trabalho acabou. Limpa a memória.
  propriedades.deleteProperty('ultimaLinhaProcessada');
  SpreadsheetApp.getUi().alert('Verificação completa de todos os leads concluída!');
  Logger.log('Trabalho concluído.');
}
