export const initialProducts = [
  // Platos
  {
    id: "1",
    nombre: "Lomo Saltado Adriano's",
    descripcion: "Trozos de lomo fino salteados al wok con cebolla, tomate, ají amarillo y un toque de pisco. Acompañado de papas fritas crujientes y arroz con choclo.",
    precio: 45.00,
    categoria: "🍛 Platos",
    imagen: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    calificacion: 4.9,
    ventas: 340,
    popularidad: 99
  },
  {
    id: "2",
    nombre: "Ceviche Carretillero",
    descripcion: "Pescado fresco del día marinado en zumo de limón de Chulucanas, acompañado de cebolla roja, camote glaseado, choclo desgranado y chicharrón de calamar.",
    precio: 38.00,
    categoria: "🍛 Platos",
    imagen: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
    calificacion: 4.8,
    ventas: 280,
    popularidad: 95
  },
  {
    id: "3",
    nombre: "Hamburguesa Premium Adriano's",
    descripcion: "200g de carne angus seleccionada, queso cheddar derretido, tocino ahumado crujiente, aros de cebolla caramelizados, salsa secreta en pan brioche. Con papas rústicas.",
    precio: 29.90,
    categoria: "🍛 Platos",
    imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    calificacion: 4.7,
    ventas: 410,
    popularidad: 98
  },
  {
    id: "4",
    nombre: "Fettuccine a la Huancaína con Lomo",
    descripcion: "Fideos fetuccini bañados en nuestra salsa huancaína tradicional a base de ají amarillo y queso fresco, coronados con jugosos trozos de lomo salteado.",
    precio: 42.00,
    categoria: "🍛 Platos",
    imagen: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80",
    calificacion: 4.9,
    ventas: 195,
    popularidad: 94
  },
  
  // Entradas
  {
    id: "5",
    nombre: "Papa a la Huancaína",
    descripcion: "Rodajas de papa sancochada bañadas en una suave crema de ají amarillo, queso fresco y leche. Decorado con aceituna botija y huevo duro.",
    precio: 18.00,
    categoria: "🥗 Entradas",
    imagen: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80",
    calificacion: 4.6,
    ventas: 150,
    popularidad: 82
  },
  {
    id: "6",
    nombre: "Tequeños Rellenos de Queso",
    descripcion: "6 unidades de masa wantán crujiente rellenos de queso andino derretido. Acompañados de abundante salsa guacamole casera.",
    precio: 16.00,
    categoria: "🥗 Entradas",
    imagen: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&auto=format&fit=crop&q=80",
    calificacion: 4.5,
    ventas: 230,
    popularidad: 88
  },
  {
    id: "7",
    nombre: "Causa Rellena de Pollo",
    descripcion: "Masa de papa amarilla sazonada con ají amarillo, limón y aceite, rellena de pechuga de pollo deshilachada en mayonesa y palta fresca.",
    precio: 19.50,
    categoria: "🥗 Entradas",
    imagen: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    calificacion: 4.8,
    ventas: 180,
    popularidad: 89
  },
 
  // Bebidas Frías
  {
    id: "8",
    nombre: "Chicha Morada de la Casa (1L)",
    descripcion: "Refrescante bebida tradicional elaborada con maíz morado hervido con piña, manzana, membrillo, canela y clavo de olor. Servida bien helada.",
    precio: 15.00,
    categoria: "🍹 Bebidas Frías",
    imagen: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&auto=format&fit=crop&q=80",
    calificacion: 4.9,
    ventas: 520,
    popularidad: 100
  },
  {
    id: "9",
    nombre: "Limonada de Hierbaluisa y Jengibre",
    descripcion: "Limonada natural endulzada con almíbar artesanal de hierbaluisa y un ligero toque refrescante de jengibre (kion).",
    precio: 12.00,
    categoria: "🍹 Bebidas Frías",
    imagen: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&auto=format&fit=crop&q=80",
    calificacion: 4.7,
    ventas: 290,
    popularidad: 86
  },
  {
    id: "10",
    nombre: "Maracuyá Frozen",
    descripcion: "Bebida granizada de pura pulpa de maracuyá ácido con almíbar dulce, licuado a punto de nieve.",
    precio: 13.00,
    categoria: "🍹 Bebidas Frías",
    imagen: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&auto=format&fit=crop&q=80",
    calificacion: 4.6,
    ventas: 180,
    popularidad: 80
  },

  // Bebidas Calientes
  {
    id: "11",
    nombre: "Café Capuccino Orgánico",
    descripcion: "Café de especialidad proveniente de Quillabamba, Cusco, extraído con leche vaporizada cremosa y espolvoreado con cacao al 70%.",
    precio: 9.50,
    categoria: "☕ Bebidas Calientes",
    imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80",
    calificacion: 4.7,
    ventas: 210,
    popularidad: 85
  },
  {
    id: "12",
    nombre: "Chocolate Caliente Adriano's",
    descripcion: "Elaborado con cacao nativo de Chulucanas al 65%, leche evaporada, canela, clavo de olor y un toque de cáscara de naranja.",
    precio: 11.00,
    categoria: "☕ Bebidas Calientes",
    imagen: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop&q=80",
    calificacion: 4.8,
    ventas: 175,
    popularidad: 78
  },

  // Postres
  {
    id: "13",
    nombre: "Torta de Chocolate Húmeda",
    descripcion: "Bizcocho súper húmedo de chocolate de Chulucanas relleno de abundante manjar blanco de olla y bañado con fudge casero.",
    precio: 14.50,
    categoria: "🍰 Postres",
    imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
    calificacion: 4.9,
    ventas: 380,
    popularidad: 97
  },
  {
    id: "14",
    nombre: "Suspiro a la Limeña Tradicional",
    descripcion: "Crema de manjar blanco de yemas perfumada con oporto, coronada con un merengue italiano espolvoreado con canela molida.",
    precio: 12.00,
    categoria: "🍰 Postres",
    imagen: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    calificacion: 4.7,
    ventas: 140,
    popularidad: 79
  }
];
