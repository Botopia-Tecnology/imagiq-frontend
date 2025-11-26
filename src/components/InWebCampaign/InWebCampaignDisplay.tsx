"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { CampaignData } from "./types";

interface InWebCampaignDisplayProps {
  campaign: CampaignData | null;
  onClose: () => void;
}

// Componente para el contenido (imagen o HTML)
function CampaignContent({
  campaign,
  onClick,
}: {
  campaign: CampaignData;
  onClick: () => void;
}) {
  const hasLink = !!campaign.content_url;
//campaign.html_content
  return (
    <div
      className={hasLink ? "cursor-pointer" : ""}
      onClick={onClick}
      role={hasLink ? "button" : undefined}
      tabIndex={hasLink ? 0 : undefined}
    >
      {campaign.content_type === "html" && campaign.html_content ? (
        <div
          className="rounded-lg overflow-hidden [&>*]:max-w-full [&_img]:max-w-full [&_img]:h-auto"
          dangerouslySetInnerHTML={{ __html: campaign.html_content }}
        />
      ) : campaign.image_url ? (
        <img
          src={campaign.image_url} 
          alt={campaign.campaign_name || "Campaña"}
          className="w-full h-auto object-contain"
        />
      ) : null}
    </div>
  );
}

// Componente Modal (Popup)
function ModalDisplay({
  campaign,
  onClose,
  onClick,
}: {
  campaign: CampaignData;
  onClose: () => void;
  onClick: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30" />

      <div
        className="relative z-10 max-w-md w-full animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 rounded-full p-2 hover:bg-white/10 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-6 w-6 text-white" />
        </button>

        <div className="rounded-lg overflow-hidden shadow-2xl">
          <CampaignContent campaign={campaign} onClick={onClick} />
        </div>
      </div>
    </div>
  );
}

// Componente Slider (Toast)
function SliderDisplay({
  campaign,
  onClose,
  onClick,
}: {
  campaign: CampaignData;
  onClose: () => void;
  onClick: () => void;
}) {
  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[9999] max-w-sm w-[calc(100%-2rem)] animate-in slide-in-from-top duration-500">
      <div className="relative z-10 max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 rounded-full p-2 hover:bg-white/10 transition-colors z-20"
          aria-label="Cerrar"
        >
          <X className="h-6 w-6 text-white" />
        </button>

        <div className="rounded-lg overflow-hidden shadow-lg max-h-40 animate-in zoom-in-95 duration-300">
          <CampaignContent campaign={campaign} onClick={onClick} />
        </div>
      </div>
    </div>
  );
}

export function InWebCampaignDisplay({
  campaign,
  onClose,
}: InWebCampaignDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleContentClick = () => {
    if (campaign?.content_url) {
      window.open(campaign.content_url, "_blank");
    }
  };

  useEffect(() => {
    if (campaign) {
      setIsVisible(true);

      if (campaign.ttl && campaign.ttl > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }, campaign.ttl * 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [campaign, onClose]);

  if (!campaign || !isVisible) return null;

  const hasContent =
    (campaign.content_type === "html" && campaign.html_content) ||
    campaign.image_url;

  if (!hasContent) return null;

  const isModal = campaign.display_style === "modal";

  return !isModal ? (
    <ModalDisplay
      campaign={campaign}
      onClose={handleClose}
      onClick={handleContentClick}
    />
  ) : (
    <SliderDisplay
      campaign={campaign}
      onClose={handleClose}
      onClick={handleContentClick}
    />
  );
}
