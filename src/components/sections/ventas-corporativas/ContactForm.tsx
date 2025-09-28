"use client";

import React from "react";
import { ContactFormData } from "@/types/corporate-sales";
import ContactFormSection from "./ContactFormSection";
import SalesConsultationSection from "./SalesConsultationSection";

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  isLoading?: boolean;
}

export default function ContactForm({
  onSubmit,
  isLoading = false,
}: ContactFormProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <ContactFormSection onSubmit={onSubmit} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            <SalesConsultationSection />
          </div>
        </div>
      </div>
    </section>
  );
}
