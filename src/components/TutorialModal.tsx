import React, { useState } from 'react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { X, ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface TutorialModalProps {
  lang: Language;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ lang, onClose }) => {
  const [step, setStep] = useState(1);
  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';

  const steps = [
    {
      step: 1,
      emoji: '🎴',
      title: t.step1Title,
      desc: t.step1Desc,
      tip: isAr ? 'نصيحة: احتفظ بأسرارك ولا تدع أحداً يخمّن هدفك الخفي.' : 'Tip: Guard your secret objective and observe others.'
    },
    {
      step: 2,
      emoji: '⚡',
      title: t.step2Title,
      desc: t.step2Desc,
      tip: isAr ? 'نصيحة: بطاقات التعاون تفيد الجميع، وبطاقات الفوضى قد تقلب الطاولة لصالحك.' : 'Tip: Cooperation boosts the mission, while Chaos changes the flow.'
    },
    {
      step: 3,
      emoji: '🔥',
      title: t.step3Title,
      desc: t.step3Desc,
      tip: isAr ? 'نصيحة: إذا اقتربت الفوضى من 100% استخدم بطاقات التهدئة والدرع.' : 'Tip: Deploy calming cards before Chaos reaches critical levels.'
    },
    {
      step: 4,
      emoji: '🏆',
      title: t.step4Title,
      desc: t.step4Desc,
      tip: isAr ? 'نصيحة: اللاعب الفائز هو من يحصد أعلى مجموع نقاط عبر تحقيق هدفه السري ومساعدة الفريق.' : 'Tip: Top score wins by balancing secret objectives and team help.'
    }
  ];

  const currentStepData = steps[step - 1];

  const handleNext = () => {
    soundEngine.playCardPlay();
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    soundEngine.playCardPlay();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1c25] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-fadeIn relative flex flex-col gap-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-black/40 rounded-full border border-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tutorialTitle}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {steps.map(s => (
              <span
                key={s.step}
                className={`h-1.5 rounded-full transition-all ${
                  s.step === step ? 'w-8 bg-amber-500' : 'w-2 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col items-center text-center gap-3">
          <div className="text-4xl p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
            {currentStepData.emoji}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            {currentStepData.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            {currentStepData.desc}
          </p>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center w-full">
            💡 {currentStepData.tip}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="py-2.5 px-4 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white/80 text-xs font-semibold rounded-xl border border-white/10 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{isAr ? 'السابق' : 'Previous'}</span>
          </button>

          <button
            onClick={handleNext}
            className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-black text-xs font-black rounded-xl shadow-lg shadow-amber-600/25 transition-all flex items-center justify-center gap-1.5"
          >
            {step === steps.length ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t.gotIt}</span>
              </>
            ) : (
              <>
                <span>{isAr ? 'التالي' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
