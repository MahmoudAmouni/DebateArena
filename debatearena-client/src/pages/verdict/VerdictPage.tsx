import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { scaleIn, staggerContainer } from '@/lib/motionVariants';
import { Trophy, Home, Share2, TrendingUp, Info } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import type { Verdict } from '@/types';

export default function VerdictPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthContext();

  const { data: verdict, isLoading } = useQuery<Verdict>({
    queryKey: ['verdict', id],
    queryFn: async () => {
      const res = await api.get(`/verdicts/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const isWinner = verdict?.winnerId === currentUser?.id;

  useEffect(() => {
    if (isWinner) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#7c3aed', '#22c55e']
      });
    }
  }, [isWinner]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <TrendingUp className="w-8 h-8 animate-bounce text-primary" />
        <p className="text-muted">AI is calculating the final verdict...</p>
      </div>
    );
  }

  // Mock data for the chart if scores are available
  const chartData = verdict?.scores ? Object.entries(verdict.scores).map(([subject, score]) => ({
    subject,
    score,
    fullMark: 100,
  })) : [
    { subject: 'Logic', score: 85, fullMark: 100 },
    { subject: 'Evidence', score: 72, fullMark: 100 },
    { subject: 'Clarity', score: 90, fullMark: 100 },
    { subject: 'Persuasion', score: 65, fullMark: 100 },
    { subject: 'Civility', score: 95, fullMark: 100 },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        {/* Winner Announcement */}
        <motion.div variants={scaleIn} className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Trophy className={`w-10 h-10 ${isWinner ? 'text-yellow-500' : 'text-primary'}`} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {isWinner ? "Victory is Yours!" : "The Verdict is In"}
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Our AI judge has analyzed all arguments based on logical consistency, evidence quality, and rhetorical strength.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Analysis & Scores */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-2 border-primary/10 overflow-hidden">
              <CardHeader className="bg-surface-2 border-b border-border">
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" /> AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-text italic">
                    "{verdict?.aiAnalysis?.summary || "The debate showed a high level of intellectual rigor. The winner demonstrated superior logical chaining and effectively refuted the core premises of the opponent's arguments with verifiable evidence."}"
                  </p>
                  <Separator className="my-6" />
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted">Key Takeaways</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <Badge variant="outline" className="mt-0.5 text-success">Strength</Badge>
                        <span>Exceptional use of empirical data in Question 3.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Badge variant="outline" className="mt-0.5 text-danger">Weakness</Badge>
                        <span>Minor logical fallacy detected in Question 5 (Ad Hominem).</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={() => navigate('/home')} className="flex-1 gap-2">
                <Home className="w-4 h-4" /> Return to Arena
              </Button>
              <Button variant="outline" className="flex-1 gap-2" onClick={() => toast.info('Share feature coming soon!')}>
                <Share2 className="w-4 h-4" /> Share Verdict
              </Button>
            </div>
          </div>

          {/* Radar Chart Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-center">Performance Matrix</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="var(--color-border)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-muted)', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Performance"
                        dataKey="score"
                        stroke="var(--color-primary)"
                        fill="var(--color-primary)"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="w-full space-y-3 mt-4">
                  {chartData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted">{item.subject}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${item.score}%` }} 
                          />
                        </div>
                        <span className="font-bold w-8 text-right">{item.score}</span>
                      </div>
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
