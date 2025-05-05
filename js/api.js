/**
 * Módulo de API
 * Gerencia todas as chamadas de API externas
 */
const API = (() => {
  // Chaves de API (estas seriam idealmente armazenadas no backend em ambiente de produção)
  const API_KEYS = {
    newsapi: "YOUR_NEWSAPI_KEY",
    gnews: "YOUR_GNEWS_KEY",
    mediastack: "YOUR_MEDIASTACK_KEY",
    pandascore: "YOUR_PANDASCORE_KEY",
    twitter: "YOUR_TWITTER_KEY",
    serpapi: "YOUR_SERPAPI_KEY",
    youtube: "YOUR_YOUTUBE_KEY",
    twitch: "YOUR_TWITCH_KEY",
  };

  // URLs base das APIs
  const API_URLS = {
    newsapi: "https://newsapi.org/v2",
    gnews: "https://gnews.io/api/v4",
    mediastack: "http://api.mediastack.com/v1",
    pandascore: "https://api.pandascore.co",
    twitter: "https://api.twitter.com/2",
    serpapi: "https://serpapi.com",
    youtube: "https://www.googleapis.com/youtube/v3",
    twitch: "https://api.twitch.tv/helix",
  };

  // Cache local para armazenar respostas de API e reduzir chamadas
  let apiCache = {};

  // Tempo de expiração do cache em minutos
  const CACHE_EXPIRY_MINUTES = 30;

  /**
   * Função genérica para fazer requisições HTTP
   * @param {string} url - URL da requisição
   * @param {Object} options - Opções da requisição
   * @returns {Promise} - Promessa com a resposta
   */
  const fetchData = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      throw error;
    }
  };

  /**
   * Verifica se há dados em cache válidos
   * @param {string} key - Chave de cache
   * @returns {boolean} - Verdadeiro se o cache for válido
   */
  const hasCachedData = (key) => {
    if (!apiCache[key]) return false;

    const now = new Date();
    const cacheTime = new Date(apiCache[key].timestamp);
    const diffMinutes = (now - cacheTime) / (1000 * 60);

    return diffMinutes < CACHE_EXPIRY_MINUTES;
  };

  /**
   * Obtém dados do cache
   * @param {string} key - Chave de cache
   * @returns {Object} - Dados em cache
   */
  const getCachedData = (key) => {
    return apiCache[key].data;
  };

  /**
   * Define dados no cache
   * @param {string} key - Chave de cache
   * @param {Object} data - Dados a serem armazenados
   */
  const setCachedData = (key, data) => {
    apiCache[key] = {
      data,
      timestamp: new Date(),
    };
  };

  /**
   * Obtém notícias relacionadas a eSports e à FURIA
   * @param {string} esport - O eSport específico
   * @param {number} count - Quantidade de notícias
   * @returns {Promise} - Promessa com as notícias
   */
  const getNews = async (esport, count = 6) => {
    const cacheKey = `news_${esport}_${count}`;

    if (hasCachedData(cacheKey)) {
      return getCachedData(cacheKey);
    }

    // Na implementação real, você usaria uma dessas APIs
    // Aqui vamos usar dados simulados para o teste

    try {
      // Simula dados de notícias
      const newsData = await simulateNewsApi(esport, count);
      setCachedData(cacheKey, newsData);
      return newsData;
    } catch (error) {
      console.error("Erro ao obter notícias:", error);
      return [];
    }
  };

  /**
   * Obtém detalhes do time FURIA para um eSport específico
   * @param {string} esport - O eSport específico
   * @returns {Promise} - Promessa com os dados do time
   */
  const getTeamDetails = async (esport) => {
    const cacheKey = `team_${esport}`;

    if (hasCachedData(cacheKey)) {
      return getCachedData(cacheKey);
    }

    try {
      // Simula dados do time
      const teamData = await simulateTeamApi(esport);
      setCachedData(cacheKey, teamData);
      return teamData;
    } catch (error) {
      console.error("Erro ao obter detalhes do time:", error);
      return null;
    }
  };

  /**
   * Obtém a agenda de jogos para um eSport específico
   * @param {string} esport - O eSport específico
   * @param {number} count - Quantidade de jogos
   * @returns {Promise} - Promessa com os jogos
   */
  const getMatchSchedule = async (esport, count = 5) => {
    const cacheKey = `schedule_${esport}_${count}`;

    if (hasCachedData(cacheKey)) {
      return getCachedData(cacheKey);
    }

    try {
      // Simula dados de agenda
      const scheduleData = await simulateScheduleApi(esport, count);
      setCachedData(cacheKey, scheduleData);
      return scheduleData;
    } catch (error) {
      console.error("Erro ao obter agenda de jogos:", error);
      return [];
    }
  };

  /**
   * Obtém estatísticas do time FURIA para um eSport específico
   * @param {string} esport - O eSport específico
   * @returns {Promise} - Promessa com as estatísticas
   */
  const getTeamStats = async (esport) => {
    const cacheKey = `stats_${esport}`;

    if (hasCachedData(cacheKey)) {
      return getCachedData(cacheKey);
    }

    try {
      // Simula dados de estatísticas
      const statsData = await simulateStatsApi(esport);
      setCachedData(cacheKey, statsData);
      return statsData;
    } catch (error) {
      console.error("Erro ao obter estatísticas:", error);
      return null;
    }
  };

  /**
   * Obtém trending topics relacionados a eSports e à FURIA
   * @param {string} esport - O eSport específico
   * @param {number} count - Quantidade de trends
   * @returns {Promise} - Promessa com as trends
   */
  const getTrendingTopics = async (esport, count = 10) => {
    const cacheKey = `trends_${esport}_${count}`;

    if (hasCachedData(cacheKey)) {
      return getCachedData(cacheKey);
    }

    try {
      // Simula dados de trends
      const trendsData = await simulateTrendsApi(esport, count);
      setCachedData(cacheKey, trendsData);
      return trendsData;
    } catch (error) {
      console.error("Erro ao obter trending topics:", error);
      return [];
    }
  };

  /**
   * Obtém vídeos relacionados a eSports e à FURIA
   * @param {string} esport - O eSport específico
   * @param {number} count - Quantidade de vídeos
   * @returns {Promise} - Promessa com os vídeos
   */
  const getVideos = async (esport, count = 4) => {
    const cacheKey = `videos_${esport}_${count}`;

    if (hasCachedData(cacheKey)) {
      return getCachedData(cacheKey);
    }

    try {
      // Simula dados de vídeos
      const videosData = await simulateVideosApi(esport, count);
      setCachedData(cacheKey, videosData);
      return videosData;
    } catch (error) {
      console.error("Erro ao obter vídeos:", error);
      return [];
    }
  };

  /**
   * Simula uma API de notícias para teste
   * @param {string} esport - O eSport específico
   * @param {number} count - Quantidade de notícias
   * @returns {Promise} - Promessa com as notícias simuladas
   */
  const simulateNewsApi = async (esport, count) => {
    // Atraso para simular requisição de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newsTitles = {
      csgo: [
        "FURIA vence campeonato e se classifica para o Major",
        "Jogador da FURIA é eleito o melhor do mundo em CS:GO",
        "FURIA anuncia mudanças em sua line-up de CS:GO",
        "FURIA derrota time europeu e avança na competição",
        "Análise tática: Como a FURIA dominou o último torneio",
        "FURIA quebra recorde em partida épica de CS:GO",
        "Entrevista exclusiva com o capitão da FURIA",
        "FURIA embarca para bootcamp na Europa",
      ],
      valorant: [
        "FURIA anuncia line-up feminina de Valorant",
        "FURIA vence torneio regional de Valorant",
        "Jogadora da FURIA é destaque no VCT",
        "FURIA se classifica para torneio internacional de Valorant",
        "Análise: A ascensão da FURIA em Valorant",
        "FURIA contrata jogador internacional para equipe de Valorant",
        "Entrevista com coach da FURIA sobre estratégias em Valorant",
        "FURIA anuncia parceria exclusiva para divisão de Valorant",
      ],
      lol: [
        "FURIA vence clássico brasileiro no CBLOL",
        "FURIA anuncia mudanças na equipe para próximo split",
        "Suporte da FURIA é eleito MVP da rodada",
        "FURIA se classifica para playoffs do CBLOL",
        "Análise: O estilo agressivo da FURIA no CBLOL",
        "FURIA anuncia contratação de jogador coreano",
        "Entrevista exclusiva com o mid laner da FURIA",
        "FURIA apresenta sua nova gaming house para equipe de LoL",
      ],
    };

    // Caso o eSport não tenha dados específicos, usa um padrão
    const titles = newsTitles[esport] || newsTitles.csgo;

    // Cria notícias simuladas
    const news = [];

    for (let i = 0; i < Math.min(count, titles.length); i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 7)); // Últimos 7 dias

      news.push({
        id: `news-${Date.now()}-${i}`,
        title: titles[i],
        excerpt:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.",
        imageUrl: `assets/images/news-${esport}-${(i % 3) + 1}.jpg`,
        category: esport.toUpperCase(),
        source: "FURIA News",
        date: date.toISOString(),
        url: "#",
      });
    }

    return news;
  };

  /**
   * Simula uma API de time para teste
   * @param {string} esport - O eSport específico
   * @returns {Promise} - Promessa com os dados do time simulados
   */
  const simulateTeamApi = async (esport) => {
    // Atraso para simular requisição de rede
    await new Promise((resolve) => setTimeout(resolve, 700));

    const teamPlayers = {
      csgo: [
        {
          id: 1,
          name: "Gabriel Toledo",
          nickname: "FalleN",
          role: "AWPer",
          country: "Brasil",
          imageUrl:
            "https://static.cdnlive.com.br/uploads/602/etc/16883982877481.png",
          stats: { rating: 1.15, kd: 1.24, hs: 48.2 },
        },
        {
          id: 2,
          name: "Andrei Piovezan",
          nickname: "arT",
          role: "Rifler",
          country: "Brasil",
          imageUrl:
            "https://liquipedia.net/commons/images/8/8f/ArT_at_BLAST_Premier_Fall_Final_2023.jpg",
          stats: { rating: 1.08, kd: 1.05, hs: 52.6 },
        },
        {
          id: 3,
          name: "Kaike Cerato",
          nickname: "KSCERATO",
          role: "Rifler",
          country: "Brasil",
          imageUrl:
            "https://liquipedia.net/commons/images/b/b9/KSCERATO_at_BLAST_Premier_Fall_Final_2023.jpg",
          stats: { rating: 1.21, kd: 1.32, hs: 55.1 },
        },
        {
          id: 4,
          name: "André Abreu",
          nickname: "drop",
          role: "Support",
          country: "Brasil",
          imageUrl:
            "https://liquipedia.net/commons/images/a/a7/Drop_at_IEM_Rio_2022.jpg",
          stats: { rating: 1.07, kd: 1.01, hs: 49.8 },
        },
        {
          id: 5,
          name: "Rafael Costa",
          nickname: "saffee",
          role: "AWPer",
          country: "Brasil",
          imageUrl:
            "https://liquipedia.net/commons/images/d/dd/Saffee_at_IEM_Rio_2022.jpg",
          stats: { rating: 1.12, kd: 1.18, hs: 38.5 },
        },
      ],
      valorant: [
        {
          id: 1,
          name: "Marina Ferreira",
          nickname: "mari",
          role: "Duelist",
          country: "Brasil",
          imageUrl:
            "https://liquipedia.net/commons/images/4/4a/Mari_at_VCT_2023_GC_Championship.jpg",
          stats: { acs: 245, kd: 1.35, hs: 28.5 },
        },
        {
          id: 2,
          name: "Douglas Silva",
          nickname: "dgzin",
          role: "Initiator",
          country: "Brasil",
          imageUrl:
            "https://liquipedia.net/commons/images/e/e7/Dgzin_at_VCT_2023_Americas_League.jpg",
          stats: { acs: 210, kd: 1.12, hs: 24.8 },
        },
        {
          id: 3,
          name: "Gabriel Santos",
          nickname: "qck",
          role: "Controller",
          country: "Brasil",
          imageUrl:
            "https://liquipedia.net/commons/images/2/2d/Quick_at_VCT_2023_Americas_League.jpg",
          stats: { acs: 198, kd: 0.98, hs: 22.3 },
        },
        {
          id: 4,
          name: "Agustin Pereira",
          nickname: "Nozwerr",
          role: "Sentinel",
          country: "Argentina",
          imageUrl:
            "https://liquipedia.net/commons/images/8/83/Nozwerr_at_VCT_2024_Americas_Kickoff.jpg",
          stats: { acs: 187, kd: 0.95, hs: 21.5 },
        },
        {
          id: 5,
          name: "Matheus Lima",
          nickname: "mazin",
          role: "Duelist",
          country: "Brasil",
          imageUrl:
            "https://liquipedia.net/commons/images/d/d9/Mazin_at_VCT_2023_Americas_League.jpg",
          stats: { acs: 232, kd: 1.21, hs: 26.9 },
        },
      ],
      lol: [
        {
          id: 1,
          name: "Bruno Farias",
          nickname: "Ruler",
          role: "Top",
          country: "Brasil",
          imageUrl:
            "https://liquipedia.net/commons/images/8/86/FURIA_Ruler_2023_Split_1.png",
          stats: { kda: 3.4, cs: 8.7, vision: 0.65 },
        },
        {
          id: 2,
          name: "Lee Min-ho",
          nickname: "Jony",
          role: "Jungle",
          country: "Coreia do Sul",
          imageUrl:
            "https://liquipedia.net/commons/images/f/f5/FURIA_Jony_2023_Split_1.png",
          stats: { kda: 4.2, cs: 6.3, vision: 0.92 },
        },
        {
          id: 3,
          name: "Pedro Augusto",
          nickname: "Krasty",
          role: "Mid",
          country: "Brasil",
          imageUrl:
            "https://liquipedia.net/commons/images/7/7a/FURIA_Krasty_2023_Split_1.png",
          stats: { kda: 3.8, cs: 9.1, vision: 0.73 },
        },
        {
          id: 4,
          name: "Matheus Amorim",
          nickname: "Trigo",
          role: "ADC",
          country: "Brasil",
          imageUrl:
            "https://liquipedia.net/commons/images/9/96/FURIA_Trigo_2023_Split_1.png",
          stats: { kda: 5.1, cs: 9.8, vision: 0.61 },
        },
        {
          id: 5,
          name: "Felipe Boal",
          nickname: "Boal",
          role: "Support",
          country: "Brasil",
          imageUrl:
            "https://liquipedia.net/commons/images/0/06/FURIA_Boal_2023_Split_1.png",
          stats: { kda: 4.5, cs: 1.2, vision: 2.34 },
        },
      ],
    };

    // Caso o eSport não tenha dados específicos, usa um padrão
    const players = teamPlayers[esport] || teamPlayers.csgo;

    return {
      name: "FURIA Esports",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/pt/f/f9/Furia_Esports_logo.png",
      esport: esport,
      players: players,
      coach: {
        name:
          esport === "csgo"
            ? "Nicholas Nogueira"
            : esport === "valorant"
            ? "Matheus Tarasconi"
            : "André Guilhoto",
        nickname:
          esport === "csgo"
            ? "guerri"
            : esport === "valorant"
            ? "Matts"
            : "Guilhoto",
      },
      achievements: [
        { title: "Campeão Regional", year: "2023" },
        { title: "Top 3 Mundial", year: "2022" },
        { title: "Campeão Nacional", year: "2021" },
      ],
    };
  };

  /**
   * Simula uma API de agenda para teste
   * @param {string} esport - O eSport específico
   * @param {number} count - Quantidade de jogos
   * @returns {Promise} - Promessa com os jogos simulados
   */
  const simulateScheduleApi = async (esport, count) => {
    // Atraso para simular requisição de rede
    await new Promise((resolve) => setTimeout(resolve, 600));

    const opponents = {
      csgo: [
        "Liquid",
        "NAVI",
        "G2",
        "FaZe",
        "Vitality",
        "Astralis",
        "NIP",
        "MIBR",
        "paiN Gaming",
      ],
      valorant: [
        "Sentinels",
        "LOUD",
        "NRG",
        "DRX",
        "Paper Rex",
        "KRÜ",
        "Leviatán",
        "Team Liquid",
        "Cloud9",
      ],
      lol: [
        "paiN Gaming",
        "LOUD",
        "RED Canids",
        "Flamengo Esports",
        "INTZ",
        "Keyd Stars",
        "KaBuM",
        "Vivo Keyd",
        "Liberty",
      ],
    };

    const tournaments = {
      csgo: [
        "ESL Pro League",
        "BLAST Premier",
        "IEM Katowice",
        "Major Championship",
        "BLAST Fall Finals",
      ],
      valorant: [
        "VCT Americas",
        "VCT Champions",
        "VCT LOCK//IN",
        "VCT Game Changers",
        "Masters Tokyo",
      ],
      lol: ["CBLOL Split 1", "CBLOL Split 2", "MSI", "Worlds", "CBLOL Academy"],
    };

    // Caso o eSport não tenha dados específicos, usa um padrão
    const esportOpponents = opponents[esport] || opponents.csgo;
    const esportTournaments = tournaments[esport] || tournaments.csgo;

    // Cria jogos simulados
    const matches = [];

    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() + (i + 1) * 2); // Próximos dias

      const opponent =
        esportOpponents[Math.floor(Math.random() * esportOpponents.length)];
      const tournament =
        esportTournaments[Math.floor(Math.random() * esportTournaments.length)];

      matches.push({
        id: `match-${Date.now()}-${i}`,
        tournament: tournament,
        opponent: {
          name: opponent,
          logoUrl: `assets/images/logo-${opponent
            .toLowerCase()
            .replace(" ", "-")}.png`,
        },
        date: date.toISOString(),
        format: Math.random() > 0.5 ? "Bo3" : "Bo5",
        link: "#",
      });
    }

    return matches;
  };

  /**
   * Simula uma API de estatísticas para teste
   * @param {string} esport - O eSport específico
   * @returns {Promise} - Promessa com as estatísticas simuladas
   */
  const simulateStatsApi = async (esport) => {
    // Atraso para simular requisição de rede
    await new Promise((resolve) => setTimeout(resolve, 800));

    const stats = {
      csgo: [
        { label: "Vitórias", value: 68, percentage: 68 },
        { label: "Mapa mais forte", value: "Mirage", percentage: 85 },
        { label: "Rating médio", value: 1.12, percentage: 75 },
        { label: "Headshot %", value: "52.4%", percentage: 65 },
      ],
      valorant: [
        { label: "Vitórias", value: 72, percentage: 72 },
        { label: "Mapa mais forte", value: "Ascent", percentage: 80 },
        { label: "ACS médio", value: 245, percentage: 78 },
        { label: "Primeiras kills", value: "65%", percentage: 70 },
      ],
      lol: [
        { label: "Vitórias", value: 65, percentage: 65 },
        { label: "KDA médio", value: 3.8, percentage: 72 },
        { label: "Objetivos", value: "74%", percentage: 74 },
        { label: "Early game", value: "82%", percentage: 82 },
      ],
    };

    // Caso o eSport não tenha dados específicos, usa um padrão
    return stats[esport] || stats.csgo;
  };

  /**
   * Simula uma API de trending topics para teste
   * @param {string} esport - O eSport específico
   * @param {number} count - Quantidade de trends
   * @returns {Promise} - Promessa com as trends simuladas
   */
  const simulateTrendsApi = async (esport, count) => {
    // Atraso para simular requisição de rede
    await new Promise((resolve) => setTimeout(resolve, 400));

    const trendContents = {
      csgo: [
        "FURIA vence de virada em jogo emocionante! #DIADEFURIA",
        "O nível de jogo da FURIA está impressionante nesta temporada",
        "KSCERATO é eleito melhor jogador da partida! #MVP",
        "Próximo jogo da FURIA será contra a Liquid, quem leva?",
        "Brasileiro na final! FURIA chega ao topo mais uma vez #GGWP",
        "A estratégia da FURIA na Mirage está em outro nível",
        "FalleN mostra que ainda é o melhor AWPer do Brasil! #GODFalleN",
        "O trabalho do coach guerri na FURIA está dando resultado",
        "Drop com 4k incrível! Assista o highlight #CSGO",
        "saffee entrega uma performance perfeita pela FURIA hoje #GOFURIA",
        "Fãs lotam arena para ver FURIA jogar no Brasil #CrowdLove",
        "FURIA se classifica para o próximo Major! #RoadToMajor",
      ],
      valorant: [
        "FURIA feminina domina o cenário nacional de Valorant #GirlPower",
        "Mari com uma clutch sensacional! Assista o highlight #VALORANT",
        "FURIA anuncia nova contratação para o time de Valorant",
        "dgzin mostra todo seu potencial jogando de Jett #Ace",
        "FURIA na final do VCT! Vem assistir com a gente",
        "Quem é o melhor duelista da FURIA? Vote na enquete",
        "Nozwerr com uma atuação impressionante de Cypher #SentinelGod",
        "A ascensão da FURIA no cenário de Valorant é incrível",
        "FURIA representando o Brasil no cenário internacional #BRValor",
        "qck com as melhores smokes do campeonato #ControllerDiff",
        "FURIA anuncia bootcamp na Coreia para o time de Valorant",
        "mazin com um ace inacreditável! Confira o clip #VALORANT",
      ],
      lol: [
        "FURIA domina o early game e garante vitória no CBLOL #GoFURIA",
        "Krasty é o MVP da semana! Desempenho impressionante",
        "Baron roubado! FURIA vira o jogo de forma espetacular",
        "Jony com um gank perfeito no mid! Veja o replay #JGDiff",
        "FURIA está cada vez mais forte neste split do CBLOL",
        "Trigo escolhido para o time da semana com sua Jinx #ADCGap",
        "Boal com visão de mapa impressionante! #SupportDiff",
        "FURIA vs LOUD: O clássico do CBLOL acontece hoje",
        "Ruler domina o top lane com Aatrox! #TopGap",
        "FURIA anuncia mudanças na comissão técnica de LoL",
        "O draft da FURIA estava perfeito! Parabéns ao coach",
        "FURIA segue invicta no CBLOL após vitória convincente",
      ],
    };

    // Caso o eSport não tenha dados específicos, usa um padrão
    const contents = trendContents[esport] || trendContents.csgo;

    // Plataformas para simular trends
    const platforms = ["twitter", "reddit", "google"];

    // Cria trends simuladas
    const trends = [];

    for (let i = 0; i < Math.min(count, contents.length); i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const date = new Date();
      date.setHours(date.getHours() - Math.floor(Math.random() * 12)); // Últimas 12 horas

      trends.push({
        id: `trend-${Date.now()}-${i}`,
        content: contents[i],
        platform: platform,
        timestamp: date.toISOString(),
        stats: {
          likes: Math.floor(Math.random() * 2000) + 500,
          shares: Math.floor(Math.random() * 500) + 100,
          comments: Math.floor(Math.random() * 300) + 50,
        },
      });
    }

    return trends;
  };

  /**
   * Simula uma API de vídeos para teste
   * @param {string} esport - O eSport específico
   * @param {number} count - Quantidade de vídeos
   * @returns {Promise} - Promessa com os vídeos simulados
   */
  const simulateVideosApi = async (esport, count) => {
    // Atraso para simular requisição de rede
    await new Promise((resolve) => setTimeout(resolve, 550));

    const videoTitles = {
      csgo: [
        "FURIA vs Liquid - Melhores momentos",
        "KSCERATO Highlight - Jogadas impressionantes",
        "FURIA | Road to Major - Episódio 1",
        "Entrevista com FalleN após vitória épica",
        "FURIA no bootcamp - Behind the scenes",
        "TOP 10 jogadas da FURIA no último campeonato",
      ],
      valorant: [
        "FURIA vs Sentinels - VCT Highlights",
        "Mari clutch 1v4 com a Jett",
        "FURIA | Por trás das câmeras no VCT",
        "Como a FURIA dominou Ascent - Análise tática",
        "Entrevista com time feminino da FURIA",
        "TOP 10 jogadas da FURIA no VCT Americas",
      ],
      lol: [
        "FURIA vs LOUD - Melhores momentos",
        "Krasty pentakill com Akali",
        "FURIA | Por dentro do CBLOL - Episódio 1",
        "Análise tática: Como a FURIA venceu a RED",
        "Entrevista com Boal após vitória decisiva",
        "TOP 10 jogadas da FURIA no CBLOL",
      ],
    };

    // Caso o eSport não tenha dados específicos, usa um padrão
    const titles = videoTitles[esport] || videoTitles.csgo;

    // Cria vídeos simulados
    const videos = [];

    for (let i = 0; i < Math.min(count, titles.length); i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 14)); // Últimos 14 dias

      videos.push({
        id: `video-${Date.now()}-${i}`,
        title: titles[i],
        thumbnailUrl: `assets/images/video-${esport}-${(i % 3) + 1}.jpg`,
        channelName: "FURIA TV",
        views: `${Math.floor(Math.random() * 500) + 100}K`,
        date: date.toISOString(),
        link: "#",
      });
    }

    return videos;
  };

  // Expõe a API pública
  return {
    getNews,
    getTeamDetails,
    getMatchSchedule,
    getTeamStats,
    getTrendingTopics,
    getVideos,
  };
})();

// Exporta o módulo para uso em outros scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = API;
}
/**
 * Módulo de API
 * Gerencia todas as chamadas de API externas
 */
