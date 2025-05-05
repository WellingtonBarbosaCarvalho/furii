/**
 * Script principal para a página de registro
 */
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa Animate On Scroll
  AOS.init({
      duration: 800,
      easing: 'ease-in-out'
  });

  // Referência ao formulário de registro
  const registerForm = document.getElementById('register-form');
  
  // Adiciona o evento de envio do formulário
  if (registerForm) {
      registerForm.addEventListener('submit', handleRegister);
  }
  
  // Configura os links de termos
  setupTermsLinks();
  
  // Configura o fundo dinâmico
  setupDynamicBackground();
  
  // Configura o campo de telefone
  setupPhoneMask();
});

/**
* Manipula o evento de registro
* @param {Event} event - Evento de submit do formulário
*/
function handleRegister(event) {
  event.preventDefault();
  
  // Obtém os valores dos campos
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const phone = document.getElementById('phone').value;
  const favEsport = document.getElementById('fav-esport').value;
  const acceptedTerms = document.getElementById('terms').checked;
  const newsletter = document.getElementById('newsletter').checked;
  
  // Validações básicas
  if (password !== confirmPassword) {
      showErrorMessage('As senhas não coincidem.');
      return;
  }
  
  if (password.length < 6) {
      showErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
  }
  
  if (!acceptedTerms) {
      showErrorMessage('Você precisa aceitar os termos de uso.');
      return;
  }
  
  // Exibe loader enquanto processa
  showProcessingState();
  
  // Objeto de dados do usuário
  const userData = {
      name,
      email,
      password,
      phone,
      favEsport,
      newsletter
  };
  
  // Tenta registrar o usuário usando o módulo Auth
  const result = Auth.register(userData);
  
  if (result.success) {
      // Exibe animação de sucesso
      showSuccessMessage(result.message);
      
      // Efetua login automático
      Auth.login(email, password, true);
      
      // Redireciona para o dashboard após um breve delay
      setTimeout(() => {
          window.location.href = 'dashboard.html';
      }, 1500);
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
* Configura os links para exibir o modal de termos
*/
function setupTermsLinks() {
  const termsLinks = document.querySelectorAll('.terms-link');
  const modal = document.getElementById('terms-modal');
  const closeModal = document.querySelector('.close-modal');
  
  // Adiciona evento de clique para abrir o modal
  termsLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          modal.style.display = 'block';
          document.body.style.overflow = 'hidden';
      });
  });
  
  // Adiciona evento de clique para fechar o modal
  closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
  });
  
  // Fecha o modal ao clicar fora dele
  window.addEventListener('click', (e) => {
      if (e.target === modal) {
          modal.style.display = 'none';
          document.body.style.overflow = '';
      }
  });
}

/**
* Configura máscara para o campo de telefone
*/
function setupPhoneMask() {
  const phoneInput = document.getElementById('phone');
  
  if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
          let value = e.target.value.replace(/\D/g, '');
          
          if (value.length > 0) {
              // Formata como (XX) XXXXX-XXXX
              if (value.length <= 2) {
                  value = `(${value}`;
              } else if (value.length <= 7) {
                  value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
              } else if (value.length <= 11) {
                  value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
              } else {
                  value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
              }
          }
          
          e.target.value = value;
      });
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