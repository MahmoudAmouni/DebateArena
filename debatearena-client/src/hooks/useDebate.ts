import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebateContext } from '@/context/DebateContext';
import type { DebatePhase } from '@/types';
import { socket } from '@/socket/socket';

export const useDebate = () => {
  const {
    sessionId,
    phase,
    participants,
    subQuestions,
    timeRemaining,
    myAnswers,
    observerCount,
    setSession,
    setPhase,
    setParticipants,
    setTimeRemaining,
    updateAnswer,
    setObserverCount,
    clearDebate,
  } = useDebateContext();

  const navigate = useNavigate();

  const joinSession = useCallback((id: string) => {
    socket.emit('join_session', { sessionId: id });
  }, []);

  const setReady = useCallback((status: boolean) => {
    if (!sessionId) return;
    socket.emit('set_ready', { sessionId, isReady: status });
  }, [sessionId]);

  const submitAnswer = useCallback((index: number, content: string) => {
    if (!sessionId) return;
    socket.emit('submit_answer', { sessionId, questionIndex: index, content });
  }, [sessionId]);

  const leaveSession = useCallback(() => {
    if (sessionId) {
      socket.emit('leave_session', { sessionId });
    }
    clearDebate();
    navigate('/home');
  }, [sessionId, clearDebate, navigate]);

  useEffect(() => {
    if (!socket) return;

    const handleSessionJoined = (data: any) => {
      setSession(data.sessionId, data.participants, data.subQuestions);
      setPhase(data.phase);
    };

    const handleParticipantsUpdate = (data: any) => {
      setParticipants(data.participants);
    };

    const handlePhaseChanged = (data: { phase: DebatePhase; sessionId: string }) => {
      setPhase(data.phase);
      // Automatic navigation based on phase
      if (data.phase === 'phase1' || data.phase === 'phase2') {
        navigate(`/writing/${data.sessionId}`);
      } else if (data.phase === 'completed') {
        navigate(`/verdict/${data.sessionId}`);
      }
    };

    const handleTimerTick = (data: { seconds: number }) => {
      setTimeRemaining(data.seconds);
    };

    const handleObserverUpdate = (data: { count: number }) => {
      setObserverCount(data.count);
    };

    socket.on('session_joined', handleSessionJoined);
    socket.on('participants_updated', handleParticipantsUpdate);
    socket.on('phase_changed', handlePhaseChanged);
    socket.on('timer_tick', handleTimerTick);
    socket.on('observer_count_updated', handleObserverUpdate);

    return () => {
      socket.off('session_joined', handleSessionJoined);
      socket.off('participants_updated', handleParticipantsUpdate);
      socket.off('phase_changed', handlePhaseChanged);
      socket.off('timer_tick', handleTimerTick);
      socket.off('observer_count_updated', handleObserverUpdate);
    };
  }, [setSession, setPhase, setParticipants, setTimeRemaining, setObserverCount, navigate]);

  return {
    sessionId,
    phase,
    participants,
    subQuestions,
    timeRemaining,
    myAnswers,
    observerCount,
    joinSession,
    setReady,
    submitAnswer,
    leaveSession,
    updateAnswer, // Local state update for the editor
  };
};
