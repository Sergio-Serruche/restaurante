import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Twitter 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white/90 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Col 1: Brand details */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-primary p-2.5 rounded-2xl text-white">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <span className="font-elegant font-bold text-2xl tracking-tight text-white">
                Adriano's<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              Disfruta de la mejor experiencia gastronómica desde la comodidad de tu hogar o directo en nuestra mesa. Ingredientes frescos y sabor garantizado.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="p-2 bg-white/5 hover:bg-primary rounded-lg transition-colors text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-primary-orange rounded-lg transition-colors text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-gold hover:text-dark rounded-lg transition-colors text-white">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick links */}
          <div>
            <h4 className="font-display font-bold text-lg text-white mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-primary">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-400 hover:text-primary transition-colors">
                  Ver Menú
                </Link>
              </li>
              <li>
                <Link to="/reservas" className="text-gray-400 hover:text-primary transition-colors">
                  Reservar Mesa
                </Link>
              </li>
              <li>
                <Link to="/carrito" className="text-gray-400 hover:text-primary transition-colors">
                  Mi Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours */}
          <div>
            <h4 className="font-display font-bold text-lg text-white mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-primary">
              Horario de Atención
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span>Lunes - Viernes:</span>
                <span className="text-white font-medium">11:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span>Sábados:</span>
                <span className="text-white font-medium">11:00 AM - 11:30 PM</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span>Domingos:</span>
                <span className="text-white font-medium">11:30 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div>
            <h4 className="font-display font-bold text-lg text-white mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-primary">
              Contáctanos
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Av. Larco 456, Miraflores, Lima - Perú</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary-orange flex-shrink-0" />
                <span>+51 (01) 456-7890 / 987 654 321</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                <span>contacto@adrianos.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Adriano's. Todos los derechos reservados. Diseñado para una experiencia premium.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
