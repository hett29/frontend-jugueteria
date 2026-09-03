export interface Product {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
}

export const products: Product[] = [
 // ==================== MUÑECAS ====================
{
  id: 1,
  nombre: "Muñeca Princesa",
  categoria: "Muñecas",
  precio: 120,
  imagen: "/images/princesa.png",
},

{
  id: 2,
  nombre: "Muñeca Bebé",
  categoria: "Muñecas",
  precio: 95,
  imagen: "/images/m bebe.png",
},

{
  id: 3,
  nombre: "Muñeca Sirena",
  categoria: "Muñecas",
  precio: 135,
  imagen: "/images/sirena.jpg",
},

{
  id: 4,
  nombre: "Muñeca Bailarina",
  categoria: "Muñecas",
  precio: 110,
  imagen: "/images/bailarina.png",
},

{
  id: 5,
  nombre: "Muñeca Fashion",
  categoria: "Muñecas",
  precio: 145,
  imagen: "/images/m fashion.jpg",
},

{
  id: 6,
  nombre: "Muñeca Doctora",
  categoria: "Muñecas",
  precio: 125,
  imagen: "/images/doctora.jpg",
},

{
  id: 7,
  nombre: "Muñeca Escolar",
  categoria: "Muñecas",
  precio: 100,
  imagen: "/images/m escolar.png",
},

{
  id: 8,
  nombre: "Muñeca Aventurera",
  categoria: "Muñecas",
  precio: 140,
  imagen: "/images/aventurera.jpg",
},

{
  id: 9,
  nombre: "Muñeca Fantasía",
  categoria: "Muñecas",
  precio: 155,
  imagen: "/images/m fantasia.png",
},

{
  id: 10,
  nombre: "Muñeca de Moda",
  categoria: "Muñecas",
  precio: 150,
  imagen: "/images/de moda.png",
},

  // ==================== CONSTRUCCIÓN ====================

  {
    id: 11,
    nombre: "Juego de construcción",
    categoria: "Construcción",
    precio: 95,
    imagen: "/images/construc.jpg",
  },

  {
    id: 12,
    nombre: "Bloques Magnéticos",
    categoria: "Construcción",
    precio: 130,
    imagen: "/images/construc1.jpg",
  },

  {
    id: 13,
    nombre: "Castillo de Bloques",
    categoria: "Construcción",
    precio: 160,
    imagen: "/images/construc2.jpg",
  },

  {
    id: 14,
    nombre: "Casa para Construir",
    categoria: "Construcción",
    precio: 145,
    imagen: "/images/construc3.jpg",
  },

  {
    id: 15,
    nombre: "Robot para Armar",
    categoria: "Construcción",
    precio: 175,
    imagen: "/images/construc4.jpg",
  },

  {
    id: 16,
    nombre: "Torre de Bloques",
    categoria: "Construcción",
    precio: 85,
    imagen: "/images/construc5.jpg",
  },

  {
    id: 17,
    nombre: "Vehículos de Construcción",
    categoria: "Construcción",
    precio: 125,
    imagen: "/images/construc6.jpg",
  },

  {
    id: 18,
    nombre: "Constructor Junior",
    categoria: "Construcción",
    precio: 115,
    imagen: "/images/construc7.jpg",
  },

  {
    id: 19,
    nombre: "Piezas Creativas",
    categoria: "Construcción",
    precio: 90,
    imagen: "/images/construc8.png",
  },

  {
    id: 20,
    nombre: "Mega Bloques",
    categoria: "Construcción",
    precio: 155,
    imagen: "/images/construc9.jpg",
  },

  // ==================== VEHÍCULOS ====================

  {
    id: 21,
    nombre: "Carro de control remoto",
    categoria: "Vehículos",
    precio: 150,
    imagen: "/images/carro.jpg",
  },

  {
    id: 22,
    nombre: "Camión de Bomberos",
    categoria: "Vehículos",
    precio: 135,
    imagen: "/images/veh1.jpg",
  },

  {
    id: 23,
    nombre: "Ambulancia",
    categoria: "Vehículos",
    precio: 125,
    imagen: "/images/veh2.jpg",
  },

  {
    id: 24,
    nombre: "Auto Deportivo",
    categoria: "Vehículos",
    precio: 110,
    imagen: "/images/veh3.jpg",
  },

  {
    id: 25,
    nombre: "Camión de Carga",
    categoria: "Vehículos",
    precio: 120,
    imagen: "/images/veh4.jpg",
  },

  {
    id: 26,
    nombre: "Avión de Juguete",
    categoria: "Vehículos",
    precio: 100,
    imagen: "/images/veh5.jpg",
  },

  {
    id: 27,
    nombre: "Helicóptero",
    categoria: "Vehículos",
    precio: 115,
    imagen: "/images/veh6.jpg",
  },

  {
    id: 28,
    nombre: "Motocicleta",
    categoria: "Vehículos",
    precio: 90,
    imagen: "/images/veh7.jpg",
  },

  {
    id: 29,
    nombre: "Tren Infantil",
    categoria: "Vehículos",
    precio: 140,
    imagen: "/images/veh8.jpg",
  },

  {
    id: 30,
    nombre: "Bus de Juguete",
    categoria: "Vehículos",
    precio: 105,
    imagen: "/images/veh9.jpg",
  },

  // ==================== JUEGOS ====================

  {
    id: 31,
    nombre: "Set de cocina",
    categoria: "Juegos",
    precio: 110,
    imagen: "/images/cocina.jpg",
  },

  {
    id: 32,
    nombre: "Rompecabezas Infantil",
    categoria: "Juegos",
    precio: 65,
    imagen: "/images/rompecabezas.png",
  },

  {
    id: 33,
    nombre: "Juego de Memoria",
    categoria: "Juegos",
    precio: 55,
    imagen: "/images/memoria.png",
  },

  {
    id: 34,
    nombre: "Dominó Infantil",
    categoria: "Juegos",
    precio: 50,
    imagen: "/images/domino.png",
  },

  {
    id: 35,
    nombre: "Juego de Cartas",
    categoria: "Juegos",
    precio: 45,
    imagen: "/images/cartas.png",
  },

  {
    id: 36,
    nombre: "Bingo Infantil",
    categoria: "Juegos",
    precio: 60,
    imagen: "/images/bingo.png",
  },

  {
    id: 37,
    nombre: "Ajedrez Infantil",
    categoria: "Juegos",
    precio: 80,
    imagen: "/images/ajedrez.png",
  },

  {
    id: 38,
    nombre: "Damas",
    categoria: "Juegos",
    precio: 70,
    imagen: "/images/damas.png",
  },

  {
    id: 39,
    nombre: "Juego de Pesca",
    categoria: "Juegos",
    precio: 75,
    imagen: "/images/pesca.png",
  },

  {
    id: 40,
    nombre: "Juego de Mesa Infantil",
    categoria: "Juegos",
    precio: 95,
    imagen: "/images/juego-mesa.png",
  },

  // ==================== OTROS ====================

  {
    id: 41,
    nombre: "Oso de peluche gigante",
    categoria: "Otros",
    precio: 180,
    imagen: "/images/oso.png",
  },

  {
    id: 42,
    nombre: "Robot educativo",
    categoria: "Otros",
    precio: 200,
    imagen: "/images/robot.png",
  },

  {
    id: 43,
    nombre: "Pelota Infantil",
    categoria: "Otros",
    precio: 50,
    imagen: "/images/pelota.png",
  },

  {
    id: 44,
    nombre: "Pistola de Burbujas",
    categoria: "Otros",
    precio: 70,
    imagen: "/images/burbujas.png",
  },

  {
    id: 45,
    nombre: "Tambor Infantil",
    categoria: "Otros",
    precio: 85,
    imagen: "/images/tambor.png",
  },

  {
    id: 46,
    nombre: "Cometa Infantil",
    categoria: "Otros",
    precio: 60,
    imagen: "/images/cometa.png",
  },

  {
    id: 47,
    nombre: "Pizarra Mágica",
    categoria: "Otros",
    precio: 90,
    imagen: "/images/pizarra.png",
  },

  {
    id: 48,
    nombre: "Kit de Arte",
    categoria: "Otros",
    precio: 100,
    imagen: "/images/kit-arte.png",
  },

  {
    id: 49,
    nombre: "Instrumentos Musicales",
    categoria: "Otros",
    precio: 120,
    imagen: "/images/instrumentos.png",
  },

  {
    id: 50,
    nombre: "Dinosaurio de Juguete",
    categoria: "Otros",
    precio: 80,
    imagen: "/images/dinosaurio.png",
  },
];