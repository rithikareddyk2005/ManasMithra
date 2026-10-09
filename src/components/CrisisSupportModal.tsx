import React from 'react';
import { X, Phone, Heart, Globe, ShieldAlert, LifeBuoy, Wind } from 'lucide-react';

interface CrisisSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchBreathing: () => void;
}

export const CrisisSupportModal: React.FC<CrisisSupportModalProps> = ({
  isOpen,
  onClose,
  onLaunchBreathing,
}) => {
  if (!isOpen) return null;

  const helplines = [
    {
      country: 'India 🇮🇳',
      name: 'Tele-MANAS (Govt of India Mental Health Helpline)',
      number: '14416 or 1800-891-4416',
      desc: 'Free, confidential, 24/7 tele-mental health support across 20+ regional languages.',
      type: 'Toll-Free 24/7',
    },
    {
      country: 'India 🇮🇳',
      name: 'KIRAN (Dept of Empowerment of Persons with Disabilities)',
      number: '1800-599-0019',
      desc: '24/7 mental health rehabilitation helpline for anxiety, distress, and crisis.',
      type: 'Toll-Free 24/7',
    },
    {
      country: 'United States & Canada 🇺🇸 🇨🇦',
      name: '988 Suicide & Crisis Lifeline',
      number: 'Dial or Text 988',
      desc: 'Immediate, confidential support for people in suicidal crisis or emotional distress.',
      type: 'Free 24/7 Call/Text',
    },
    {
      country: 'United Kingdom 🇬🇧',
      name: 'Samaritans & Shout',
      number: '116 123 (Call) or Text SHOUT to 85258',
      desc: 'Free 24/7 emotional support for anyone struggling to cope.',
      type: 'Free 24/7',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-800 to-rose-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-rose-100 mb-2">
            🛡️ 24/7 Immediate Support & Safety
          </div>
          <h2 className="text-xl font-bold">You Are Not Alone</h2>
          <p className="text-rose-100 text-xs mt-1">
            If you are experiencing acute distress, thoughts of self-harm, or overwhelming crisis, compassionate trained support is available right now for free.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="space-y-3">
            {helplines.map((line, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 hover:border-rose-300 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">{line.name}</span>
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                    {line.type}
                  </span>
                </div>
                <div className="text-sm font-extrabold text-rose-700 flex items-center gap-1.5 font-mono">
                  <Phone className="w-4 h-4" />
                  <span>{line.number}</span>
                </div>
                <p className="text-xs text-stone-600">{line.desc}</p>
                <div className="text-[10px] text-stone-400">{line.country}</div>
              </div>
            ))}
          </div>

          {/* International Directory */}
          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-xs space-y-1.5">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-700" /> Looking for another country?
            </span>
            <p className="text-stone-600">
              Find free, confidential helplines in over 130 countries at{' '}
              <a
                href="https://findahelpline.com"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 font-bold hover:underline"
              >
                findahelpline.com
              </a>{' '}
              or{' '}
              <a
                href="https://www.befrienders.org"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 font-bold hover:underline"
              >
                befrienders.org
              </a>.
            </p>
          </div>

          {/* Calming breath option */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200">
            <button
              onClick={() => {
                onClose();
                onLaunchBreathing();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Wind className="w-4 h-4" /> Start 2-Min Calming Breath
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
