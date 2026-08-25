export interface Category {
  id: string;
  nombre: string;
  icono: string;
  color: string;
}

export const categories: Category[] = [
  { id: "munecas", nombre: "Muñecas", icono: "👧", color: "pink" },
  { id: "vehiculos", nombre: "Vehículos", icono: "🚗", color: "green" },
  { id: "construccion", nombre: "Construcción", icono: "🧩", color: "yellow" },
  { id: "juegos", nombre: "Juegos", icono: "🎮", color: "orange" },
  { id: "mas", nombre: "Más", icono: "•••", color: "blue" },
];

export function belongsToCategory(productCategory: string, categoryId: string) {
  const category = categories.find((item) => item.id === categoryId);

  if (!category) return false;
  if (categoryId === "mas") {
    return !categories.slice(0, -1).some((item) => item.nombre === productCategory);
  }

  return category.nombre === productCategory;
}
