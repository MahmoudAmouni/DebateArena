import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDebate } from '@/hooks/useDebate';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { fadeInUp, staggerContainer } from '@/lib/motionVariants';
import { CheckCircle2, Circle, Copy, Users, Loader2, LogOut, Play } from 'lucide-react';
import { toast } from 'sonner';

export default function LobbyPage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuthContext();
  const {
    sessionId,
    participants,
    joinSession,
    setReady,
    leaveSession,
  } = useDebate();

  useEffect(() => {
    if (id) {
      joinSession(id);
    }
  }, [id, joinSession]);

  const copyInviteLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Invite link copied to clipboard!');
  };

  const myParticipant = participants.find((p) => p.userId === currentUser?.id);
  const isCreator = myParticipant?.role === 'creator';
  const allReady = participants.length === 2 && participants.every((p) => p.isReady);

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted">Connecting to session lobby...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        {/* Header Section */}
        <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Debate Lobby</h1>
            <p className="text-muted text-sm">Waiting for participants to prepare.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyInviteLink} className="gap-2">
              <Copy className="w-4 h-4" /> Copy Invite
            </Button>
            <Button variant="ghost" size="sm" onClick={leaveSession} className="text-danger hover:text-danger hover:bg-danger/10 gap-2">
              <LogOut className="w-4 h-4" /> Leave
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">The Premise</CardTitle>
                <CardDescription>Topic & Initial Question</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted mb-1">Topic</h4>
                  <p className="text-lg font-medium">AI & Universal Basic Income</p> 
                  {/* Note: Topic should ideally come from sessionId/context but for now we focus on the UI */}
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted mb-1">Question</h4>
                  <p className="text-text leading-relaxed">
                    Should a universal basic income be implemented specifically to offset job losses caused by generative AI?
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 flex items-start gap-4">
              <Users className="w-6 h-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold text-primary">Matching...</h4>
                <p className="text-sm text-primary/80">
                  {participants.length < 2 
                    ? "Waiting for an opponent to join. Share the invite link to speed things up!" 
                    : "Opponent found! Both participants must mark themselves as ready to begin."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Participants Sidebar */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <h3 className="font-bold flex items-center gap-2 px-2">
              Participants <Badge variant="secondary">{participants.length}/2</Badge>
            </h3>
            <div className="space-y-4">
              {participants.map((p) => (
                <Card key={p.id} className={p.userId === currentUser?.id ? "border-primary/50 shadow-sm" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-xs font-bold border border-border">
                          {p.username[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm">
                          {p.username} {p.userId === currentUser?.id && "(You)"}
                        </span>
                      </div>
                      {p.isReady ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted" />
                      )}
                    </div>
                    <div className="text-xs text-muted mb-1 font-medium uppercase tracking-tight">Stance</div>
                    <p className="text-sm italic">"{p.stance}"</p>
                  </CardContent>
                </Card>
              ))}
              
              {participants.length < 2 && (
                <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-2 opacity-50">
                  <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center">
                    <Users className="w-5 h-5 text-muted" />
                  </div>
                  <span className="text-sm text-muted">Waiting for rival...</span>
                </div>
              )}
            </div>

            <div className="pt-4 space-y-3">
              <Button 
                className="w-full h-12 text-lg font-bold"
                variant={myParticipant?.isReady ? "outline" : "default"}
                onClick={() => setReady(!myParticipant?.isReady)}
                disabled={participants.length < 2}
              >
                {myParticipant?.isReady ? "Cancel Ready" : "I'm Ready"}
              </Button>
              
              {isCreator && allReady && (
                <Button className="w-full h-12 bg-success hover:bg-success/90 text-white gap-2">
                  <Play className="w-4 h-4 fill-current" /> Start Debate
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
