/**
 * BiblioNavia - Safe Browser Storage Utility
 * Protege contra QuotaExceededError y restricciones de iframe/modo incógnito.
 * Maneja la cuota de forma inteligente liberando cachés pesadas cuando es necesario.
 */

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`[BiblioNavia Storage] Cuota excedida al guardar "${key}". Liberando caché no crítica:`, error);
      try {
        // Si falló por cuota y no es la clave de libros, eliminar caché pesada de libros
        if (key !== 'biblionavia_books') {
          window.localStorage.removeItem('biblionavia_books');
          window.localStorage.setItem(key, value);
          return true;
        } else {
          // Si falló guardando biblionavia_books, limpiarlo para no saturar
          window.localStorage.removeItem('biblionavia_books');
        }
      } catch {
        // Ignorar silenciosamente: el estado reactivo en memoria y Cloud Firestore mantienen la verdad
      }
      return false;
    }
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignorar
    }
  },

  clear: (): void => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
    } catch {
      // Ignorar
    }
  },
};
