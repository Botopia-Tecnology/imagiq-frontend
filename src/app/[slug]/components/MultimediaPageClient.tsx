/**
 * Cliente de página multimedia
 */

'use client';

import type { MultimediaPageData } from '@/services/multimedia-pages.service';

interface MultimediaPageClientProps {
  pageData: MultimediaPageData;
}

export default function MultimediaPageClient({ pageData }: MultimediaPageClientProps) {
  const { page, banners, faqs } = pageData;

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
      <p className="text-gray-600 mb-8">{page.meta_description}</p>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Banners ({banners.length})</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(banners, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">FAQs ({faqs.length})</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(faqs, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
