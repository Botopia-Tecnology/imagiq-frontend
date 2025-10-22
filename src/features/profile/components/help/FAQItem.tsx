/**
 * @module FAQItem
 * @description Samsung-style FAQ accordion item
 */

import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQItemProps {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}

export const FAQItem: React.FC<FAQItemProps> = ({ faq, isOpen, onToggle }) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-gray-900 pr-4 text-base">{faq.question}</span>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-gray-900 flex-shrink-0" strokeWidth={2} />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-900 flex-shrink-0" strokeWidth={2} />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t-2 border-gray-100">
          <div className="pt-4">{faq.answer}</div>
        </div>
      )}
    </div>
  );
};

export default FAQItem;
