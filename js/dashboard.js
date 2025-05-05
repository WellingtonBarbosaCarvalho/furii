/**
 * Script principal para o dashboard
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Obtém o usuário logado
  const currentUser = Auth.getCurrentUser();
  
  // Se não houver usuário logado, redireciona para o login
  if (!currentUser) {
      window.location.href = 'index.html';
      return;
  }
  
  // Inicializa bibliotecas externas
  initializeExternalLibraries();
  
  // Inicializa a interface do usuário
  initializeUI(currentUser);
  
  // Inicializa os eventos
  initializeEvents();
  
  // Obtém o eSport favorito do usuário
  const userFavEsport = currentUser.favEsport || 'csgo';
  
  // Atualiza o seletor de eSport com a preferência do usuário
  updateEsportSelector(userFavEsport);
  
  // Mostra o loader
  showLoader();
  
  // Inicializa os dados do dashboard com base no eSport favorito
  await initializeDashboard(userFavEsport);
  
  // Esconde o loader
  hideLoader();
});

/**
* Inicializa bibliotecas externas
*/
function initializeExternalLibraries() {
  // Inicializa o AOS (Animate On Scroll)
  AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false
  });
  
  // Inicializa o banner slider
  initializeBannerSlider();
}

/**
* Inicializa o slider do banner
*/
function initializeBannerSlider() {
  const bannerSlider = document.querySelector('.banner-slider');
  
  if (bannerSlider) {
      // Cria slides dinâmicos
      const swiperWrapper = bannerSlider.querySelector('.swiper-wrapper');
      
      if (swiperWrapper) {
          // Slides de exemplo
          const slides = [
              {
                  image: 'assets/images/banner-1.jpg',
                  title: 'Bem-vindo ao FURIA App',
                  subtitle: 'Fique por dentro de tudo sobre a FURIA Esports e seus times favoritos.',
                  buttonText: 'Explorar',
                  buttonLink: '#'
              },
              {
                  image: 'assets/images/banner-2.jpg',
                  title: 'Acompanhe os jogos da FURIA',
                  subtitle: 'Calendário completo de todas as competições e torneios.',
                  buttonText: 'Ver Agenda',
                  buttonLink: '#schedule-section'
              },
              {
                  image: 'assets/images/banner-3.jpg',
                  title: 'Conheça nossos jogadores',
                  subtitle: 'Estatísticas, perfis e muito mais sobre nossos times.',
                  buttonText: 'Ver Time',
                  buttonLink: '#team-section'
              }
          ];
          
          // Adiciona cada slide ao wrapper
          slides.forEach(slide => {
              const slideDiv = document.createElement('div');
              slideDiv.className = 'swiper-slide';
              
              slideDiv.innerHTML = `
                  <div class="banner-slide" style="background-image: url('${slide.image}')">
                      <div class="banner-content" data-aos="fade-right" data-aos-delay="200">
                          <h1 class="banner-title">${slide.title}</h1>
                          <p class="banner-subtitle">${slide.subtitle}</p>
                          <div class="banner-buttons">
                              <a href="${slide.buttonLink}" class="btn-primary">${slide.buttonText} <i class="fa-solid fa-arrow-right"></i></a>
                          </div>
                      </div>
                  </div>
              `;
              
              swiperWrapper.appendChild(slideDiv);
          });
      }
      
      // Inicializa o Swiper
      new Swiper(bannerSlider, {
          slidesPerView: 1,
          spaceBetween: 0,
          loop: true,
          autoplay: {
              delay: 5000,
              disableOnInteraction: false,
          },
          navigation: {
              nextEl: '.banner-slider .swiper-button-next',
              prevEl: '.banner-slider .swiper-button-prev',
          },
          pagination: {
              el: '.banner-slider .swiper-pagination',
              clickable: true,
          },
          effect: 'fade',
          fadeEffect: {
              crossFade: true
          }
      });
  }
}

/**
* Inicializa a interface do usuário
* @param {Object} user - Dados do usuário logado
*/
function initializeUI(user) {
  // Atualiza as informações do usuário no header
  updateUserInfo(user);
  
  // Adiciona classes active para a navegação
  highlightActiveSection('home');
}

