// utils/helpers.ts
export const helpers = {
  // Fonction pour obtenir les initiales
  getInitials: (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  },

  // Fonction pour tronquer un texte
  truncateText: (text: string, length: number): string => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  },

  // Fonction pour générer un ID unique
  generateId: (): string => {
    return Math.random().toString(36).substr(2, 9);
  },
};
