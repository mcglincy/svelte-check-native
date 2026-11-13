function wrap<T>(fn: () => T) { return async (_event: {}) => fn(); }
export const load = wrap(() => ({ title: 'Example' }));
export const explicit = wrap(() => ({ title: 'Example' })) satisfies import('./$types').PageServerLoad;
