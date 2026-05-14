import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { fadeInUp, staggerContainer } from '@/lib/motionVariants';
import { Calendar, Users, Eye, ArrowRight, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Session, User } from '@/types';

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthContext();
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [stance, setStance] = useState('');

  const { data: session, isLoading } = useQuery<Session & { creator: User }>({
    queryKey: ['session', id],
    queryFn: async () => {
      const res = await api.get(`/sessions/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const joinMutation = useMutation({
    mutationFn: async (stanceData: string) => {
      const res = await api.post(`/sessions/${id}/join`, { stance: stanceData });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Successfully joined the session!');
      navigate(`/lobby/${id}`);
    },
    onError: () => {
      toast.error('Failed to join the session. It might be full or already started.');
    },
  });

  const handleJoinSubmit = () => {
    if (stance.length < 10) {
      toast.error('Please provide a clearer stance (minimum 10 characters).');
      return;
    }
    joinMutation.mutate(stance);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted">Loading session data...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 text-center space-y-4">
        <ShieldAlert className="w-16 h-16 text-danger mx-auto" />
        <h2 className="text-2xl font-bold">Session Not Found</h2>
        <p className="text-muted">This debate might have concluded or been removed.</p>
        <Button onClick={() => navigate('/home')} variant="outline">Return Home</Button>
      </div>
    );
  }

  const isCreator = session.creator?.id === currentUser?.id;
  const isFull = session.status !== 'open';

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        {/* Header Section */}
        <motion.div variants={fadeInUp} className="bg-surface border border-border p-8 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {session.category?.name || 'General'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Classic Debate
                </Badge>
                <Badge className={session.status === 'open' ? 'bg-success/10 text-success border-success/20' : 'bg-muted/10 text-muted border-muted/20'}>
                  {session.status.toUpperCase()}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text leading-tight">
                {session.topic}
              </h1>
              
              <p className="text-lg text-muted max-w-2xl leading-relaxed">
                {session.initialQuestion || 'A structured intellectual confrontation on the core premises of this topic.'}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted pt-2">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={session.creator?.avatarUrl} />
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                      {session.creator?.username?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-text">{session.creator?.username}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Today
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  24 Observers
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              {isCreator ? (
                <Button size="lg" className="w-full gap-2" onClick={() => navigate(`/lobby/${id}`)}>
                  <Users className="w-5 h-5" /> Enter Lobby
                </Button>
              ) : isFull ? (
                <Button size="lg" variant="outline" className="w-full gap-2" onClick={() => navigate(`/observe/${id}`)}>
                  <Eye className="w-5 h-5" /> Observe
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                  onClick={() => setShowJoinForm(!showJoinForm)}
                  disabled={showJoinForm}
                >
                  <CheckCircle2 className="w-5 h-5" /> Join Debate
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Join Form Overlay */}
        <AnimatePresence>
          {showJoinForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Info className="w-5 h-5" /> Declare Your Stance
                  </CardTitle>
                  <CardDescription>
                    Briefly outline your core argument before entering the lobby. This sets the stage for the AI judge.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="I believe that..."
                    value={stance}
                    onChange={(e) => setStance(e.target.value)}
                    className="min-h-[120px] bg-surface"
                  />
                  <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setShowJoinForm(false)}>Cancel</Button>
                    <Button 
                      onClick={handleJoinSubmit}
                      disabled={joinMutation.isPending || stance.length < 10}
                      className="gap-2"
                    >
                      {joinMutation.isPending ? 'Joining...' : <>Confirm & Enter <ArrowRight className="w-4 h-4" /></>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sub-Questions Matrix */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="text-primary">|</span> The Premise Matrix
          </h3>
          <p className="text-muted text-sm max-w-2xl">
            Participants will be required to answer the following core questions during the writing phase. 
            Preparation is key to an unassailable logical chain.
          </p>

          <div className="grid gap-4 mt-6">
            {session.subQuestions?.map((question, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="hover:border-primary/30 transition-colors group relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-border group-hover:bg-primary transition-colors" />
                  <CardContent className="p-6 flex gap-6 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center font-bold text-muted group-hover:text-primary transition-colors">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-lg font-medium leading-relaxed group-hover:text-text transition-colors">
                        {question}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
