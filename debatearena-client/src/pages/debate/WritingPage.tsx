import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDebate } from '@/hooks/useDebate';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fadeIn } from '@/lib/motionVariants';
import { Timer, Send, MessageSquare, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function WritingPage() {
  useParams<{ id: string }>();
  const { user: currentUser } = useAuthContext();
  const {
    sessionId,
    phase,
    subQuestions,
    timeRemaining,
    myAnswers,
    participants,
    updateAnswer,
    submitAnswer,
  } = useDebate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const opponent = participants.find((p) => p.userId !== currentUser?.id);
  const currentQuestion = subQuestions[currentQuestionIndex] || "Loading question...";
  const currentAnswer = myAnswers[currentQuestionIndex] || "";

  const handleNext = () => {
    if (currentQuestionIndex < subQuestions.length - 1) {
      setCurrentQuestionIndex(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(s => s - 1);
    }
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    
    // Validate all questions have answers
    const unansweredCount = subQuestions.length - Object.keys(myAnswers).length;
    if (unansweredCount > 0) {
      toast.error(`Please provide answers for all ${subQuestions.length} questions before submitting.`);
      return;
    }

    // Submit each answer (assuming the server accepts them one by one or we batch them)
    // The plan says submitAnswer(index, content)
    Object.entries(myAnswers).forEach(([index, content]) => {
      submitAnswer(parseInt(index), content);
    });

    setIsSubmitted(true);
    toast.success('Your arguments have been submitted! Waiting for opponent...');
  };

  // Auto-submit on timer zero
  useEffect(() => {
    if (timeRemaining === 0 && !isSubmitted && phase?.startsWith('phase')) {
      handleSubmit();
    }
  }, [timeRemaining, isSubmitted, phase]);

  if (!sessionId) return <div className="p-20 text-center">Loading session...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 min-h-[calc(100svh-80px)] flex flex-col">
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="flex-1 flex flex-col space-y-6"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-surface border border-border p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-bold uppercase tracking-wider">
              {phase === 'phase1' ? 'Phase 1: Construction' : 'Phase 2: Rebuttal'}
            </Badge>
            <div className="h-4 w-[1px] bg-border" />
            <h1 className="font-semibold text-muted">Debate in Progress</h1>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xl font-bold border ${timeRemaining < 30 ? 'bg-danger/10 text-danger border-danger/20 animate-pulse' : 'bg-surface-2 border-border'}`}>
            <Timer className="w-5 h-5" />
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            <Card className="flex-1 flex flex-col overflow-hidden border-2 border-primary/10">
              <CardHeader className="bg-primary/5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Question {currentQuestionIndex + 1} of {subQuestions.length}</span>
                  <div className="flex gap-1">
                    {subQuestions.map((_, i) => (
                      <div key={i} className={`w-8 h-1 rounded-full ${i === currentQuestionIndex ? 'bg-primary' : myAnswers[i] ? 'bg-success/50' : 'bg-border'}`} />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-xl leading-relaxed">{currentQuestion}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 relative">
                <Textarea
                  placeholder="Type your arguments here..."
                  className="w-full h-full min-h-[300px] p-6 text-lg leading-relaxed border-none focus-visible:ring-0 resize-none bg-transparent"
                  value={currentAnswer}
                  onChange={(e) => updateAnswer(currentQuestionIndex, e.target.value)}
                  disabled={isSubmitted}
                />
                
                {isSubmitted && (
                  <div className="absolute inset-0 bg-surface/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 text-center p-8">
                    <CheckCircle2 className="w-16 h-16 text-success mb-4" />
                    <h3 className="text-2xl font-bold">Arguments Locked</h3>
                    <p className="text-muted mt-2 max-w-sm">
                      Your responses have been transmitted. The debate will progress once your opponent finishes.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                </Button>
                <Button variant="outline" onClick={handleNext} disabled={currentQuestionIndex === subQuestions.length - 1}>
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <Button 
                size="lg" 
                className="px-8 gap-2 shadow-lg shadow-primary/20"
                onClick={handleSubmit}
                disabled={isSubmitted}
              >
                <Send className="w-4 h-4" /> Finalize Arguments
              </Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted">Intelligence Brief</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-surface-2 rounded-lg border border-border">
                  <h4 className="text-xs font-bold text-muted mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Opponent's Stance
                  </h4>
                  <p className="text-sm italic font-medium">"{opponent?.stance || 'Loading...'}"</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Sub-Questions
                  </h4>
                  <div className="space-y-2">
                    {subQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentQuestionIndex(i)}
                        className={`w-full text-left p-2 text-xs rounded transition-colors border ${i === currentQuestionIndex ? 'bg-primary/10 border-primary/20 text-primary' : 'hover:bg-surface-2 border-transparent'}`}
                      >
                        {i + 1}. {q.length > 50 ? q.substring(0, 50) + '...' : q}
                        {myAnswers[i] && <CheckCircle2 className="w-3 h-3 inline ml-2 text-success" />}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 p-6 rounded-2xl">
              <h3 className="font-bold flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-accent" /> AI Fact-Checker
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Remember to cite specific evidence. Our AI judge penalizes unsupported claims and logical fallacies.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
