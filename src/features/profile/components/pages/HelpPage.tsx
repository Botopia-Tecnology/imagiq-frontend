/**
 * @module HelpPage
 * @description Elegant help and support page
 * Following Single Responsibility Principle - handles help content and support options
 */

import React, { useState } from 'react';
import {
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Book,
  CreditCard,
  Package,
  Shield,
  Truck,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Clock,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/Button';
import PageHeader from '../layouts/PageHeader';

interface HelpPageProps {
  onBack?: () => void;
  className?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  articles: number;
}

const FAQItem: React.FC<{
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ faq, isOpen, onToggle }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
          <div className="pt-3">{faq.answer}</div>
        </div>
      )}
    </div>
  );
};

const CategoryCard: React.FC<{
  category: HelpCategory;
  onClick: () => void;
}> = ({ category, onClick }) => {
  const Icon = category.icon;

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200 hover:scale-105"
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
          category.color
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">
            {category.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            {category.description}
          </p>
          <div className="text-xs text-gray-400">
            {category.articles} artículos
          </div>
        </div>
      </div>
    </button>
  );
};

const ContactOption: React.FC<{
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: string;
  available: string;
  onClick: () => void;
}> = ({ title, description, icon: Icon, action, available, onClick }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 mb-2">{description}</p>
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
            <Clock className="w-3 h-3" />
            {available}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClick}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            {action}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const HelpPage: React.FC<HelpPageProps> = ({
  onBack,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const helpCategories: HelpCategory[] = [
    {
      id: 'orders',
      title: 'Pedidos y Entregas',
      description: 'Seguimiento, modificaciones y problemas con pedidos',
      icon: Package,
      color: 'bg-blue-600',
      articles: 12
    },
    {
      id: 'payments',
      title: 'Pagos y Facturación',
      description: 'Métodos de pago, reembolsos y facturas',
      icon: CreditCard,
      color: 'bg-green-600',
      articles: 8
    },
    {
      id: 'shipping',
      title: 'Envíos y Devoluciones',
      description: 'Costos de envío, tiempos y devoluciones',
      icon: Truck,
      color: 'bg-purple-600',
      articles: 15
    },
    {
      id: 'account',
      title: 'Mi Cuenta',
      description: 'Configuración, seguridad y preferencias',
      icon: Shield,
      color: 'bg-red-600',
      articles: 6
    },
    {
      id: 'products',
      title: 'Productos',
      description: 'Información sobre productos y disponibilidad',
      icon: Book,
      color: 'bg-orange-600',
      articles: 10
    },
    {
      id: 'returns',
      title: 'Cambios y Garantías',
      description: 'Política de cambios, garantías y reclamos',
      icon: RefreshCw,
      color: 'bg-teal-600',
      articles: 9
    }
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      question: '¿Cómo puedo rastrear mi pedido?',
      answer: 'Puedes rastrear tu pedido desde la sección "Mis Pedidos" en tu perfil. También recibirás notificaciones por email y push con actualizaciones en tiempo real del estado de tu envío.',
      category: 'orders'
    },
    {
      id: '2',
      question: '¿Cuáles son los métodos de pago disponibles?',
      answer: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias a través de PSE, y pagos en efectivo en puntos aliados.',
      category: 'payments'
    },
    {
      id: '3',
      question: '¿Cuánto tiempo tarda la entrega?',
      answer: 'Los tiempos de entrega varían según tu ubicación: Bogotá y ciudades principales (1-2 días hábiles), otras ciudades (2-5 días hábiles). Entregas rurales pueden tomar hasta 7 días hábiles.',
      category: 'shipping'
    },
    {
      id: '4',
      question: '¿Puedo cambiar o cancelar mi pedido?',
      answer: 'Puedes cancelar tu pedido sin costo hasta 1 hora después de realizarlo. Para cambios, contacta nuestro servicio al cliente lo antes posible.',
      category: 'orders'
    },
    {
      id: '5',
      question: '¿Cómo puedo devolver un producto?',
      answer: 'Tienes 30 días desde la entrega para devolver productos. El artículo debe estar en su estado original. Inicia el proceso desde "Mis Pedidos" o contacta atención al cliente.',
      category: 'returns'
    },
    {
      id: '6',
      question: '¿Es seguro guardar mi información de pago?',
      answer: 'Sí, utilizamos encriptación de nivel bancario para proteger tu información. Nunca almacenamos números de tarjeta completos y cumplimos con estándares internacionales de seguridad.',
      category: 'account'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    console.log('Navigate to category:', categoryId);
    // TODO: Navigate to detailed category page
  };

  const handleContactChat = () => {
    console.log('Open chat support');
    // TODO: Open chat widget
  };

  const handleContactPhone = () => {
    console.log('Call support');
    // TODO: Initiate phone call
  };

  const handleContactEmail = () => {
    console.log('Email support');
    // TODO: Open email composer
  };

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      <PageHeader
        title="Centro de Ayuda"
        subtitle="Encuentra respuestas a tus preguntas"
        onBack={onBack}
      />

      <div className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="¿En qué podemos ayudarte?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Help Categories */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Categorías de Ayuda</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {helpCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        </div>

        {/* Frequent Questions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Preguntas Frecuentes</h2>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0',
                  selectedCategory === 'all'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Todas
              </button>
              {helpCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0',
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openFAQ === faq.id}
                  onToggle={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron preguntas
                </h3>
                <p className="text-gray-500">
                  Intenta con términos de búsqueda diferentes o contacta nuestro soporte
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">¿Necesitas más ayuda?</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <ContactOption
              title="Chat en Vivo"
              description="Chatea con nuestro equipo de soporte"
              icon={MessageCircle}
              action="Iniciar Chat"
              available="Lun-Vie 8am-6pm"
              onClick={handleContactChat}
            />
            <ContactOption
              title="Llamar"
              description="Habla directamente con un asesor"
              icon={Phone}
              action="Llamar Ahora"
              available="Lun-Vie 8am-6pm"
              onClick={handleContactPhone}
            />
            <ContactOption
              title="Email"
              description="Envía tu consulta por correo"
              icon={Mail}
              action="Enviar Email"
              available="Respuesta en 24h"
              onClick={handleContactEmail}
            />
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Recursos Adicionales</h3>
          <div className="space-y-3">
            <a
              href="/guia-compra"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Book className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Guía de Compra</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            <a
              href="/estado-envios"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Estado de Envíos</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            <a
              href="/politicas"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Políticas y Términos</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex gap-3">
            <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-medium text-blue-900 mb-1">
                ¿No encuentras lo que buscas?
              </h4>
              <p className="text-blue-700">
                Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta.
                No dudes en contactarnos a través de cualquiera de nuestros canales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HelpPage.displayName = 'HelpPage';

export default HelpPage;