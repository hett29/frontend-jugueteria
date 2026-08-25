import type { Product } from "./products";

export interface Category {
  id: string;
  nombre: string;
  icono: string;
  color: string;
  includes: (product: Product) => boolean;
}

export const categories: Category[] = [
  {
    id: "munecas",
    nombre: "Muñecas",
    icono: "👧",
    color: "pink",
    includes: (product) => product.categoria === "Muñecas",
  },
  {
    id: "vehiculos",
    nombre: "Vehículos",
    icono: "🚗",
    color: "green",
    includes: (product) => product.categoria === "Vehículos",
  },
  {
    id: "construccion",
    nombre: "Construcción",
    icono: "🧩",
    color: "yellow",
    includes: (product) => product.categoria === "Construcción",
  },
  {
    id: "juegos",
    nombre: "Juegos",
    icono: "🎮",
    color: "orange",
    includes: (product) => product.categoria === "Juegos",
  },
  {
    id: "otros",
    nombre: "Otros",
    icono: "•••",
    color: "blue",
    includes: (product) => ![
      "Muñecas",
      "Vehículos",
      "Construcción",
      "Juegos",
    ].includes(product.categoria),
  },
];
