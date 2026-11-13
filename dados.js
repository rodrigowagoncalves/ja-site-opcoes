// Dados compartilhados pelas duas opções de site.
// Frentes: texto do brandbook (página "Ecossistema de Atuação").
// Trabalhos: vêm de assets/portfolio/manifesto.json (curadoria do Drive da JA).
// Se o manifesto não existir, usa as fotos do próprio brandbook.
window.JA_FRENTES = [
  { chave:'Design', titulo:'Design gráfico & visual', imagem:'assets/capa-tecido.jpg',
    escopo:'Direção de arte, sistemas visuais, design editorial, embalagens, apresentações executivas e peças sob medida.',
    resultado:'Clareza estética e diferenciação imediata' },
  { chave:'Branding', titulo:'Estratégia & identidade', imagem:'assets/pessoa-bone.jpg',
    escopo:'Posicionamento, logotipo, universo visual, tom de voz e manuais completos (brandbooks).',
    resultado:'Consistência e reconhecimento duradouro' },
  { chave:'Publicidade', titulo:'Campanhas online & off', imagem:'assets/pessoa-parede.jpg',
    escopo:'Redes sociais, mídia paga, mídia exterior (OOH), catálogos, folders e materiais de PDV.',
    resultado:'Impacto multicanal com linguagem unificada' },
  { chave:'Eventos', titulo:'Suporte visual & operacional', imagem:'assets/tecido-icone.jpg',
    escopo:'Identidade de evento, cenografia, sinalização, backdrops, credenciais, kits e apoio visual no local.',
    resultado:'Presença memorável e organizada ao vivo' },
  { chave:'Sites', titulo:'Criação & suporte web', imagem:'assets/letreiro-3d.jpg',
    escopo:'Arquitetura UI/UX, sites institucionais, landing pages de alta conversão, performance e manutenção.',
    resultado:'Autoridade digital e geração de negócios' }
];

window.JA_TRABALHOS_RESERVA = [
  { arquivo:'assets/pessoa-bone.jpg', cliente:'JA Brand', frente:'Branding', orientacao:'horizontal', descricao:'Letreiro JA em parede de concreto' },
  { arquivo:'assets/pessoa-parede.jpg', cliente:'JA Brand', frente:'Publicidade', orientacao:'vertical', descricao:'Campanha com o ícone JA em grande escala' },
  { arquivo:'assets/capa-tecido.jpg', cliente:'JA Brand', frente:'Design', orientacao:'horizontal', descricao:'Ícone JA aplicado em camisa' },
  { arquivo:'assets/tecido-icone.jpg', cliente:'JA Brand', frente:'Design', orientacao:'horizontal', descricao:'Ecobag com o ícone JA' },
  { arquivo:'assets/letreiro-3d.jpg', cliente:'JA Brand', frente:'Sinalização', orientacao:'vertical', descricao:'Letreiro 3D verde' }
];

// Campanhas políticas ficam fora do rascunho; mude para false para mostrar.
window.JA_ESCONDER_POLITICO = true;

const NOMES_FRENTE = { design:'Design', branding:'Branding', publicidade:'Publicidade', eventos:'Eventos', sites:'Sites', audiovisual:'Audiovisual' };

window.carregarPortfolio = async function(){
  let trabalhos = window.JA_TRABALHOS_RESERVA;
  try{
    const r = await fetch('assets/portfolio/manifesto.json', {cache:'no-store'});
    if(r.ok){
      const m = await r.json();
      const lista = (Array.isArray(m) ? m : (m.pecas || m.itens || []))
        .filter(p => !window.JA_ESCONDER_POLITICO || !p.politico)
        .map(p => ({
          arquivo: 'assets/portfolio/' + p.arquivo.split('/').pop(),
          cliente: p.cliente,
          frente: NOMES_FRENTE[(p.frente||'').toLowerCase()] || p.frente,
          orientacao: p.orientacao || 'horizontal',
          descricao: p.descricao_curta || p.descricao || p.cliente
        }));
      if(lista.length) trabalhos = lista;
    }
  }catch(e){}
  // a foto de cada frente passa a ser o primeiro trabalho real daquela frente
  const frentes = window.JA_FRENTES.map(f => {
    const t = trabalhos.find(x => x.frente === f.chave);
    return t ? {...f, imagem: t.arquivo} : f;
  });
  return { frentes, trabalhos };
};
