Automação de Verificação de Leads com Google Apps Script
Este projeto contém um script (Google Apps Script) para automatizar o processo de verificação de rotção de leads em planilhas do Google Sheets. Ele foi criado para eliminar uma tarefa manual e repetitiva de "batimento" de código de Lead no Drive, aumentando a produtividade e a integridade dos dados de vendas e redusin do a zero o problema de redundância na enviação de leads para os vendedores.
No dia a dia da operação comercial, uma base de leads ("Leads - Rio de Janeiro", por exemplo) precisava ser verificada antes da distribuição para a equipe de vendas. Era necessário checar manualmente se cada lead já estava sendo trabalhado em alguma outra pipeline ativa, em listas de reciclagem ou em uma "blacklist" (leads que não desejam contato ou que alegam não ter plano, enfim).
Esse processo manual era Lento, exigia que um operador copiasse o código de cada lead.
Repetitivo o operador precisava colar esse código na barra de pesquisa do Google Drive.
Sujeito a Erros, uma verificação visual em várias planilhas diferentes, repetidas vezes para mais de nove mil dados de leads podia facilmente levar a um erro humano, distribuindo um lead que já estava em atendimento.
Este script automatiza 100% desse processo. Ele atua como um "robô" que faz a verificação de cerca de 500 Leads a cada 5 minutos, sendo que eu levava quase o dia todo, fazendo outras tarefas simultâneamente, para verificar cerca de 400 leads.

Principais Funcionalidades
O script lê uma lista de leads de uma planilha-mãe, para cada lead, ele simula a pesquisa manual, buscando o código do lead em todo o Google Drive. Ele compara os resultados da busca com uma lista pré-definida de planilhas "restritas" (outras pipelines, blacklists, etc.) e com base na verificação, o script escreve o status diretamente na planilha-mãe: 'Está rodando' ou 'Não está rodando'.

Para lidar com listas de milhares de leads sem falhar, o script inclui um sistema de processamento em lotes. O Google Apps Script tem um limite de execução de 6 minutos (Com a minha internet e processamento do meu computador, 6 minutos é o sufiente para ler cerca de 600 leads, cerca de 100 leads por minuto). Uma lista muito grande faria o script parar no meio. Para resolver isso o script roda por 4,5 minutos, ao atingir o limite, ele salva automaticamente a última linha que processou e agenda a si mesmo para "continuar" o trabalho dali a 5 minutos, continuando exatamente de onde parou. Esse ciclo se repete até que toda a planilha seja processada, garantindo que 100% dos leads sejam verificados.

Modo de uso:
 - Se sua planilha for um arquivo .xlsx, primeiro a converta para o formato nativo do Google Sheets (Arquivo > Salvar como Planilhas Google).
 - Com a planilha Google Sheets aberta, vá em Extensões > Apps Script.
 - Apague o que tiver escrito na base do editor, copie o código do arquivo VerificadorDeLeads.gs e cole no editor.
   As edições necessárias no código são simples:
    - COLUNA_CODIGO: Defina o número da coluna onde estão os códigos dos leads (ex: 4 para a coluna D - está descrito no código).
    - COLUNA_STATUS: Defina o número da coluna onde o script deve escrever o status (ex: 3 para a coluna C).
    - NOME_PLANILHA_PRINCIPAL: Escreva o nome exato da aba (página) da sua planilha que contém os leads.
    - IDS_PLANILHAS_RESTRITAS: Adicione os IDs das planilhas que devem ser verificadas. O ID é o código longo na URL (entre /d/ e /edit).
   Após esse processo, você precisa salvar, autorizar e executar:
    - Salve o projeto (ícone de disquete).
    - Volte para a planilha e atualize a página.
    - Um novo menu, "Automação de Status de rotação", aparecerá na parte superior da planilha.
    - Clique em "Automação de Status de rotação" > 'Verificar rotação de Leads (Completo)'.
    - Na primeira vez, o Google pedirá sua permissão. Conceda as autorizações necessárias.
    - Clique em'Verificar rotação de Leads (Completo)' novamente. O script começará a preencher os status.
      
