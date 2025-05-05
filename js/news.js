/**
 * Módulo de Notícias
 * Gerencia a obtenção e exibição de notícias
 */
const News = (() => {
  /**
   * Inicializa o módulo de notícias
   * @param {string} esport - O eSport selecionado
   */
  const init = async (esport) => {
      try {
          await loadNews(esport);
          await loadFullPageNews(esport);
      } catch (error) {
          console.error('Erro ao inicializar módulo de notícias:', error);
      }
  };
  
  /**
   * Carrega as notícias para a seção principal
   * @param {string} esport - O eSport selecionado
   */
  const loadNews = async (esport) => {
      try {
          // Obtém as notícias através do módulo API
          const news = await API.getNews(esport, 6);
          
          // Seleciona o container de notícias
          const newsGrid = document.getElementById('news-grid');
          
          // Limpa o conteúdo atual
          if (newsGrid) {
              newsGrid.innerHTML = '';
              
              // Adiciona cada notícia ao grid
              news.forEach(item => {
                  const newsCard = createNewsCard(item);
                  newsGrid.appendChild(newsCard);
              });
          }
      } catch (error) {
          console.error('Erro ao carregar notícias:', error);
      }
  };
  
  /**
   * Carrega notícias para a página completa
   * @param {string} esport - O eSport selecionado
   */
  const loadFullPageNews = async (esport) => {
      try {
          // Obtém mais notícias para a página completa
          const news = await API.getNews(esport, 12);
          
          // Seleciona o container de notícias da página completa
          const newsFullpageGrid = document.getElementById('news-fullpage-grid');
          
          // Limpa o conteúdo atual
          if (newsFullpageGrid) {
              newsFullpageGrid.innerHTML = '';
              
              // Adiciona cada notícia ao grid
              news.forEach(item => {
                  const newsCard = createNewsCard(item);
                  newsFullpageGrid.appendChild(newsCard);
              });
          }
      } catch (error) {
          console.error('Erro ao carregar página completa de notícias:', error);
      }
  };
  
  /**
   * Cria um card de notícia
   * @param {Object} newsItem - Dados da notícia
   * @returns {HTMLElement} - Elemento HTML do card
   */
  const createNewsCard = (newsItem) => {
      const card = document.createElement('div');
      card.className = 'news-card';
      card.dataset.id = newsItem.id;
      
      // Formata a data para exibição
      const dateObj = new Date(newsItem.date);
      const formattedDate = dateObj.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
      });
      
      card.innerHTML = `
          <div class="news-image">
              <img src="${newsItem.imageUrl}" alt="${newsItem.title}">
          </div>
          <div class="news-content">
              <span class="news-category">${newsItem.category}</span>
              <h3 class="news-title">${newsItem.title}</h3>
              <p class="news-excerpt">${newsItem.excerpt}</p>
              <div class="news-meta">
                  <div class="news-date">
                      <i class="fa-regular fa-calendar"></i>
                      ${formattedDate}
                  </div>
                  <div class="news-source">
                      <i class="fa-regular fa-newspaper"></i>
                      ${newsItem.source}
                  </div>
              </div>
          </div>
      `;
      
      // Adiciona evento de clique para abrir o modal de detalhes
      card.addEventListener('click', () => {
          openNewsDetailModal(newsItem);
      });
      
      return card;
  };
  
  /**
   * Abre o modal com detalhes da notícia
   * @param {Object} newsItem - Dados da notícia
   */
  const openNewsDetailModal = (newsItem) => {
      const modal = document.getElementById('news-detail-modal');
      const modalContent = document.getElementById('news-detail-content');
      
      if (modal && modalContent) {
          // Formata a data para exibição
          const dateObj = new Date(newsItem.date);
          const formattedDate = dateObj.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
          });
          
          // Preenche o conteúdo do modal
          modalContent.innerHTML = `
              <h2>${newsItem.title}</h2>
              <div class="modal-meta">
                  <div class="news-category">${newsItem.category}</div>
                  <div class="news-date">
                      <i class="fa-regular fa-calendar"></i>
                      ${formattedDate}
                  </div>
                  <div class="news-source">
                      <i class="fa-regular fa-newspaper"></i>
                      ${newsItem.source}
                  </div>
              </div>
              <div class="modal-image">
                  <img src="${newsItem.imageUrl}" alt="${newsItem.title}">
              </div>
              <div class="modal-text">
                  <p>${newsItem.content}</p>
              </div>
              <div class="modal-actions">
                  <a href="${newsItem.url}" target="_blank" class="btn-primary">Ler matéria completa <i class="fa-solid fa-external-link-alt"></i></a>
                  <button class="btn-secondary share-btn"><i class="fa-solid fa-share-alt"></i> Compartilhar</button>
              </div>
          `;
          
          // Exibe o modal
          modal.style.display = 'block';
          
          // Adiciona evento para fechar o modal
          const closeButton = modal.querySelector('.close-modal');
          if (closeButton) {
              closeButton.addEventListener('click', () => {
                  modal.style.display = 'none';
              });
          }
          
          // Fecha o modal ao clicar fora do conteúdo
          modal.addEventListener('click', (e) => {
              if (e.target === modal) {
                  modal.style.display = 'none';
              }
          });
      }
  };
  
  /**
   * Atualiza as notícias com base no eSport selecionado
   * @param {string} esport - O eSport selecionado
   */
  const updateNews = async (esport) => {
      await loadNews(esport);
      await loadFullPageNews(esport);
  };
  
  // Expõe a API pública
  return {
      init,
      updateNews,
      loadNews,
      loadFullPageNews
  };
})();

// Exporta o módulo para uso em outros scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = News;
}