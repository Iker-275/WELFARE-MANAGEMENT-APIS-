export const USER_CACHE_KEYS = {

  PROFILE: (id) =>
    `users:profile:${id}`,

  LIST: (query) =>
    `users:list:${JSON.stringify(query)}`,

};

export const USER_CACHE_TTL = {

  PROFILE: 300,

  LIST: 120,

};