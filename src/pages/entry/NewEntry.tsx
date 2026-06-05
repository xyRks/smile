import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowLeft } from 'lucide-react';
import { useMoodData } from '@/hooks/useMoodData';
import { MoodType } from '@/types';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const moods: { type: MoodType; emoji: string; label: string; color: string }[] = [
  { type: 'happy', emoji: '😊', label: 'Happy', color: 'from-green-400 to-emerald-500' },
  { type: 'excited', emoji: '🤩', label: 'Excited', color: 'from-yellow-400 to-amber-500' },
  { type: 'neutral', emoji: '😐', label: 'Neutral', color: 'from-gray-400 to-slate-500' },
  { type: 'tired', emoji: '😴', label: 'Tired', color: 'from-indigo-400 to-purple-500' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: 'from-blue-400 to-cyan-500' },
  { type: 'angry', emoji: '😡', label: 'Angry', color: 'from-red-400 to-rose-500' },
];

const presetTags = ['work', 'family', 'friends', 'health', 'hobby', 'stress', 'rest', 'exercise'];

export function NewEntry() {
  const navigate = useNavigate();
  const { addEntry } = useMoodData();

  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [energy, setEnergy] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setTimeout(() => setStep(2), 400); // Small delay for animation
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      if (tags.length < 5) setTags([...tags, tag]);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;
    setIsSubmitting(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));

    addEntry({
      mood: selectedMood,
      note: note.trim(),
      tags,
      energyLevel: energy
    });

    navigate('/');
  };

  return (
    <PageTransition className="max-w-2xl mx-auto py-4">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="icon" onClick={() => step === 2 ? setStep(1) : navigate(-1)} className="rounded-full hover:bg-secondary">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex gap-2">
          <div className={`h-2 w-8 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-secondary'}`} />
          <div className={`h-2 w-8 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-secondary'}`} />
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-full hover:bg-secondary">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold mb-2">How are you feeling?</h1>
            <p className="text-muted-foreground mb-12">Select the mood that best reflects your current state.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {moods.map((mood) => (
                <motion.button
                  key={mood.type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(mood.type)}
                  className={`relative flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 ${
                    selectedMood === mood.type
                      ? 'glass-card border-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                      : 'bg-card/40 hover:bg-card border border-border/50 shadow-sm'
                  }`}
                >
                  <div className={`w-20 h-20 rounded-full mb-3 flex items-center justify-center text-5xl bg-gradient-to-br ${mood.color} shadow-inner`}>
                    {mood.emoji}
                  </div>
                  <span className="font-medium">{mood.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && selectedMood && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-gradient-to-br ${moods.find(m => m.type === selectedMood)?.color} shadow-inner`}>
                {moods.find(m => m.type === selectedMood)?.emoji}
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add details</h2>
                <p className="text-muted-foreground">What's making you feel {selectedMood}?</p>
              </div>
            </div>

            <Card className="glass-card border-none">
              <CardContent className="p-6 space-y-6">

                {/* Note */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Journal Note (Optional)</label>
                  <Textarea
                    placeholder="Write down your thoughts..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[120px] bg-background/50 resize-none"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex justify-between">
                    <span>Tags</span>
                    <span className="text-muted-foreground">{tags.length}/5</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {presetTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          tags.includes(tag)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                  <Input
                    placeholder="Type a custom tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    disabled={tags.length >= 5}
                    className="bg-background/50 h-10"
                  />
                  {tags.filter(t => !presetTags.includes(t)).length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
                        {tags.filter(t => !presetTags.includes(t)).map(tag => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary text-primary-foreground flex items-center gap-1 group"
                          >
                            #{tag}
                            <X className="w-3 h-3 group-hover:text-red-300" />
                          </button>
                        ))}
                     </div>
                  )}
                </div>

                {/* Energy Level */}
                <div className="space-y-4 pt-2">
                   <label className="text-sm font-medium flex justify-between">
                    <span>Energy Level</span>
                    <span className="text-primary font-bold">{energy}/5</span>
                  </label>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xl">🪫</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={energy}
                      onChange={(e) => setEnergy(parseInt(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="text-xl">🔋</span>
                  </div>
                </div>

              </CardContent>
            </Card>

            <Button
              size="lg"
              className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <>
                  <Check className="mr-2 h-6 w-6" /> Save Entry
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