/**
* Atualiza as informações do usuário no header
* @param {Object} user - Dados do usuário logado
*/
function updateUserInfo(user) {
  const userNameElement = document.getElementById('user-name');
  const userEmailElement = document.getElementById('user-email');
  const userInitialElement = document.getElementById('user-initial');
  
  if (userNameElement && user.name) {
      userNameElement.textContent = user.name;
  }
  
  if (userEmailElement && user.email) {
      userEmailElement.textContent = user.email;
  }
  
  if (userInitialElement && user.name) {
      userInitialElement.textContent = user.name.charAt(0).toUpperCase();
  }
}

/**
* Atualiza o seletor de eSport
* @param {string} esport - O eSport selecionado
*/
function updateEsportSelector(esport) {
  const desktopSelector = document.getElementById('change-esport');
  const mobileSelector = document.getElementById('mobile-change-esport');
  
  if (desktopSelector) {
      desktopSelector.value = esport;
  }
  
  if (mobileSelector) {
      mobileSelector.value = esport;
  }
}

/**
* Inicializa os eventos da interface
*/
function initializeEvents() {
  // Evento para logout
  setupLogoutEvent();
  
  // Eventos de navegação
  setupNavigationEvents();
  
  // Eventos para o menu mobile
  setupMobileMenuEvents();
  
  // Eventos para alteração de eSport
  setupEsportChangeEvents();
  
  // Eventos para formulário de newsletter
  setupNewsletterFormEvent();
}

/**
* Configura o evento de logout
*/
function setupLogoutEvent() {
  const logoutBtn = document.getElementById('logout-btn');
  const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
  
  if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          Auth.logout();
      });
  }
  
  if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          Auth.logout();
      });
  }
}

/**
* Configura os eventos de navegação
*/
function setupNavigationEvents() {
  // Links da navegação principal
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          
          const section = link.getAttribute('data-section');
          navigateToSection(section);
      });
  });
  
  // Botões "Ver todos"
  const viewAllButtons = document.querySelectorAll('.view-all');
  
  viewAllButtons.forEach(button => {
      button.addEventListener('click', (e) => {
          e.preventDefault();
          
          const section = button.getAttribute('data-section');
          if (section) {
              navigateToSection(section);
          }
      });
  });
  
  // Botões de voltar
  const backButtons = document.querySelectorAll('.back-button');
  
  backButtons.forEach(button => {
      button.addEventListener('click', (e) => {
          e.preventDefault();
          navigateToSection('home');
      });
  });
}

/**
* Configura os eventos para o menu mobile
*/
function setupMobileMenuEvents() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const closeMobileNav = document.querySelector('.close-mobile-nav');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (mobileMenuBtn && mobileNav) {
      mobileMenuBtn.addEventListener('click', () => {
          mobileNav.classList.add('active');
          document.body.style.overflow = 'hidden';
      });
  }
  
  if (closeMobileNav && mobileNav) {
      closeMobileNav.addEventListener('click', () => {
          mobileNav.classList.remove('active');
          document.body.style.overflow = '';
      });
  }
}

/**
* Configura os eventos para alteração de eSport
*/
function setupEsportChangeEvents() {
  const desktopSelector = document.getElementById('change-esport');
  const mobileSelector = document.getElementById('mobile-change-esport');
  
  if (desktopSelector) {
      desktopSelector.addEventListener('change', () => {
          const selectedEsport = desktopSelector.value;
          changeEsport(selectedEsport);
      });
  }
  
  if (mobileSelector) {
      mobileSelector.addEventListener('change', () => {
          const selectedEsport = mobileSelector.value;
          changeEsport(selectedEsport);
          
          // Fecha o menu mobile após a seleção
          const mobileNav = document.querySelector('.mobile-nav');
          if (mobileNav) {
              mobileNav.classList.remove('active');
              document.body.style.overflow = '';
          }
      });
  }
}

/**
* Configura o evento para o formulário de newsletter
*/
function setupNewsletterFormEvent() {
  const newsletterForm = document.getElementById('newsletter-form');
  
  if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
          e.preventDefault();
          
          const emailInput = document.getElementById('newsletter-email');
          
          if (emailInput && emailInput.value) {
              // Simula envio do formulário
              showLoader();
              
              setTimeout(() => {
                  hideLoader();
                  
                  // Limpa o campo
                  emailInput.value = '';
                  
                  // Exibe mensagem de sucesso
                  showNotification('Obrigado por se inscrever em nossa newsletter!', 'success');
              }, 1000);
          }
      });
  }
}

