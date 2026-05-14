import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { socket } from '@/socket/socket';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { staggerContainer } from '@/lib/motionVariants';
import { Eye, Activity, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Session, User } from '@/types';

export default function ObservePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [observerCount, setObserverCount] = useState(1);
  const [phase, setPhase] = useState<'phase1' | 'phase2' | 'verdict'>('phase1');
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState<string | null>(null);

  const { data: session, isLoading } = useQuery<Session & { creator: User, participants: { user: User, username: string, stance: string, id: string }[] }>({
    queryKey: ['session', id],
    queryFn: async () => {
      const res = await api.get(`/sessions/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!id) return;

    socket.emit('observer:join', { sessionId: id });

    socket.on('observer:count_update', ({ count }) => {
      setObserverCount(count);
    });

    socket.on('debate:phase_transition', ({ newPhase }) => {
      setPhase(newPhase);
      if (newPhase === 'verdict') {
        toast.info('Debate has concluded! Waiting for AI Verdict...');
        setTimeout(() => navigate(`/verdict/${id}`), 3000);
      }
    });

    return () => {
      socket.emit('observer:leave', { sessionId: id });
      socket.off('observer:count_update');
      socket.off('debate:phase_transition');
    };
  }, [id, navigate]);

  const handleVote = (participantId: string) => {
    if (hasVoted) return;
    
    setHasVoted(true);
    setVotedFor(participantId);
    
    // API call to record vote
    api.post(`/sessions/${id}/vote`, { participantId }).then(() => {
      toast.success('Your vote has been recorded!');
    }).catch(() => {
      toast.error('Failed to record vote. You may have already voted.');
      setHasVoted(false);
      setVotedFor(null);
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || !session.participants || session.participants.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Session not ready</h2>
        <p className="text-muted">Waiting for participants to join...</p>
      </div>
    );
  }

  const p1 = session.participants[0];
  const p2 = session.participants[1];

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 min-h-[calc(100vh-80px)] flex flex-col">
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6 flex-1">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-surface border border-border p-6 rounded-2xl">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary uppercase font-bold tracking-widest text-xs">
                Classic Debate
              </Badge>
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2 text-sm font-medium text-muted"
                >
                  <Activity className="w-4 h-4 text-accent" />
                  {phase === 'phase1' ? 'Phase 1: Discussion' : phase === 'phase2' ? 'Phase 2: Written Arguments' : 'Processing Verdict...'}
                </motion.div>
              </AnimatePresence>
            </div>
            <h1 className="text-2xl font-bold">{session.topic}</h1>
          </div>

          <motion.div 
            key={observerCount}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-surface-2 rounded-xl border border-border"
          >
            <Eye className="w-5 h-5 text-muted" />
            <span className="font-mono font-bold text-lg">{observerCount}</span>
            <span className="text-xs text-muted font-bold uppercase tracking-wider">Watching</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Stage */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Card className="flex-1 bg-surface-2 border-border/50 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50" />
              <CardContent className="p-8 relative z-10 flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="flex items-center justify-between w-full max-w-2xl">
                  
                  {/* Participant 1 */}
                  <div className="flex flex-col items-center gap-4 flex-1 text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-primary/20 bg-surface flex items-center justify-center text-3xl font-bold shadow-xl">
                      {p1.user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{p1.user.username}</h3>
                      <p className="text-sm text-primary font-medium mt-1">{p1.stance}</p>
                    </div>
                  </div>

                  <div className="text-3xl font-black text-muted opacity-20 px-8">VS</div>

                  {/* Participant 2 */}
                  <div className="flex flex-col items-center gap-4 flex-1 text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-accent/20 bg-surface flex items-center justify-center text-3xl font-bold shadow-xl">
                      {p2.user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{p2.user.username}</h3>
                      <p className="text-sm text-accent font-medium mt-1">{p2.stance}</p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Voting Panel */}
            <Card className="border-2 border-primary/10 bg-primary/5">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-1">Cast Your Vote</h3>
                  <p className="text-sm text-muted">Who is presenting the stronger argument? Your vote influences the final ELO adjustment.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant={votedFor === p1.user.id ? 'default' : 'outline'}
                    className={`h-auto py-4 flex flex-col gap-2 ${hasVoted && votedFor !== p1.user.id ? 'opacity-50' : ''}`}
                    onClick={() => handleVote(p1.user.id)}
                    disabled={hasVoted}
                  >
                    <span className="font-bold text-lg">{p1.user.username}</span>
                    {votedFor === p1.user.id && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                  </Button>
                  <Button 
                    variant={votedFor === p2.user.id ? 'default' : 'outline'}
                    className={`h-auto py-4 flex flex-col gap-2 ${hasVoted && votedFor !== p2.user.id ? 'opacity-50' : ''}`}
                    onClick={() => handleVote(p2.user.id)}
                    disabled={hasVoted}
                  >
                    <span className="font-bold text-lg">{p2.user.username}</span>
                    {votedFor === p2.user.id && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                  </Button>
                </div>
                <AnimatePresence>
                  {hasVoted && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-center pt-4 text-sm font-bold text-success flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Vote officially recorded.
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold uppercase tracking-widest text-xs text-muted mb-4">Debate Structure</h3>
                <div className="space-y-4">
                  {session.subQuestions?.map((q, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      <span className="text-muted leading-relaxed">{q}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
