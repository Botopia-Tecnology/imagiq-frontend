/**
 * @module helpData
 * @description Help categories and FAQs data
 */

import {
  Package,
  CreditCard,
  Truck,
  Shield,
  Book,
  RefreshCw,
} from 'lucide-react';
import { HelpCategory } from './CategoryCard';
import { FAQ } from './FAQItem';

export const helpCategories: HelpCategory[] = [
  {
    id: 'orders',
    title: 'Pedidos y Entregas',
    description: 'Seguimiento, modificaciones y problemas con pedidos',
    icon: Package,
    articles: 12,
  },
  {
    id: 'payments',
    title: 'Pagos y Facturación',
    description: 'Métodos de pago, reembolsos y facturas',
    icon: CreditCard,
    articles: 8,
  },
  {
    id: 'shipping',
    title: 'Envíos y Devoluciones',
    description: 'Costos de envío, tiempos y devoluciones',
    icon: Truck,
    articles: 15,
  },
  {
    id: 'account',
    title: 'Mi Cuenta',
    description: 'Configuración, seguridad y preferencias',
    icon: Shield,
    articles: 6,
  },
  {
    id: 'products',
    title: 'Productos',
    description: 'Información sobre productos y disponibilidad',
    icon: Book,
    articles: 10,
  },
  {
    id: 'returns',
    title: 'Cambios y Garantías',
    description: 'Política de cambios, garantías y reclamos',
    icon: RefreshCw,
    articles: 9,
  },
];

export const faqs: FAQ[] = [
  {
    id: '1',
    question: '¿Cómo puedo rastrear mi pedido?',
    answer:
      'Puedes rastrear tu pedido desde la sección "Mis Pedidos" en tu perfil. También recibirás notificaciones por email y push con actualizaciones en tiempo real del estado de tu envío.',
    category: 'orders',
  },
  {
    id: '2',
    question: '¿Cuáles son los métodos de pago disponibles?',
    answer:
      'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias a través de PSE, y pagos en efectivo en puntos aliados.',
    category: 'payments',
  },
  {
    id: '3',
    question: '¿Cuánto tiempo tarda la entrega?',
    answer:
      'Los tiempos de entrega varían según tu ubicación: Bogotá y ciudades principales (1-2 días hábiles), otras ciudades (2-5 días hábiles). Entregas rurales pueden tomar hasta 7 días hábiles.',
    category: 'shipping',
  },
  {
    id: '4',
    question: '¿Puedo cambiar o cancelar mi pedido?',
    answer:
      'Puedes cancelar tu pedido sin costo hasta 1 hora después de realizarlo. Para cambios, contacta nuestro servicio al cliente lo antes posible.',
    category: 'orders',
  },
  {
    id: '5',
    question: '¿Cómo puedo devolver un producto?',
    answer:
      'Tienes 30 días desde la entrega para devolver productos. El artículo debe estar en su estado original. Inicia el proceso desde "Mis Pedidos" o contacta atención al cliente.',
    category: 'returns',
  },
  {
    id: '6',
    question: '¿Es seguro guardar mi información de pago?',
    answer:
      'Sí, utilizamos encriptación de nivel bancario para proteger tu información. Nunca almacenamos números de tarjeta completos y cumplimos con estándares internacionales de seguridad.',
    category: 'account',
  },
];
