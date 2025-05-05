/**
 * Módulo de Times
 * Gerencia a obtenção e exibição de informações do time
 */
const Teams = (() => {
  // Referências ao Swiper
  let teamSwiper = null;
  
  /**
   * Inicializa o módulo de times
   * @param {string} esport - O eSport selecionado
   */
  const init = async (esport) => {
      try {
          await loadTeam(esport);
          await loadFullPageTeam(esport);
          initializeSchedule(esport);
      } catch (error) {
          console.error('Erro ao inicializar módulo de times:', error);
      }
  };
  
  /**
   * Inicializa o Swiper para o carrossel de jogadores
   */
  const initializeTeamSlider = () => {
      const teamSlider = document.querySelector('.team-slider');
      
      if (teamSlider) {
          // Destrói o Swiper existente se houver
          if (teamSwiper) {
              teamSwiper.destroy();
          }
          
          // Inicializa o novo Swiper
          teamSwiper = new Swiper(teamSlider, {
              slidesPerView: 1,
              spaceBetween: 20,
              loop: true,
              autoplay: {
                  delay: 5000,
                  disableOnInteraction: false,
              },
              navigation: {
                  nextEl: '.team-slider .swiper-button-next',
                  prevEl: '.team-slider .swiper-button-prev',
              },
              pagination: {
                  el: '.team-slider .swiper-pagination',
                  clickable: true,
              },
              breakpoints: {
                  640: {
                      slidesPerView: 2,
                      spaceBetween: 15,
                  },
                  768: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                  },
                  1024: {
                      slidesPerView: 4,
                      spaceBetween: 20,
                  },
              },
          });
      }
  };
  
  /**
   * Carrega informações do time para a seção principal
   * @param {string} esport - O eSport selecionado
   */
  const loadTeam = async (esport) => {
      try {
          // Obtém os dados do time através do módulo API
          const teamData = await API.getTeamDetails(esport);
          
          // Seleciona o container de jogadores
          const teamPlayers = document.getElementById('team-players');
          
          // Limpa o conteúdo atual
          if (teamPlayers) {
              teamPlayers.innerHTML = '';
              
              // Adiciona cada jogador ao carrossel
              teamData.players.forEach(player => {
                  const playerCard = createPlayerCard(player, esport);
                  teamPlayers.appendChild(playerCard);
              });
              
              // Inicializa o slider após adicionar os jogadores
              initializeTeamSlider();
          }
      } catch (error) {
          console.error('Erro ao carregar informações do time:', error);
      }
  };
  
  /**
   * Carrega informações do time para a página completa
   * @param {string} esport - O eSport selecionado
   */
  const loadFullPageTeam = async (esport) => {
      try {
          // Obtém os dados do time através do módulo API
          const teamData = await API.getTeamDetails(esport);
          
          // Seleciona o container de jogadores da página completa
          const teamFullpageGrid = document.getElementById('team-fullpage-grid');
          
          // Limpa o conteúdo atual
          if (teamFullpageGrid) {
              teamFullpageGrid.innerHTML = '';
              
              // Adiciona detalhes da equipe no topo
              const teamHeader = document.createElement('div');
              teamHeader.className = 'team-header';
              teamHeader.innerHTML = `
                  <div class="team-info">
                      <div class="team-logo">
                          <img src="${teamData.logoUrl}" alt="${teamData.name}">
                      </div>
                      <div class="team-details">
                          <h3>${teamData.name} - ${esport.toUpperCase()}</h3>
                          <p>Coach: <span>${teamData.coach.name} "${teamData.coach.nickname}"</span></p>
                          <div class="team-achievements">
                              ${teamData.achievements.map(achievement => 
                                  `<div class="achievement">
                                      <i class="fa-solid fa-trophy"></i>
                                      <span>${achievement.title} (${achievement.year})</span>
                                  </div>`
                              ).join('')}
                          </div>
                      </div>
                  </div>
              `;
              teamFullpageGrid.appendChild(teamHeader);
              
              // Adiciona um título para a seção de jogadores
              const playersTitle = document.createElement('h3');
              playersTitle.className = 'players-title';
              playersTitle.innerHTML = 'Jogadores';
              teamFullpageGrid.appendChild(playersTitle);
              
              // Container para os cards de jogadores
              const playersGrid = document.createElement('div');
              playersGrid.className = 'players-grid';
              
              // Adiciona cada jogador ao grid
              teamData.players.forEach(player => {
                  const playerCard = createPlayerCard(player, esport);
                  playersGrid.appendChild(playerCard);
              });
              
              teamFullpageGrid.appendChild(playersGrid);
          }
      } catch (error) {
          console.error('Erro ao carregar página completa do time:', error);
      }
  };
  
  /**
   * Cria um card de jogador
   * @param {Object} player - Dados do jogador
   * @param {string} esport - O eSport selecionado
   * @returns {HTMLElement} - Elemento HTML do card
   */
  const createPlayerCard = (player, esport) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    
    const card = document.createElement('div');
    card.className = 'player-card glassmorphism';
    card.dataset.id = player.id;
    card.dataset.role = player.role.toLowerCase();
    
    // Diferentes estatísticas baseadas no eSport
    let statsHtml = '';
    
    if (esport === 'csgo') {
        statsHtml = `
            <div class="player-stats">
                <div class="player-stat">
                    <div class="stat-circle">
                        <svg viewBox="0 0 36 36">
                            <path class="stat-circle-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path class="stat-circle-fill" stroke-dasharray="${player.stats.rating * 30}, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span class="stat-circle-text">${player.stats.rating}</span>
                    </div>
                    <span class="stat-label">Rating</span>
                </div>
                <div class="player-stat">
                    <div class="stat-circle">
                        <svg viewBox="0 0 36 36">
                            <path class="stat-circle-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path class="stat-circle-fill" stroke-dasharray="${player.stats.kd * 25}, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span class="stat-circle-text">${player.stats.kd}</span>
                    </div>
                    <span class="stat-label">K/D</span>
                </div>
                <div class="player-stat">
                    <div class="stat-circle">
                        <svg viewBox="0 0 36 36">
                            <path class="stat-circle-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path class="stat-circle-fill" stroke-dasharray="${player.stats.hs * 0.6}, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span class="stat-circle-text">${player.stats.hs}%</span>
                    </div>
                    <span class="stat-label">HS%</span>
                </div>
            </div>
        `;
    } else if (esport === 'valorant') {
        statsHtml = `
            <div class="player-stats">
                <div class="player-stat">
                    <div class="stat-circle">
                        <svg viewBox="0 0 36 36">
                            <path class="stat-circle-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path class="stat-circle-fill" stroke-dasharray="${player.stats.acs * 0.12}, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span class="stat-circle-text">${player.stats.acs}</span>
                    </div>
                    <span class="stat-label">ACS</span>
                </div>
                <div class="player-stat">
                    <div class="stat-circle">
                        <svg viewBox="0 0 36 36">
                            <path class="stat-circle-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path class="stat-circle-fill" stroke-dasharray="${player.stats.kd * 25}, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span class="stat-circle-text">${player.stats.kd}</span>
                    </div>
                    <span class="stat-label">K/D</span>
                </div>
                <div class="player-stat">
                    <div class="stat-circle">
                        <svg viewBox="0 0 36 36">
                            <path class="stat-circle-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path class="stat-circle-fill" stroke-dasharray="${player.stats.hs * 0.6}, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span class="stat-circle-text">${player.stats.hs}%</span>
                    </div>
                    <span class="stat-label">HS%</span>
                </div>
            </div>
        `;
    } else if (esport === 'lol') {
        statsHtml = `
            <div class="player-stats">
                <div class="player-stat">
                    <div class="stat-circle">
                        <svg viewBox="0 0 36 36">
                            <path class="stat-circle-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path class="stat-circle-fill" stroke-dasharray="${player.stats.kda * 10}, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span class="stat-circle-text">${player.stats.kda}</span>
                    </div>
                    <span class="stat-label">KDA</span>
                </div>
                <div class="player-stat">
                    <div class="stat-circle">
                        <svg viewBox="0 0 36 36">
                            <path class="stat-circle-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path class="stat-circle-fill" stroke-dasharray="${player.stats.cs * 6}, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span class="stat-circle-text">${player.stats.cs}</span>
                    </div>
                    <span class="stat-label">CS/m</span>
                </div>
                <div class="player-stat">
                    <div class="stat-circle">
                        <svg viewBox="0 0 36 36">
                            <path class="stat-circle-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path class="stat-circle-fill" stroke-dasharray="${player.stats.vision * 15}, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span class="stat-circle-text">${player.stats.vision}</span>
                    </div>
                    <span class="stat-label">Vision</span>
                </div>
            </div>
        `;
    }
    
    card.innerHTML = `
        <div class="player-image">
            <img src="${player.imageUrl}" alt="${player.nickname}" loading="lazy">
            <div class="player-image-overlay"></div>
        </div>
        <div class="player-role-badge" data-role="${player.role.toLowerCase()}">${player.role}</div>
        <div class="player-content">
            <h3 class="player-nickname">${player.nickname}</h3>
            <p class="player-name">${player.name}</p>
            ${statsHtml}
        </div>
        <div class="player-card-overlay">
            <div class="overlay-content">
                <span class="view-profile">Ver perfil</span>
                <i class="fa-solid fa-circle-info"></i>
            </div>
        </div>
    `;
    
    // Adiciona evento de clique para abrir o modal de detalhes
    card.addEventListener('click', () => {
        openPlayerDetailModal(player, esport);
    });
    
    slide.appendChild(card);
    return slide;
};
  
  /**
   * Abre o modal com detalhes do jogador
   * @param {Object} player - Dados do jogador
   * @param {string} esport - O eSport selecionado
   */
  const openPlayerDetailModal = (player, esport) => {
      const modal = document.getElementById('player-detail-modal');
      const modalContent = document.getElementById('player-detail-content');
      
      if (modal && modalContent) {
          // Diferentes estatísticas baseadas no eSport
          let statsHtml = '';
          let achievementsHtml = '';
          
          // Simula algumas conquistas para o jogador
          const achievements = [
              { title: 'MVP da Temporada', year: '2023' },
              { title: 'Campeão Nacional', year: '2022' },
              { title: 'All-Star', year: '2021' }
          ];
          
          // Gera HTML para as conquistas
          achievementsHtml = `
              <div class="player-achievements">
                  <h4>Conquistas</h4>
                  <ul>
                      ${achievements.map(achievement => 
                          `<li><i class="fa-solid fa-trophy"></i> ${achievement.title} (${achievement.year})</li>`
                      ).join('')}
                  </ul>
              </div>
          `;
          
          if (esport === 'csgo') {
              statsHtml = `
                  <div class="player-detail-stats">
                      <div class="stat-row">
                          <span class="stat-name">Rating</span>
                          <div class="stat-bar">
                              <div class="stat-fill" style="width: ${player.stats.rating * 50}%"></div>
                          </div>
                          <span class="stat-value">${player.stats.rating}</span>
                      </div>
                      <div class="stat-row">
                          <span class="stat-name">K/D</span>
                          <div class="stat-bar">
                              <div class="stat-fill" style="width: ${player.stats.kd * 40}%"></div>
                          </div>
                          <span class="stat-value">${player.stats.kd}</span>
                      </div>
                      <div class="stat-row">
                          <span class="stat-name">Headshot %</span>
                          <div class="stat-bar">
                              <div class="stat-fill" style="width: ${player.stats.hs * 0.8}%"></div>
                          </div>
                          <span class="stat-value">${player.stats.hs}%</span>
                      </div>
                  </div>
              `;
          } else if (esport === 'valorant') {
              statsHtml = `
                  <div class="player-detail-stats">
                      <div class="stat-row">
                          <span class="stat-name">ACS</span>
                          <div class="stat-bar">
                              <div class="stat-fill" style="width: ${player.stats.acs * 0.3}%"></div>
                          </div>
                          <span class="stat-value">${player.stats.acs}</span>
                      </div>
                      <div class="stat-row">
                          <span class="stat-name">K/D</span>
                          <div class="stat-bar">
                              <div class="stat-fill" style="width: ${player.stats.kd * 40}%"></div>
                          </div>
                          <span class="stat-value">${player.stats.kd}</span>
                      </div>
                      <div class="stat-row">
                          <span class="stat-name">Headshot %</span>
                          <div class="stat-bar">
                              <div class="stat-fill" style="width: ${player.stats.hs * 0.8}%"></div>
                          </div>
                          <span class="stat-value">${player.stats.hs}%</span>
                      </div>
                  </div>
              `;
          } else if (esport === 'lol') {
              statsHtml = `
                  <div class="player-detail-stats">
                      <div class="stat-row">
                          <span class="stat-name">KDA</span>
                          <div class="stat-bar">
                              <div class="stat-fill" style="width: ${player.stats.kda * 15}%"></div>
                          </div>
                          <span class="stat-value">${player.stats.kda}</span>
                      </div>
                      <div class="stat-row">
                          <span class="stat-name">CS/min</span>
                          <div class="stat-bar">
                              <div class="stat-fill" style="width: ${player.stats.cs * 8}%"></div>
                          </div>
                          <span class="stat-value">${player.stats.cs}</span>
                      </div>
                      <div class="stat-row">
                          <span class="stat-name">Vision Score</span>
                          <div class="stat-bar">
                              <div class="stat-fill" style="width: ${player.stats.vision * 30}%"></div>
                          </div>
                          <span class="stat-value">${player.stats.vision}</span>
                      </div>
                  </div>
              `;
          }
          
          // Preenche o conteúdo do modal
          modalContent.innerHTML = `
              <div class="player-detail-header">
                  <div class="player-detail-image">
                      <img src="${player.imageUrl}" alt="${player.nickname}">
                  </div>
                  <div class="player-detail-info">
                      <span class="player-detail-role">${player.role}</span>
                      <h2 class="player-detail-nickname">${player.nickname}</h2>
                      <h3 class="player-detail-name">${player.name}</h3>
                      <p class="player-detail-country"><i class="fa-solid fa-globe"></i> ${player.country}</p>
                  </div>
              </div>
              
              <div class="player-detail-content">
                  <div class="player-detail-tabs">
                      <button class="tab-button active" data-tab="stats">Estatísticas</button>
                      <button class="tab-button" data-tab="achievements">Conquistas</button>
                      <button class="tab-button" data-tab="info">Informações</button>
                  </div>
                  
                  <div class="tab-content active" data-tab="stats">
                      <h4>Estatísticas recentes</h4>
                      ${statsHtml}
                  </div>
                  
                  <div class="tab-content" data-tab="achievements">
                      ${achievementsHtml}
                  </div>
                  
                  <div class="tab-content" data-tab="info">
                      <div class="player-bio">
                          <h4>Biografia</h4>
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.</p>
                      </div>
                      
                      <div class="player-social">
                          <h4>Redes Sociais</h4>
                          <div class="social-links">
                              <a href="#" class="social-link"><i class="fa-brands fa-twitter"></i> Twitter</a>
                              <a href="#" class="social-link"><i class="fa-brands fa-instagram"></i> Instagram</a>
                              <a href="#" class="social-link"><i class="fa-brands fa-twitch"></i> Twitch</a>
                          </div>
                      </div>
                  </div>
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
          
          // Adiciona eventos para as abas
          const tabButtons = modalContent.querySelectorAll('.tab-button');
          const tabContents = modalContent.querySelectorAll('.tab-content');
          
          tabButtons.forEach(button => {
              button.addEventListener('click', () => {
                  const tab = button.dataset.tab;
                  
                  // Remove a classe active de todos os botões e conteúdos
                  tabButtons.forEach(btn => btn.classList.remove('active'));
                  tabContents.forEach(content => content.classList.remove('active'));
                  
                  // Adiciona a classe active ao botão e conteúdo clicado
                  button.classList.add('active');
                  modalContent.querySelector(`.tab-content[data-tab="${tab}"]`).classList.add('active');
              });
          });
      }
  };
  
  /**
   * Inicializa a seção de agenda de jogos
   * @param {string} esport - O eSport selecionado
   */
  const initializeSchedule = async (esport) => {
      try {
          // Obtém os jogos através do módulo API
          const matches = await API.getMatchSchedule(esport, 5);
          
          // Seleciona o container de jogos
          const scheduleList = document.getElementById('schedule-list');
          const nextMatchWidget = document.getElementById('next-match-widget');
          
          // Limpa o conteúdo atual
          if (scheduleList) {
              scheduleList.innerHTML = '';
              
              // Adiciona cada jogo à lista
              matches.forEach((match, index) => {
                  const matchCard = createMatchCard(match);
                  scheduleList.appendChild(matchCard);
                  
                  // Usa o primeiro jogo como o próximo jogo no widget
                  if (index === 0 && nextMatchWidget) {
                      loadNextMatch(match);
                  }
              });
          }
          
          // Carrega a página completa de agenda
          await loadFullPageSchedule(esport);
      } catch (error) {
          console.error('Erro ao inicializar agenda de jogos:', error);
      }
  };
  
  /**
   * Carrega a agenda completa para a página de agenda
   * @param {string} esport - O eSport selecionado
   */
  const loadFullPageSchedule = async (esport) => {
      try {
          // Obtém mais jogos para a página completa
          const matches = await API.getMatchSchedule(esport, 10);
          
          // Seleciona o container de jogos da página completa
          const scheduleFullpageList = document.getElementById('schedule-fullpage-list');
          
          // Limpa o conteúdo atual
          if (scheduleFullpageList) {
              scheduleFullpageList.innerHTML = '';
              
              // Adiciona cada jogo à lista
              matches.forEach(match => {
                  const matchCard = createMatchCard(match);
                  scheduleFullpageList.appendChild(matchCard);
              });
          }
      } catch (error) {
          console.error('Erro ao carregar página completa de agenda:', error);
      }
  };
  
  /**
   * Cria um card de jogo
   * @param {Object} match - Dados do jogo
   * @returns {HTMLElement} - Elemento HTML do card
   */
  const createMatchCard = (match) => {
      const card = document.createElement('div');
      card.className = 'match-card';
      
      // Formata a data para exibição
      const matchDate = new Date(match.date);
      const formattedDate = matchDate.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
      });
      
      const formattedTime = matchDate.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
      });
      
      card.innerHTML = `
          <div class="match-teams">
              <div class="team-furia">
                  <img src="assets/images/furia-logo.png" alt="FURIA" class="team-logo">
                  <span class="team-name">FURIA</span>
              </div>
              <span class="vs">vs</span>
              <div class="team-opponent">
                  <img src="${match.opponent.logoUrl}" alt="${match.opponent.name}" class="team-logo">
                  <span class="team-name">${match.opponent.name}</span>
              </div>
          </div>
          
          <div class="match-info">
              <div class="match-tournament">${match.tournament} • ${match.format}</div>
              <div class="match-date">
                  <i class="fa-regular fa-calendar"></i>
                  ${formattedDate} ${formattedTime}
              </div>
          </div>
          
          <div class="match-actions">
              <button class="match-reminder" title="Receber lembrete">
                  <i class="fa-regular fa-bell"></i>
              </button>
          </div>
      `;
      
      // Adiciona evento para o botão de lembrete
      const reminderButton = card.querySelector('.match-reminder');
      if (reminderButton) {
          reminderButton.addEventListener('click', (e) => {
              e.stopPropagation(); // Impede propagação do evento
              toggleReminderButton(reminderButton);
          });
      }
      
      // Adiciona evento de clique no card para abrir link externo
      card.addEventListener('click', () => {
          if (match.link) {
              window.open(match.link, '_blank');
          }
      });
      
      return card;
  };
  
  /**
   * Alterna o estado do botão de lembrete
   * @param {HTMLElement} button - O botão de lembrete
   */
  const toggleReminderButton = (button) => {
      button.classList.toggle('active');
      
      if (button.classList.contains('active')) {
          button.innerHTML = '<i class="fa-solid fa-bell"></i>';
          button.title = 'Lembrete ativado';
          
          // Exibe notificação
          showNotification('Lembrete ativado! Você receberá uma notificação antes do jogo.', 'success');
      } else {
          button.innerHTML = '<i class="fa-regular fa-bell"></i>';
          button.title = 'Receber lembrete';
          
          // Exibe notificação
          showNotification('Lembrete desativado!', 'info');
      }
  };
  
  /**
   * Carrega o próximo jogo no widget
   * @param {Object} match - Dados do próximo jogo
   */
  const loadNextMatch = (match) => {
      const nextMatchWidget = document.getElementById('next-match-widget');
      
      if (nextMatchWidget) {
          const nextMatchContent = nextMatchWidget.querySelector('.next-match-content');
          
          if (nextMatchContent) {
              // Formata a data para exibição
              const matchDate = new Date(match.date);
              const formattedDate = matchDate.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
              });
              
              const formattedTime = matchDate.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
              });
              
              // Calcula o countdown
              const now = new Date();
              const diffTime = matchDate - now;
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              
              let countdownText = '';
              if (diffDays > 0) {
                  countdownText = `${diffDays}d ${diffHours}h`;
              } else if (diffHours > 0) {
                  countdownText = `${diffHours}h`;
              } else {
                  countdownText = 'Em breve';
              }
              
              nextMatchContent.innerHTML = `
                  <div class="next-match-card">
                      <div class="next-match-tournament">${match.tournament} • ${match.format}</div>
                      
                      <div class="next-match-teams">
                          <div class="next-team next-furia">
                              <img src="assets/images/furia-logo.png" alt="FURIA" class="next-team-logo">
                              <span class="next-team-name">FURIA</span>
                          </div>
                          
                          <div class="next-vs">VS</div>
                          
                          <div class="next-team">
                              <img src="${match.opponent.logoUrl}" alt="${match.opponent.name}" class="next-team-logo">
                              <span class="next-team-name">${match.opponent.name}</span>
                          </div>
                      </div>
                      
                      <div class="next-match-time">
                          <div class="next-match-date">
                              <i class="fa-regular fa-calendar"></i>
                              ${formattedDate} ${formattedTime}
                          </div>
                          <div class="next-match-countdown">${countdownText}</div>
                      </div>
                      
                      <div class="next-match-actions">
                          <button class="btn-reminder"><i class="fa-regular fa-bell"></i> Lembrete</button>
                          <button class="btn-watch"><i class="fa-solid fa-play"></i> Assistir</button>
                      </div>
                  </div>
              `;
              
              // Adiciona evento para o botão de lembrete
              const reminderButton = nextMatchContent.querySelector('.btn-reminder');
              if (reminderButton) {
                  reminderButton.addEventListener('click', () => {
                      toggleNextMatchReminder(reminderButton);
                  });
              }
              
              // Adiciona evento para o botão de assistir
              const watchButton = nextMatchContent.querySelector('.btn-watch');
              if (watchButton) {
                  watchButton.addEventListener('click', () => {
                      if (match.link) {
                          window.open(match.link, '_blank');
                      } else {
                          showNotification('O link para assistir ainda não está disponível.', 'info');
                      }
                  });
              }
          }
      }
  };
  
  /**
   * Alterna o estado do botão de lembrete do próximo jogo
   * @param {HTMLElement} button - O botão de lembrete
   */
  const toggleNextMatchReminder = (button) => {
      button.classList.toggle('active');
      
      if (button.classList.contains('active')) {
          button.innerHTML = '<i class="fa-solid fa-bell"></i> Ativado';
          
          // Exibe notificação
          showNotification('Lembrete ativado! Você receberá uma notificação antes do jogo.', 'success');
      } else {
          button.innerHTML = '<i class="fa-regular fa-bell"></i> Lembrete';
          
          // Exibe notificação
          showNotification('Lembrete desativado!', 'info');
      }
  };
  
  /**
   * Exibe uma notificação na tela
   * @param {string} message - Mensagem da notificação
   * @param {string} type - Tipo da notificação (success, error, info)
   */
  const showNotification = (message, type = 'info') => {
      // Cria elemento de notificação se não existir
      let notification = document.querySelector('.notification');
      
      if (!notification) {
          notification = document.createElement('div');
          notification.className = 'notification animate__animated';
          notification.style.position = 'fixed';
          notification.style.top = '20px';
          notification.style.right = '20px';
          notification.style.padding = '12px 20px';
          notification.style.borderRadius = '4px';
          notification.style.zIndex = '1000';
          notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          notification.style.fontSize = '14px';
          document.body.appendChild(notification);
      }
      
      // Configura cor baseada no tipo
      let bgColor = '#2196F3'; // info
      if (type === 'success') {
          bgColor = '#4CAF50';
      } else if (type === 'error') {
          bgColor = '#F44336';
      }
      
      // Configura e exibe a notificação
      notification.textContent = message;
      notification.style.backgroundColor = bgColor;
      notification.classList.remove('animate__fadeOut');
      notification.classList.add('animate__fadeIn');
      notification.style.display = 'block';
      
      // Remove após 3 segundos
      setTimeout(() => {
          notification.classList.remove('animate__fadeIn');
          notification.classList.add('animate__fadeOut');
          
          setTimeout(() => {
              notification.style.display = 'none';
          }, 500);
      }, 3000);
  };
  
  /**
   * Atualiza as informações do time com base no eSport selecionado
   * @param {string} esport - O eSport selecionado
   */
  const updateTeam = async (esport) => {
      await loadTeam(esport);
      await loadFullPageTeam(esport);
      await initializeSchedule(esport);
  };
  
  // Expõe a API pública
  return {
      init,
      updateTeam,
      loadTeam,
      loadFullPageTeam,
      initializeSchedule
  };
})();

// Exporta o módulo para uso em outros scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Teams;
}