/**
* Navega para uma seção específica
* @param {string} section - Nome da seção
*/
function navigateToSection(section) {
  // Oculta todas as seções
  const mainContent = document.getElementById('main-content');
  const fullpageSections = document.querySelectorAll('.fullpage-section');
  
  if (section === 'home') {
      // Mostra o conteúdo principal e oculta as páginas completas
      if (mainContent) {
          mainContent.style.display = 'block';
      }
      
      fullpageSections.forEach(section => {
          section.classList.remove('active');
      });
      
      // Mostra o banner para a página inicial
      const bannerSection = document.getElementById('banner-section');
      if (bannerSection) {
          bannerSection.style.display = 'block';
      }
  } else {
      // Oculta o conteúdo principal e mostra a página completa correspondente
      if (mainContent) {
          mainContent.style.display = 'none';
      }
      
      fullpageSections.forEach(sec => {
          if (sec.id === `${section}-fullpage`) {
              sec.classList.add('active');
          } else {
              sec.classList.remove('active');
          }
      });
      
      // Oculta o banner para as páginas internas
      const bannerSection = document.getElementById('banner-section');
      if (bannerSection) {
          bannerSection.style.display = 'none';
      }
  }
  
  // Atualiza a navegação ativa
  highlightActiveSection(section);
  
  // Rola a página para o topo
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
}

/**
* Destaca a seção ativa na navegação
* @param {string} section - Nome da seção
*/
function highlightActiveSection(section) {
  // Remove a classe active de todos os links
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  navLinks.forEach(link => {
      link.classList.remove('active');
  });
  
  // Adiciona a classe active ao link correspondente
  const activeLinks = document.querySelectorAll(`.nav-link[data-section="${section}"], .mobile-nav-link[data-section="${section}"]`);
  
  activeLinks.forEach(link => {
      link.classList.add('active');
  });
}

/**
* Muda o eSport selecionado
* @param {string} esport - O eSport selecionado
*/
async function changeEsport(esport) {
  // Atualiza os seletores
  updateEsportSelector(esport);
  
  // Mostra o loader
  showLoader();
  
  // Atualiza os dados do dashboard
  await updateDashboardContent(esport);
  
  // Esconde o loader
  hideLoader();
  
  // Salva a preferência do usuário
  saveUserEsportPreference(esport);
  
  // Exibe notificação
  showNotification(`Conteúdo atualizado para ${esport.toUpperCase()}!`, 'success');
}

/**
* Salva a preferência de eSport do usuário
* @param {string} esport - O eSport selecionado
*/
function saveUserEsportPreference(esport) {
  const currentUser = Auth.getCurrentUser();
  
  if (currentUser) {
      // Atualiza a preferência no objeto do usuário
      currentUser.favEsport = esport;
      
      // Salva no localStorage
      localStorage.setItem('furia_current_user', JSON.stringify(currentUser));
  }
}

/**
* Inicializa os dados do dashboard
* @param {string} esport - O eSport selecionado
*/
async function initializeDashboard(esport) {
  try {
      // Inicializa o módulo de notícias
      await News.init(esport);
      
      // Inicializa o módulo de times
      await Teams.init(esport);
      
      // Inicializa o módulo de trends
      await Trends.init(esport);
  } catch (error) {
      console.error('Erro ao inicializar dashboard:', error);
      hideLoader();
      showNotification('Erro ao carregar conteúdo. Por favor, tente novamente.', 'error');
  }
}

/**
* Atualiza o conteúdo do dashboard
* @param {string} esport - O eSport selecionado
*/
async function updateDashboardContent(esport) {
  try {
      // Atualiza notícias
      await News.updateNews(esport);
      
      // Atualiza time
      await Teams.updateTeam(esport);
      
      // Atualiza trends
      await Trends.updateTrends(esport);
  } catch (error) {
      console.error('Erro ao atualizar conteúdo:', error);
      showNotification('Erro ao atualizar conteúdo. Por favor, tente novamente.', 'error');
  }
}

/**
* Exibe o loader global
*/
function showLoader() {
  const loader = document.getElementById('global-loader');
  
  if (loader) {
      loader.classList.remove('hidden');
  }
}

/**
* Esconde o loader global
*/
function hideLoader() {
  const loader = document.getElementById('global-loader');
  
  if (loader) {
      loader.classList.add('hidden');
  }
}

/**
* Exibe uma notificação na tela
* @param {string} message - Mensagem da notificação
* @param {string} type - Tipo da notificação (success, error, info)
*/
function showNotification(message, type = 'info') {
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
}
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true
  });