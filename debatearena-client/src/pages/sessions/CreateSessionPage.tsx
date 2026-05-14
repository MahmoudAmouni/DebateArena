import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { fadeIn } from '@/lib/motionVariants';
import { ChevronRight, ChevronLeft, Send, Sparkles, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Category } from '@/types';

const createSessionSchema = z.object({
  topic: z.string().min(10, 'Topic must be at least 10 characters').max(100),
  initialQuestion: z.string().min(20, 'Initial question must be at least 20 characters'),
  categoryId: z.string().min(1, 'Please select a category'),
  stance: z.string().min(5, 'Position must be at least 5 characters'),
});

type CreateSessionValues = z.infer<typeof createSessionSchema>;

export default function CreateSessionPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const form = useForm<CreateSessionValues>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      topic: '',
      initialQuestion: '',
      categoryId: '',
      stance: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: CreateSessionValues) => {
      const res = await api.post('/sessions', values);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Session created successfully!');
      navigate(`/lobby/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create session.');
    },
  });

  const nextStep = async () => {
    const fieldsToValidate = step === 1 ? ['topic', 'categoryId'] : ['initialQuestion'];
    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = (values: CreateSessionValues) => {
    createMutation.mutate(values);
  };

  const progressValue = (step / 3) * 100;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Create New Debate</h1>
          <span className="text-sm font-medium text-muted">Step {step} of 3</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-surface border border-border p-8 rounded-2xl shadow-sm">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" /> Define the Topic
                  </h2>
                  <p className="text-sm text-muted">What are we debating today?</p>
                </div>

                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Topic Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. The Ethics of Artificial General Intelligence" {...field} />
                      </FormControl>
                      <FormDescription>Make it clear and provocative.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a domain" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" /> The Initial Question
                  </h2>
                  <p className="text-sm text-muted">Set the stage with a specific question to answer.</p>
                </div>

                <FormField
                  control={form.control}
                  name="initialQuestion"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>The Question</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g. Should AGI be granted legal personhood once it passes the Turing Test?" 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Send className="w-5 h-5 text-primary" /> Your Stance
                  </h2>
                  <p className="text-sm text-muted">Define your starting position on this topic.</p>
                </div>

                <FormField
                  control={form.control}
                  name="stance"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Your Position</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Yes, legal protection is necessary to prevent exploitation." {...field} />
                      </FormControl>
                      <FormDescription>This will be visible to your opponent.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={step === 1 || createMutation.isPending}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Continue <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Launch Debate'}
                {!createMutation.isPending && <Send className="w-4 h-4 ml-2" />}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
