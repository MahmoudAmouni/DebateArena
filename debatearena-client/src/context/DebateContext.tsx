import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { DebatePhase, Participant as SessionParticipant } from '@/types';

interface DebateState {
  sessionId: string | null;
  phase: DebatePhase | null;
  participants: SessionParticipant[];
  subQuestions: string[];
  timeRemaining: number;
  myAnswers: Record<number, string>;
  observerCount: number;
}

type DebateAction =
  | { type: 'SET_SESSION'; payload: { sessionId: string; participants: SessionParticipant[]; subQuestions: string[] } }
  | { type: 'SET_PHASE'; payload: DebatePhase }
  | { type: 'SET_PARTICIPANTS'; payload: SessionParticipant[] }
  | { type: 'SET_TIME'; payload: number }
  | { type: 'UPDATE_ANSWER'; payload: { index: number; content: string } }
  | { type: 'SET_OBSERVER_COUNT'; payload: number }
  | { type: 'CLEAR_DEBATE' };

const initialState: DebateState = {
  sessionId: null,
  phase: null,
  participants: [],
  subQuestions: [],
  timeRemaining: 0,
  myAnswers: {},
  observerCount: 0,
};

const debateReducer = (state: DebateState, action: DebateAction): DebateState => {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        ...state,
        sessionId: action.payload.sessionId,
        participants: action.payload.participants,
        subQuestions: action.payload.subQuestions,
      };
    case 'SET_PHASE':
      return {
        ...state,
        phase: action.payload,
      };
    case 'SET_PARTICIPANTS':
      return {
        ...state,
        participants: action.payload,
      };
    case 'SET_TIME':
      return {
        ...state,
        timeRemaining: action.payload,
      };
    case 'UPDATE_ANSWER':
      return {
        ...state,
        myAnswers: {
          ...state.myAnswers,
          [action.payload.index]: action.payload.content,
        },
      };
    case 'SET_OBSERVER_COUNT':
      return {
        ...state,
        observerCount: action.payload,
      };
    case 'CLEAR_DEBATE':
      return initialState;
    default:
      return state;
  }
};

interface DebateContextType extends DebateState {
  setSession: (sessionId: string, participants: SessionParticipant[], subQuestions: string[]) => void;
  setPhase: (phase: DebatePhase) => void;
  setParticipants: (participants: SessionParticipant[]) => void;
  setTimeRemaining: (time: number) => void;
  updateAnswer: (index: number, content: string) => void;
  setObserverCount: (count: number) => void;
  clearDebate: () => void;
}

const DebateContext = createContext<DebateContextType | undefined>(undefined);

export const DebateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(debateReducer, initialState);

  const setSession = useCallback((sessionId: string, participants: SessionParticipant[], subQuestions: string[]) => {
    dispatch({ type: 'SET_SESSION', payload: { sessionId, participants, subQuestions } });
  }, []);

  const setPhase = useCallback((phase: DebatePhase) => {
    dispatch({ type: 'SET_PHASE', payload: phase });
  }, []);

  const setParticipants = useCallback((participants: SessionParticipant[]) => {
    dispatch({ type: 'SET_PARTICIPANTS', payload: participants });
  }, []);

  const setTimeRemaining = useCallback((time: number) => {
    dispatch({ type: 'SET_TIME', payload: time });
  }, []);

  const updateAnswer = useCallback((index: number, content: string) => {
    dispatch({ type: 'UPDATE_ANSWER', payload: { index, content } });
  }, []);

  const setObserverCount = useCallback((count: number) => {
    dispatch({ type: 'SET_OBSERVER_COUNT', payload: count });
  }, []);

  const clearDebate = useCallback(() => {
    dispatch({ type: 'CLEAR_DEBATE' });
  }, []);

  return (
    <DebateContext.Provider
      value={{
        ...state,
        setSession,
        setPhase,
        setParticipants,
        setTimeRemaining,
        updateAnswer,
        setObserverCount,
        clearDebate,
      }}
    >
      {children}
    </DebateContext.Provider>
  );
};

export const useDebateContext = () => {
  const context = useContext(DebateContext);
  if (context === undefined) {
    throw new Error('useDebateContext must be used within a DebateProvider');
  }
  return context;
};
