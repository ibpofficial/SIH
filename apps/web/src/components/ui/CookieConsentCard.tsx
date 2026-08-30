import React, { useState } from 'react';
import { Cookie } from 'lucide-react';

interface CookieConsentCardProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export const CookieConsentCard: React.FC<CookieConsentCardProps> = ({
  onAccept,
  onDecline
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-[300px] bg-white rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden shadow-card-soft border border-slate-100 font-sans z-50">
      <div className="w-12 h-12 rounded-full bg-[#7b57ff]/10 flex items-center justify-center text-[#7b57ff]">
        <Cookie className="w-7 h-7 text-[#7b57ff]" />
      </div>

      <div className="text-base font-extrabold text-[#1a1a1a] tracking-tight">
        We use cookies
      </div>

      <p className="text-xs font-medium text-[#636363] leading-relaxed">
        We use cookies to ensure you get the best experience on our website and decision platform.
      </p>

      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={() => {
            setDismissed(true);
            if (onAccept) onAccept();
          }}
          className="accept-button-theme text-xs font-semibold"
        >
          Accept
        </button>

        <button
          onClick={() => {
            setDismissed(true);
            if (onDecline) onDecline();
          }}
          className="decline-button-theme text-xs font-semibold"
        >
          Decline
        </button>
      </div>
    </div>
  );
};
