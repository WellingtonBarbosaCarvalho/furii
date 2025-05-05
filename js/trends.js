/**
 * Módulo de Trending Topics
 * Gerencia a obtenção e exibição de trending topics
 */
const Trends = (() => {
  // Referência ao intervalo de atualização automática
  let autoScrollInterval = null;
  
  /**
   * Inicializa o módulo de trends
   * @param {string} esport - O eSport selecionado
   */
  const init = async (esport) => {
      try {
          await loadTrends(esport);
          await loadFullPageSocials(esport);
          initializeAutoScroll();
          loadStats(esport);
      } catch (error) {
          console.error('Erro ao inicializar módulo de trends:', error);
      }
  };
  
  /**
   * Carrega trending topics
   * @param {string} esport - O eSport selecionado
   */
  const loadTrends = async (esport) => {
      try {
          // Obtém os trending topics através do módulo API
          const trends = await API.getTrendingTopics(esport, 10);
          
          // Seleciona o container de trends
          const trendsScroller = document.getElementById('trends-scroller');
          
          // Limpa o conteúdo atual
          if (trendsScroller) {
              trendsScroller.innerHTML = '';
              
              // Adiciona cada trend ao scroller
              trends.forEach(trend => {
                  const trendItem = createTrendItem(trend);
                  trendsScroller.appendChild(trendItem);
              });
              
              // Adiciona vídeos abaixo das trends
              loadVideos(esport);
          }
      } catch (error) {
          console.error('Erro ao carregar trending topics:', error);
      }
  };
  
  /**
   * Carrega vídeos relacionados ao eSport
   * @param {string} esport - O eSport selecionado
   */
  const loadVideos = async (esport) => {
      try {
          // Obtém os vídeos através do módulo API
          const videos = await API.getVideos(esport, 4);
          
          // Seleciona o container de vídeos
          const videosGrid = document.getElementById('videos-grid');
          
          // Limpa o conteúdo atual
          if (videosGrid) {
              videosGrid.innerHTML = '';
              
              // Adiciona cada vídeo ao grid
              videos.forEach(video => {
                  const videoCard = createVideoCard(video);
                  videosGrid.appendChild(videoCard);
              });
          }
      } catch (error) {
          console.error('Erro ao carregar vídeos:', error);
      }
  };
  
  /**
   * Carrega conteúdo social para a página completa
   * @param {string} esport - O eSport selecionado
   */
  const loadFullPageSocials = async (esport) => {
      try {
          // Obtém mais trending topics para a página completa
          const trends = await API.getTrendingTopics(esport, 20);
          
          // Seleciona o container social da página completa
          const socialsFullpageGrid = document.getElementById('socials-fullpage-grid');
          
          // Limpa o conteúdo atual
          if (socialsFullpageGrid) {
              socialsFullpageGrid.innerHTML = '';
              
              // Adiciona um filtro no topo
              const filterSection = document.createElement('div');
              filterSection.className = 'social-filter-section';
              filterSection.innerHTML = `
                  <div class="filter-header">
                      <h3>Filtros</h3>
                  </div>
                  <div class="filter-options">
                      <button class="filter-button active" data-platform="all">Todos</button>
                      <button class="filter-button" data-platform="twitter"><i class="fa-brands fa-twitter"></i> Twitter</button>
                      <button class="filter-button" data-platform="reddit"><i class="fa-brands fa-reddit"></i> Reddit</button>
                      <button class="filter-button" data-platform="google"><i class="fa-brands fa-google"></i> Google</button>
                  </div>
              `;
              socialsFullpageGrid.appendChild(filterSection);
              
              // Container para os trends
              const trendsContainer = document.createElement('div');
              trendsContainer.className = 'social-trends-container';
              
              // Adiciona cada trend ao grid
              trends.forEach(trend => {
                  const trendCard = createTrendCard(trend);
                  trendsContainer.appendChild(trendCard);
              });
              
              socialsFullpageGrid.appendChild(trendsContainer);
              
              // Adiciona eventos para os filtros
              const filterButtons = socialsFullpageGrid.querySelectorAll('.filter-button');
              filterButtons.forEach(button => {
                  button.addEventListener('click', () => {
                      const platform = button.dataset.platform;
                      
                      // Remove a classe active de todos os botões
                      filterButtons.forEach(btn => btn.classList.remove('active'));
                      
                      // Adiciona a classe active ao botão clicado
                      button.classList.add('active');
                      
                      // Filtra os trends
                      const trendCards = trendsContainer.querySelectorAll('.trend-card');
                      trendCards.forEach(card => {
                          if (platform === 'all' || card.dataset.platform === platform) {
                              card.style.display = 'block';
                          } else {
                              card.style.display = 'none';
                          }
                      });
                  });
              });
          }
      } catch (error) {
          console.error('Erro ao carregar página completa de social:', error);
      }
  };
  
  /**
   * Carrega estatísticas do time
   * @param {string} esport - O eSport selecionado
   */
  const loadStats = async (esport) => {
      try {
          // Obtém as estatísticas através do módulo API
          const stats = await API.getTeamStats(esport);
          
          // Seleciona o container de estatísticas
          const statsContent = document.querySelector('.stats-content');
          
          // Limpa o conteúdo atual
          if (statsContent) {
              statsContent.innerHTML = '';
              
              // Adiciona cada estatística
              stats.forEach(stat => {
                  const statRow = document.createElement('div');
                  statRow.className = 'stat-row';
                  
                  statRow.innerHTML = `
                      <div class="stat-label">${stat.label}</div>
                      <div class="stat-bar">
                          <div class="stat-fill" style="width: ${stat.percentage}%"></div>
                      </div>
                      <div class="stat-percentage">${stat.value}</div>
                  `;
                  
                  statsContent.appendChild(statRow);
              });
          }
      } catch (error) {
          console.error('Erro ao carregar estatísticas:', error);
      }
  };
  
  /**
   * Inicializa o auto-scroll para trending topics
   */
  const initializeAutoScroll = () => {
      // Cancela qualquer intervalo existente
      if (autoScrollInterval) {
          clearInterval(autoScrollInterval);
      }
      
      const trendsScroller = document.getElementById('trends-scroller');
      
      if (trendsScroller) {
          // Define o intervalo para rolar automaticamente (a cada 3 segundos)
          autoScrollInterval = setInterval(() => {
              // Verifica se o usuário não está interagindo com o scroll
              if (!trendsScroller.matches(':hover')) {
                  // Rolagem suave
                  trendsScroller.scrollBy({
                      top: 80,
                      behavior: 'smooth'
                  });
                  
                  // Se chegou ao final, volta ao topo
                  if (trendsScroller.scrollTop + trendsScroller.clientHeight >= trendsScroller.scrollHeight - 10) {
                      setTimeout(() => {
                          trendsScroller.scrollTop = 0;
                      }, 1000);
                  }
              }
          }, 3000);
      }
  };
  
  /**
   * Cria um item de trend
   * @param {Object} trend - Dados do trend
   * @returns {HTMLElement} - Elemento HTML do item
   */
  const createTrendItem = (trend) => {
      const item = document.createElement('div');
      item.className = `trend-item trend-${trend.platform}`;
      
      // Formata a data para exibição
      const dateObj = new Date(trend.timestamp);
      const timeAgo = getTimeAgo(dateObj);
      
      // Processa o conteúdo para destacar hashtags
      const processedContent = processContent(trend.content);
      
      // Determina o ícone baseado na plataforma
      let platformIcon = '';
      if (trend.platform === 'twitter') {
          platformIcon = '<i class="fa-brands fa-twitter trend-icon"></i>';
      } else if (trend.platform === 'reddit') {
          platformIcon = '<i class="fa-brands fa-reddit trend-icon"></i>';
      } else if (trend.platform === 'google') {
          platformIcon = '<i class="fa-brands fa-google trend-icon"></i>';
      }
      
      item.innerHTML = `
          <div class="trend-source">
              ${platformIcon}
              <span class="trend-platform">${trend.platform.charAt(0).toUpperCase() + trend.platform.slice(1)} • ${timeAgo}</span>
          </div>
          <div class="trend-content">${processedContent}</div>
          <div class="trend-stats">
              <div class="trend-stat">
                  <i class="fa-solid fa-heart"></i>
                  ${trend.stats.likes}
              </div>
              <div class="trend-stat">
                  <i class="fa-solid fa-share"></i>
                  ${trend.stats.shares}
              </div>
              <div class="trend-stat">
                  <i class="fa-solid fa-comment"></i>
                  ${trend.stats.comments}
              </div>
          </div>
      `;
      
      return item;
  };
  
  /**
   * Cria um card de trend para a página completa
   * @param {Object} trend - Dados do trend
   * @returns {HTMLElement} - Elemento HTML do card
   */
  const createTrendCard = (trend) => {
      const card = document.createElement('div');
      card.className = `trend-card trend-${trend.platform}`;
      card.dataset.platform = trend.platform;
      
      // Formata a data para exibição
      const dateObj = new Date(trend.timestamp);
      const timeAgo = getTimeAgo(dateObj);
      
      // Processa o conteúdo para destacar hashtags
      const processedContent = processContent(trend.content);
      
      // Determina o ícone baseado na plataforma
      let platformIcon = '';
      if (trend.platform === 'twitter') {
          platformIcon = '<i class="fa-brands fa-twitter trend-icon"></i>';
      } else if (trend.platform === 'reddit') {
          platformIcon = '<i class="fa-brands fa-reddit trend-icon"></i>';
      } else if (trend.platform === 'google') {
          platformIcon = '<i class="fa-brands fa-google trend-icon"></i>';
      }
      
      card.innerHTML = `
          <div class="trend-card-header">
              ${platformIcon}
              <span class="trend-platform">${trend.platform.charAt(0).toUpperCase() + trend.platform.slice(1)}</span>
              <span class="trend-time">${timeAgo}</span>
          </div>
          <div class="trend-card-content">${processedContent}</div>
          <div class="trend-card-stats">
              <div class="trend-stat">
                  <i class="fa-solid fa-heart"></i>
                  ${trend.stats.likes}
              </div>
              <div class="trend-stat">
                  <i class="fa-solid fa-share"></i>
                  ${trend.stats.shares}
              </div>
              <div class="trend-stat">
                  <i class="fa-solid fa-comment"></i>
                  ${trend.stats.comments}
              </div>
          </div>
      `;
      
      return card;
  };
  
  /**
   * Cria um card de vídeo
   * @param {Object} video - Dados do vídeo
   * @returns {HTMLElement} - Elemento HTML do card
   */
  const createVideoCard = (video) => {
      const card = document.createElement('div');
      card.className = 'video-card';
      
      // Formata a data para exibição
      const dateObj = new Date(video.date);
      const timeAgo = getTimeAgo(dateObj);
      
      card.innerHTML = `
          <div class="video-thumbnail">
              <img src="${video.thumbnailUrl}" alt="${video.title}">
              <div class="video-play">
                  <i class="fa-solid fa-play"></i>
              </div>
          </div>
          <div class="video-content">
              <h3 class="video-title">${video.title}</h3>
              <div class="video-meta">
                  <div class="video-channel">
                      <i class="fa-brands fa-youtube"></i>
                      ${video.channelName}
                  </div>
                  <div class="video-views">
                      <i class="fa-solid fa-eye"></i>
                      ${video.views}
                  </div>
              </div>
          </div>
      `;
      
      // Adiciona evento de clique para abrir o link do vídeo
      card.addEventListener('click', () => {
          if (video.link) {
              window.open(video.link, '_blank');
          }
      });
      
      return card;
  };
  
  /**
   * Processa o conteúdo para destacar hashtags
   * @param {string} content - Texto do conteúdo
   * @returns {string} - HTML com hashtags destacadas
   */
  const processContent = (content) => {
      // Substitui hashtags por spans estilizados
      return content.replace(/#(\w+)/g, '<span class="trend-hashtag">#$1</span>');
  };
  
  /**
   * Calcula o tempo decorrido desde uma data
   * @param {Date} date - Data para calcular
   * @returns {string} - Texto formatado (ex: "3h atrás")
   */
  const getTimeAgo = (date) => {
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      
      if (diffDay > 0) {
          return `${diffDay}d atrás`;
      } else if (diffHour > 0) {
          return `${diffHour}h atrás`;
      } else if (diffMin > 0) {
          return `${diffMin}m atrás`;
      } else {
          return 'agora';
      }
  };
  
  /**
   * Atualiza trends com base no eSport selecionado
   * @param {string} esport - O eSport selecionado
   */
  const updateTrends = async (esport) => {
      await loadTrends(esport);
      await loadFullPageSocials(esport);
      loadStats(esport);
  };
  
  // Expõe a API pública
  return {
      init,
      updateTrends,
      loadTrends,
      loadFullPageSocials
  };
})();

// Exporta o módulo para uso em outros scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Trends;
}