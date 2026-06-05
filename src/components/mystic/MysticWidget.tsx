import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Moon, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HOROSCOPES = [
  "Today brings unexpected joy. Embrace the small moments.",
  "A challenge may arise, but your intuition will guide you through.",
  "Your creative energy is high today. Start that new project!",
  "Take time for self-care; the universe supports your rest.",
  "An old friend might reach out. Be open to reconnection.",
  "Financial clarity is coming your way. Trust the process.",
  "Your hard work is paying off. Celebrate your achievements.",
  "A period of reflection will bring valuable insights.",
  "Love and harmony surround you today. Share the positivity.",
  "Be bold in your decisions. Fortune favors the brave today."
];

const TAROT_CARDS = [
  { name: "The Fool", meaning: "New beginnings, optimism, trust in life.", emoji: "🃏" },
  { name: "The Magician", meaning: "Action, the power to manifest, creativity.", emoji: "🪄" },
  { name: "The High Priestess", meaning: "Intuition, unconscious, inner voice.", emoji: "🔮" },
  { name: "The Empress", meaning: "Femininity, nature, abundance.", emoji: "👑" },
  { name: "The Emperor", meaning: "Authority, structure, control.", emoji: "🏛️" },
  { name: "The Lovers", meaning: "Partnerships, duality, choice.", emoji: "💞" },
  { name: "The Chariot", meaning: "Direction, control, willpower.", emoji: "🐎" },
  { name: "Strength", meaning: "Inner strength, bravery, compassion.", emoji: "🦁" },
  { name: "The Hermit", meaning: "Contemplation, search for truth, inner guidance.", emoji: "🕯️" },
  { name: "Wheel of Fortune", meaning: "Change, cycles, inevitable fate.", emoji: "🎡" },
  { name: "The Sun", meaning: "Joy, success, celebration, positivity.", emoji: "☀️" },
  { name: "The Star", meaning: "Hope, faith, rejuvenation.", emoji: "🌟" },
  { name: "The Moon", meaning: "Unconscious, illusions, intuition.", emoji: "🌕" }
];

// Simple hash function to get consistent daily results
const getDailyIndex = (max: number) => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  // A simple pseudo-random number generator based on the date seed
  let hash = 0;
  const str = seed.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % max;
};

export function MysticWidget() {
  const [showTarot, setShowTarot] = useState(false);

  // Instead of using effect to set state, calculate them lazily during render or initialize state
  const horoscopeIndex = getDailyIndex(HOROSCOPES.length);
  const tarotIndex = getDailyIndex(TAROT_CARDS.length);

  const horoscope = HOROSCOPES[horoscopeIndex];
  const tarot = TAROT_CARDS[tarotIndex];

  return (
    <Card className="glass-card border-none overflow-hidden relative bg-gradient-to-br from-indigo-950/40 to-purple-900/40 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none" />

      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="flex items-center gap-2 text-indigo-100 font-medium">
          <Moon className="h-5 w-5 text-indigo-400" />
          Daily Mystics
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 relative z-10">
        {/* Horoscope Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
            <Star className="h-3 w-3" /> Horoscope
          </h4>
          <p className="text-sm text-indigo-100/80 italic leading-relaxed border-l-2 border-indigo-500/30 pl-3 py-1">
            "{horoscope}"
          </p>
        </div>

        {/* Tarot Section */}
        <div className="space-y-2 pt-2 border-t border-indigo-500/20">
          <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Tarot of the Day
          </h4>

          <AnimatePresence mode="wait">
            {!showTarot ? (
              <motion.button
                key="draw-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowTarot(true)}
                className="w-full py-3 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 text-sm transition-colors flex items-center justify-center gap-2"
              >
                Reveal Your Card 🎴
              </motion.button>
            ) : (
              <motion.div
                key="card-reveal"
                initial={{ opacity: 0, scale: 0.95, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="bg-indigo-950/60 rounded-xl p-4 border border-indigo-500/30 text-center space-y-2"
              >
                <div className="text-4xl mb-2">{tarot?.emoji}</div>
                <div className="font-medium text-indigo-100">{tarot?.name}</div>
                <div className="text-xs text-indigo-200/70">{tarot?.meaning}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
