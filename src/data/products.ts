export interface Product {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
}

export const products: Product[] = [
  {
    id: 1,
    nombre: "Muñeca Princesa",
    categoria: "Muñecas",
    precio: 120,
    imagen: "/images/muneca.png",
  },
  {
    id: 2,
    nombre: "Carro de control remoto",
    categoria: "Vehículos",
    precio: 150,
    imagen: "/images/carro.png",
  },
  {
    id: 3,
    nombre: "Oso de peluche gigante",
    categoria: "Peluches",
    precio: 180,
    imagen: "/images/oso.png",
  },
  {
    id: 4,
    nombre: "Juego de construcción",
    categoria: "Construcción",
    precio: 95,
    imagen: "/images/bloques.png",
  },
  {
    id: 5,
    nombre: "Robot educativo",
    categoria: "Educativos",
    precio: 200,
    imagen: "/images/robot.png",
  },
  {
    id: 6,
    nombre: "Set de cocina",
    categoria: "Juegos",
    precio: 110,
    imagen: "/images/cocina.png",
  },
];