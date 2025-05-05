/**
 * Script principal para a página de login
 */
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa Animate On Scroll
  AOS.init({
      duration: 800,
      easing: 'ease-in-out'
  });

  // Referência ao formulário de login
  const loginForm = document.getElementById('login-form');
  
  // Adiciona o evento de envio do formulário
  if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
  }

  // Cria usuário de demonstração se não existir nenhum
  createDemoUserIfNeeded();

  // Configura o fundo dinâmico
  setupDynamicBackground();
});

/**
* Manipula o evento de login
* @param {Event} event - Evento de submit do formulário
*/
function handleLogin(event) {
  event.preventDefault();
  
  // Obtém os valores dos campos
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const remember = document.getElementById('remember').checked;
  
  // Exibe loader enquanto processa
  showProcessingState();
  
  // Tenta fazer login usando o módulo Auth
  const result = Auth.login(email, password, remember);
  
  if (result.success) {
      // Exibe animação de sucesso
      showSuccessMessage(result.message);
      
      // Redireciona para o dashboard após um breve delay
      setTimeout(() => {
          window.location.href = 'dashboard.html';
      }, 1000);
  } else {
      // Exibe mensagem de erro
      showErrorMessage(result.message);
      
      // Remove o estado de processamento
      hideProcessingState();
  }
}

/**
* Exibe o estado de processamento no botão
*/
function showProcessingState() {
  const button = document.querySelector('.btn-primary');
  const originalText = button.innerHTML;
  
  // Salva o texto original e substitui por um spinner
  button.setAttribute('data-original-text', originalText);
  button.innerHTML = '<div class="loader" style="width: 20px; height: 20px; margin: 0;"></div>';
  button.disabled = true;
}

/**
* Remove o estado de processamento do botão
*/
function hideProcessingState() {
  const button = document.querySelector('.btn-primary');
  const originalText = button.getAttribute('data-original-text');
  
  button.innerHTML = originalText;
  button.disabled = false;
}

/**
* Exibe mensagem de sucesso
* @param {string} message - Mensagem a ser exibida
*/
function showSuccessMessage(message) {
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
      notification.style.color = 'white';
      document.body.appendChild(notification);
  }
  
  // Configura e exibe a notificação
  notification.textContent = message;
  notification.style.backgroundColor = '#4CAF50';
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

/**
* Exibe mensagem de erro
* @param {string} message - Mensagem a ser exibida
*/
function showErrorMessage(message) {
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
      notification.style.color = 'white';
      document.body.appendChild(notification);
  }
  
  // Configura e exibe a notificação
  notification.textContent = message;
  notification.style.backgroundColor = '#F44336';
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

/**
* Cria um usuário de demonstração se não existir nenhum
*/
function createDemoUserIfNeeded() {
  const users = localStorage.getItem('furia_app_users');
  
  // Se não houver usuários registrados, cria um de demonstração
  if (!users || JSON.parse(users).length === 0) {
      const demoUser = {
          name: 'Usuário Demo',
          email: 'demo@furia.gg',
          password: 'furia2023',
          favEsport: 'csgo',
          phone: '(11) 99999-9999',
          newsletter: true
      };
      
      Auth.register(demoUser);
      
      // Adiciona dica para login de demonstração
      const formContainer = document.querySelector('.form-container');
      
      if (formContainer) {
          const demoTip = document.createElement('div');
          demoTip.className = 'demo-tip';
          demoTip.style.marginTop = '20px';
          demoTip.style.padding = '10px';
          demoTip.style.backgroundColor = 'rgba(0, 229, 255, 0.1)';
          demoTip.style.borderRadius = '4px';
          demoTip.style.fontSize = '13px';
          demoTip.style.textAlign = 'center';
          
          demoTip.innerHTML = `
              <p><strong>Dica:</strong> Use o login de demonstração</p>
              <p>Email: <span style="color: var(--accent-color)">demo@furia.gg</span></p>
              <p>Senha: <span style="color: var(--accent-color)">furia2023</span></p>
          `;
          
          formContainer.appendChild(demoTip);
      }
  }
}

/**
* Configura o fundo dinâmico com imagens de jogos da FURIA
*/
function setupDynamicBackground() {
  const esportsBg = document.querySelector('.esports-background');
  if (!esportsBg) return;
  
  // Lista de jogos/modalidades da FURIA
  const games = ['csgo', 'valorant', 'lol', 'fortnite', 'pubg', 'apex'];
  let currentIndex = 0;
  
  // Alterna o background a cada 5 segundos
  setInterval(() => {
      currentIndex = (currentIndex + 1) % games.length;
      const game = games[currentIndex];
      
      // Anima a transição
      esportsBg.style.opacity = '0';
      
      setTimeout(() => {
          esportsBg.style.backgroundImage = `url('assets/images/bg-${game}.jpg')`;
          esportsBg.style.opacity = '1';
      }, 500);
  }, 5000);
  
  // Configura a animação de transição
  esportsBg.style.transition = 'opacity 0.5s ease-in-out';
}