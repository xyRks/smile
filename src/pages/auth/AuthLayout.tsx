import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function AuthLayout({ children, title, subtitle }: { children: ReactNode, title: string, subtitle: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated Gradient Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-primary/20 blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-accent/20 blur-[100px] pointer-events-none"
      />

      <div className="container relative z-10 mx-auto px-4 py-8 flex justify-center w-full max-w-6xl">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center bg-card/40 dark:bg-[#16213e]/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">

          {/* Left / Branding Side */}
          <div className="hidden md:flex flex-col justify-between p-12 h-full bg-gradient-premium text-white relative">
            <div className="absolute inset-0 bg-black/20" /> {/* subtle overlay */}
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <span className="text-5xl">✨</span> Moodify
              </h1>
              <p className="text-white/80 text-lg">Your premium daily emotional companion.</p>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="glass p-6 rounded-2xl bg-white/10 border-white/20">
                <p className="italic text-white/90">"Tracking my mood has completely transformed how I understand myself. This app is beautiful and a joy to use daily."</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">👩‍🎨</div>
                  <div>
                    <p className="font-medium">Sarah Jenkins</p>
                    <p className="text-sm text-white/60">Creative Director</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right / Form Side */}
          <div className="p-8 md:p-12 h-full flex flex-col justify-center relative">
             <div className="absolute top-6 left-6 md:hidden">
                <h1 className="text-2xl font-bold text-gradient flex items-center gap-2">
                  <span className="text-2xl">✨</span> Moodify
                </h1>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm mx-auto"
            >
              <div className="mb-8 text-center md:text-left pt-10 md:pt-0">
                <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>
                <p className="text-muted-foreground">{subtitle}</p>
              </div>
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
