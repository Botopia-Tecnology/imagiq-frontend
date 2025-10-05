/**
 * @module LegalPage
 * @description Elegant legal documents page
 * Following Single Responsibility Principle - handles legal content display
 */

import React, { useState } from 'react';
import { FileText, Shield, Info, Database, Calendar, Eye, Download, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/Button';
import PageHeader from '../layouts/PageHeader';

interface LegalPageProps {
  onBack?: () => void;
  className?: string;
  documentType?: 'terms' | 'privacy' | 'data-processing' | 'relevant-info';
}

interface LegalDocument {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  lastUpdated: Date;
  version: string;
  content: LegalSection[];
}

interface LegalSection {
  id: string;
  title: string;
  content: string;
  subsections?: LegalSection[];
}

const DocumentCard: React.FC<{
  document: LegalDocument;
  onClick: () => void;
}> = ({ document, onClick }) => {
  const Icon = document.icon;

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 text-left hover:shadow-md transition-all duration-200 hover:scale-105 w-full"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">
            {document.title}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            {document.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Actualizado: {document.lastUpdated.toLocaleDateString('es-ES')}
            </div>
            <div>Versión {document.version}</div>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </div>
    </button>
  );
};

const SectionContent: React.FC<{
  section: LegalSection;
  level?: number;
}> = ({ section, level = 1 }) => {
  const HeadingTag = level === 1 ? 'h2' : level === 2 ? 'h3' : 'h4';
  const headingClasses = level === 1
    ? 'text-xl font-semibold text-gray-900 mb-4'
    : level === 2
    ? 'text-lg font-medium text-gray-900 mb-3'
    : 'text-base font-medium text-gray-900 mb-2';

  return (
    <div className="mb-8">
      <HeadingTag className={headingClasses}>
        {level === 1 ? `${level}.` : `${level}.${level}.`} {section.title}
      </HeadingTag>
      <div className="prose prose-gray max-w-none">
        {section.content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="text-gray-600 leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </div>
      {section.subsections && (
        <div className="ml-4 mt-6">
          {section.subsections.map((subsection, index) => (
            <SectionContent
              key={subsection.id}
              section={subsection}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DocumentViewer: React.FC<{
  document: LegalDocument;
  onBack: () => void;
}> = ({ document, onBack }) => {
  const [activeSection, setActiveSection] = useState<string>('');

  const handleDownload = () => {
    console.log('Download document:', document.id);
    // TODO: Generate and download PDF
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={document.title}
        subtitle={`Versión ${document.version} - Actualizado ${document.lastUpdated.toLocaleDateString('es-ES')}`}
        onBack={onBack}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="hidden sm:flex"
            >
              <Eye className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="hidden sm:flex"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
          </div>
        }
      />

      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-8">
            {/* Document Header */}
            <div className="border-b border-gray-200 pb-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <document.icon className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
              </div>
              <p className="text-gray-600">{document.description}</p>
            </div>

            {/* Table of Contents */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-gray-900 mb-4">Tabla de Contenidos</h2>
              <ul className="space-y-2">
                {document.content.map((section, index) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {index + 1}. {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Document Content */}
            <div className="space-y-8">
              {document.content.map((section, index) => (
                <SectionContent
                  key={section.id}
                  section={{ ...section, title: section.title }}
                  level={1}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-8 mt-12">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <h4 className="font-medium text-blue-900 mb-1">
                      ¿Tienes preguntas sobre este documento?
                    </h4>
                    <p className="text-blue-700">
                      Si tienes dudas sobre estos términos, puedes contactar nuestro equipo de soporte
                      a través del centro de ayuda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LegalPage: React.FC<LegalPageProps> = ({
  onBack,
  className,
  documentType
}) => {
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);

  // Mock legal documents data
  const legalDocuments: LegalDocument[] = [
    {
      id: 'terms',
      title: 'Términos y Condiciones',
      description: 'Condiciones de uso de la plataforma y servicios',
      icon: FileText,
      lastUpdated: new Date('2024-01-15'),
      version: '2.1',
      content: [
        {
          id: 'acceptance',
          title: 'Aceptación de los Términos',
          content: 'Al acceder y usar nuestros servicios, usted acepta estar sujeto a estos términos y condiciones de uso.\n\nSi no está de acuerdo con alguna parte de estos términos, no debe usar nuestros servicios.'
        },
        {
          id: 'services',
          title: 'Descripción de los Servicios',
          content: 'Proporcionamos una plataforma de comercio electrónico que permite a los usuarios comprar productos a través de nuestra aplicación web y móvil.\n\nNos reservamos el derecho de modificar o discontinuar cualquier servicio en cualquier momento sin previo aviso.'
        },
        {
          id: 'user-obligations',
          title: 'Obligaciones del Usuario',
          content: 'Los usuarios deben proporcionar información precisa y mantener actualizada su cuenta.\n\nProhíbimos el uso de la plataforma para actividades ilegales o no autorizadas.'
        },
        {
          id: 'payments',
          title: 'Pagos y Facturación',
          content: 'Todos los pagos deben realizarse a través de los métodos de pago autorizados.\n\nLos precios están sujetos a cambios sin previo aviso.'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Política de Privacidad',
      description: 'Cómo recopilamos, usamos y protegemos tu información personal',
      icon: Shield,
      lastUpdated: new Date('2024-01-10'),
      version: '1.8',
      content: [
        {
          id: 'information-collection',
          title: 'Recopilación de Información',
          content: 'Recopilamos información que usted nos proporciona directamente, como cuando crea una cuenta o realiza una compra.\n\nTambién recopilamos información automáticamente sobre su uso de nuestros servicios.'
        },
        {
          id: 'information-use',
          title: 'Uso de la Información',
          content: 'Utilizamos la información para proporcionar y mejorar nuestros servicios.\n\nPodemos usar la información para comunicarnos con usted sobre su cuenta y nuestros servicios.'
        },
        {
          id: 'information-sharing',
          title: 'Compartir Información',
          content: 'No vendemos ni alquilamos su información personal a terceros.\n\nPodemos compartir información en circunstancias limitadas, como para cumplir con la ley.'
        },
        {
          id: 'data-security',
          title: 'Seguridad de los Datos',
          content: 'Implementamos medidas de seguridad técnicas y organizacionales para proteger su información.\n\nSin embargo, ningún método de transmisión por internet es 100% seguro.'
        }
      ]
    },
    {
      id: 'data-processing',
      title: 'Autorización para Tratamiento de Datos',
      description: 'Autorización para el tratamiento de datos personales conforme a la ley',
      icon: Database,
      lastUpdated: new Date('2024-01-05'),
      version: '1.3',
      content: [
        {
          id: 'authorization',
          title: 'Autorización',
          content: 'Mediante el presente documento, autorizo de manera libre, voluntaria, previa, explícita e informada el tratamiento de mis datos personales.\n\nEsta autorización se otorga de conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013.'
        },
        {
          id: 'purposes',
          title: 'Finalidades del Tratamiento',
          content: 'Los datos serán utilizados para gestionar la relación comercial, procesar pedidos y pagos.\n\nTambién para enviar comunicaciones comerciales y mejorar nuestros servicios.'
        },
        {
          id: 'rights',
          title: 'Derechos del Titular',
          content: 'Usted tiene derecho a conocer, actualizar y rectificar sus datos personales.\n\nTambién puede solicitar la supresión de sus datos cuando sea procedente.'
        }
      ]
    },
    {
      id: 'relevant-info',
      title: 'Información Relevante',
      description: 'Información importante sobre el funcionamiento de la plataforma',
      icon: Info,
      lastUpdated: new Date('2024-01-12'),
      version: '1.5',
      content: [
        {
          id: 'platform-operation',
          title: 'Funcionamiento de la Plataforma',
          content: 'Nuestra plataforma funciona las 24 horas del día, 7 días de la semana.\n\nPodemos realizar mantenimientos programados con previo aviso.'
        },
        {
          id: 'delivery-info',
          title: 'Información de Entregas',
          content: 'Los tiempos de entrega son estimados y pueden variar según la ubicación.\n\nOfrecemos seguimiento en tiempo real de todos los pedidos.'
        },
        {
          id: 'customer-service',
          title: 'Servicio al Cliente',
          content: 'Nuestro equipo de atención al cliente está disponible de lunes a viernes de 8am a 6pm.\n\nPuede contactarnos a través de chat, teléfono o email.'
        },
        {
          id: 'updates',
          title: 'Actualizaciones',
          content: 'Nos reservamos el derecho de actualizar estos documentos en cualquier momento.\n\nLe notificaremos sobre cambios importantes a través de la plataforma.'
        }
      ]
    }
  ];

  // If a specific document type is provided, show that document directly
  React.useEffect(() => {
    if (documentType) {
      const document = legalDocuments.find(doc => doc.id === documentType);
      if (document) {
        setSelectedDocument(document);
      }
    }
  }, [documentType]);

  if (selectedDocument) {
    return (
      <DocumentViewer
        document={selectedDocument}
        onBack={() => setSelectedDocument(null)}
      />
    );
  }

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      <PageHeader
        title="Documentos Legales"
        subtitle="Términos, políticas y información legal importante"
        onBack={onBack}
      />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Introduction */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Información Legal y Políticas
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Aquí encontrarás todos los documentos legales relacionados con el uso de nuestra plataforma.
            Te recomendamos leer estos documentos para entender tus derechos y obligaciones.
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {legalDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onClick={() => setSelectedDocument(document)}
            />
          ))}
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-medium text-blue-900 mb-1">
                ¿Necesitas ayuda con estos documentos?
              </h4>
              <p className="text-blue-700">
                Si tienes preguntas sobre cualquiera de estos documentos legales,
                nuestro equipo de soporte está disponible para ayudarte.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LegalPage.displayName = 'LegalPage';

export default LegalPage;