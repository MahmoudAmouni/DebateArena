import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebate } from '@/hooks/useDebate';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fadeInUp, staggerContainer } from '@/lib/motionVariants';
import { Timer, UserMinus, ShieldAlert } from 'lucide-react';

export default function DebatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthContext();
  const { sessionId, phase, timeRemaining, participants, subQuestions } = useDebate();

  const [showTransition, setShowTransition] = useState(false);
  const [transitionCountdown, setTransitionCountdown] = useState(3);
  const [showConcedeConfirm, setShowConcedeConfirm] = useState(false);

  // Handle phase transition overlay
  useEffect(() => {
    if (phase === 'phase2' && !showTransition) {
      setShowTransition(true);
      let count = 3;
      const interval = setInterval(() => {
        count--;
        setTransitionCountdown(count);
        if (count === 0) {
          clearInterval(interval);
          navigate(`/writing/${id}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [phase, showTransition, navigate, id]);

  const handleConcede = () => {
    // In a real app, call concede API endpoint
    navigate('/home');
  };

  const opponent = participants.find((p) => p.userId !== currentUser?.id);
  const me = participants.find((p) => p.userId === currentUser?.id);

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted">Syncing debate state...</p>
      </div>
    );
  }

  // Timer color logic
  const isWarning = timeRemaining < 300; // < 5 mins
  const isCritical = timeRemaining < 60; // < 1 min

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 flex flex-col min-h-[calc(100vh-80px)]">
      
      {/* Top Bar: Timer and Concede */}
      <div className="flex justify-between items-center mb-8">
        <Badge variant="outline" className="px-3 py-1.5 text-sm uppercase tracking-widest font-bold">
          Phase 1: Discussion
        </Badge>
        
        <motion.div 
          animate={{ color: isCritical ? '#ef4444' : isWarning ? '#f59e0b' : 'inherit' }}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 font-mono text-3xl font-black ${isCritical ? 'bg-danger/10 border-danger/30' : isWarning ? 'bg-amber-500/10 border-amber-500/30' : 'bg-surface border-border'}`}
        >
          <Timer className="w-8 h-8" />
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </motion.div>

        <Button variant="ghost" className="text-muted hover:text-danger hover:bg-danger/10 gap-2" onClick={() => setShowConcedeConfirm(true)}>
          <UserMinus className="w-4 h-4" /> Concede
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Column: Video/Audio Call Placeholder */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="flex-1 bg-surface-2 border-border/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-1000" />
            
            {/* Pulsing "Live" indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-surface/50 backdrop-blur rounded-full border border-border/50 z-10">
              <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Live Audio</span>
            </div>

            <CardContent className="h-full flex flex-col items-center justify-center p-12 relative z-10">
              <div className="grid grid-cols-2 gap-12 w-full max-w-2xl relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black text-muted opacity-20">VS</div>
                
                {/* Me */}
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-32 h-32 rounded-full border-4 border-primary/20 bg-surface flex items-center justify-center text-4xl shadow-2xl relative">
                    <div className="absolute -inset-2 rounded-full border border-primary/20 animate-[spin_4s_linear_infinite]" />
                    {me?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{me?.username}</h3>
                    <p className="text-sm text-primary font-medium">{me?.stance}</p>
                  </div>
                </div>

                {/* Opponent */}
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-32 h-32 rounded-full border-4 border-accent/20 bg-surface flex items-center justify-center text-4xl shadow-2xl relative">
                    {/* Simulated speaking indicator */}
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }} 
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute -inset-4 rounded-full bg-accent/20" 
                    />
                    {opponent?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{opponent?.username}</h3>
                    <p className="text-sm text-accent font-medium">{opponent?.stance}</p>
                  </div>
                </div>
              </div>

              <div className="mt-16 text-center max-w-md">
                <p className="text-muted text-sm leading-relaxed">
                  Discuss the sub-questions and outline your positions. Remember to be civil. 
                  The AI is analyzing voice sentiment and argument structure in real-time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Sub-Questions Reference */}
        <div className="lg:col-span-4 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4 px-2">Sub-Questions Agenda</h3>
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
            {subQuestions.map((q, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="bg-surface/50 border-border/50 hover:bg-surface transition-colors">
                  <CardContent className="p-4 flex gap-3">
                    <div className="text-primary font-bold">{i + 1}.</div>
                    <p className="text-sm leading-relaxed">{q}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Phase Transition Overlay */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8"
            >
              <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            
            <h1 className="text-5xl font-black mb-4">Phase 1 Complete</h1>
            <p className="text-xl text-muted mb-12 max-w-lg">
              The discussion period has ended. Prepare to formulate your official written arguments.
            </p>
            
            <div className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Writing Phase begins in</div>
            <div className="text-6xl font-mono font-black">{transitionCountdown}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Concede Confirmation Modal */}
      <AnimatePresence>
        {showConcedeConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border rounded-xl shadow-2xl p-6 max-w-sm w-full"
            >
              <div className="flex items-center gap-3 mb-4 text-danger">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="text-xl font-bold">Concede Debate?</h3>
              </div>
              <p className="text-muted mb-6">
                Are you sure you want to concede? This will immediately end the session and record a loss on your profile.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setShowConcedeConfirm(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleConcede}>Yes, Concede</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
