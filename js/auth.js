/**
 * Módulo de Autenticação
 * Gerencia o login, registro e persistência de usuários
 */
const Auth = (() => {
  // Chave para armazenamento dos usuários no localStorage
  const USERS_STORAGE_KEY = 'furia_app_users';
  const CURRENT_USER_KEY = 'furia_current_user';

  /**
   * Verifica se o email já está registrado
   * @param {string} email - Email a ser verificado
   * @returns {boolean} - Verdadeiro se o email já existir
   */
  const isEmailRegistered = (email) => {
      const users = getUsers();
      return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  };

  /**
   * Obtém a lista de usuários registrados
   * @returns {Array} - Array de usuários
   */
  const getUsers = () => {
      const usersJSON = localStorage.getItem(USERS_STORAGE_KEY);
      return usersJSON ? JSON.parse(usersJSON) : [];
  };

  /**
   * Salva a lista de usuários no localStorage
   * @param {Array} users - Array de usuários
   */
  const saveUsers = (users) => {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  /**
   * Registra um novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Object} - Objeto com status e mensagem
   */
  const register = (userData) => {
      // Verifica se o email já está registrado
      if (isEmailRegistered(userData.email)) {
          return {
              success: false,
              message: 'Este email já está registrado. Tente fazer login.'
          };
      }

      // Adiciona o usuário à lista
      const users = getUsers();
      
      // Cria um novo usuário com ID único
      const newUser = {
          id: Date.now().toString(),
          ...userData,
          createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      saveUsers(users);

      return {
          success: true,
          message: 'Usuário registrado com sucesso!',
          user: newUser
      };
  };

  /**
   * Efetua o login do usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @param {boolean} remember - Lembrar usuário
   * @returns {Object} - Objeto com status e mensagem
   */
  const login = (email, password, remember = false) => {
      const users = getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      // Verifica se o usuário existe
      if (!user) {
          return {
              success: false,
              message: 'Usuário não encontrado.'
          };
      }

      // Verifica se a senha está correta
      if (user.password !== password) {
          return {
              success: false,
              message: 'Senha incorreta.'
          };
      }

      // Cria uma cópia do usuário sem a senha
      const userWithoutPassword = {...user};
      delete userWithoutPassword.password;
      
      // Salva o usuário atual no localStorage
      const currentUser = {
          ...userWithoutPassword,
          remember,
          lastLogin: new Date().toISOString()
      };
      
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

      return {
          success: true,
          message: 'Login efetuado com sucesso!',
          user: currentUser
      };
  };

  /**
   * Efetua o logout do usuário
   */
  const logout = () => {
      localStorage.removeItem(CURRENT_USER_KEY);
      window.location.href = 'index.html';
  };

  /**
   * Verifica se há um usuário logado
   * @returns {Object|null} - Usuário logado ou null
   */
  const getCurrentUser = () => {
      const userJSON = localStorage.getItem(CURRENT_USER_KEY);
      return userJSON ? JSON.parse(userJSON) : null;
  };

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean} - Verdadeiro se o usuário estiver autenticado
   */
  const isAuthenticated = () => {
      return !!getCurrentUser();
  };

  /**
   * Redireciona para o dashboard se estiver logado
   * ou para o login se não estiver
   */
  const checkAuth = () => {
      const isLoginPage = window.location.pathname.includes('index.html') || 
                         window.location.pathname.endsWith('/');
      const isRegisterPage = window.location.pathname.includes('register.html');
      
      if (isAuthenticated()) {
          // Se estiver na página de login ou registro e já estiver autenticado
          if (isLoginPage || isRegisterPage) {
              window.location.href = 'dashboard.html';
          }
      } else {
          // Se não estiver autenticado e não estiver na página de login ou registro
          if (!isLoginPage && !isRegisterPage) {
              window.location.href = 'index.html';
          }
      }
  };

  // Verificação automática de autenticação
  window.addEventListener('DOMContentLoaded', checkAuth);

  // Expõe a API pública
  return {
      register,
      login,
      logout,
      getCurrentUser,
      isAuthenticated,
      checkAuth
  };
})();

// Exporta o módulo para uso em outros scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Auth;
}