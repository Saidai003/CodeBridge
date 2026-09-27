import React from 'react';
import { X } from 'lucide-react';
import { Language, t } from '../i18n';

interface TutorialProps {
  step: number;
  lang: Language;
  onNext: () => void;
  onSkip: () => void;
  totalSteps: number;
}

export const Tutorial: React.FC<TutorialProps> = ({ step, lang, onNext, onSkip, totalSteps }) => {
  const messages: Record<string, keyof typeof import('../i18n').translations.en> = {
    '0': 'tutorialWelcome',
    '1': 'tutorialWrite',
    '2': 'tutorialResult',
    '3': 'tutorialHover',
    '4': 'tutorialExecute',
    '5': 'tutorialDone',
  };

  const messageKey = messages[String(step)] || 'tutorialWelcome';
  const isLast = step === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 relative">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="mb-4">
          <div className="flex gap-1 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <p className="text-lg text-gray-800 dark:text-gray-100 leading-relaxed">
            {t(messageKey, lang)}
          </p>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {t('tutorialSkip', lang)}
          </button>
          <button
            onClick={onNext}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            {isLast ? t('tutorialFinish', lang) : t('tutorialNext', lang)}
          </button>
        </div>
      </div>
    </div>
  );
};
