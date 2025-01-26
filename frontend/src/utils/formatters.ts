// utils/formatters.ts
export const formatters = {
  // Format de date
  date: (date: Date | string): string => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  },

  // Format de date avec heure
  dateTime: (date: Date | string): string => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  },

  // Format monétaire
  currency: (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  },

  // Format pourcentage
  percentage: (value: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  },

  // Format nombre
  number: (value: number): string => {
    return new Intl.NumberFormat("fr-FR").format(value);
  },
};
