import { Server, Socket } from 'socket.io';

class AiServicePlaceholder {
  async factCheck(sessionId: string, userId: string, claimText: string, messageId?: string) {
    return { verdict: 'supported', explanation: 'AI logic will be implemented in Step 61', sources: [] };
  }
  async research(sessionId: string, userId: string, queryText: string) {
    return { wasDeclined: false, response: 'Research logic will be implemented in Step 61', sources: [] };
  }
}

const aiService = new AiServicePlaceholder();

export const registerAiHandlers = (io: Server, socket: Socket) => {
  socket.on('ai:fact_check', async (payload: { sessionId: string; claimText: string; messageId?: string }, callback) => {
    try {
      if (!socket.user?.id) throw new Error('Unauthorized');
      const result = await aiService.factCheck(payload.sessionId, socket.user.id, payload.claimText, payload.messageId);
      io.to(`session:${payload.sessionId}`).emit('ai:fact_check_result', result);
      if (callback) callback({ success: true, data: result });
    } catch (error: any) {
      if (callback) callback({ success: false, error: error.message });
    }
  });

  socket.on('ai:research', async (payload: { sessionId: string; queryText: string }, callback) => {
    try {
      if (!socket.user?.id) throw new Error('Unauthorized');
      const result = await aiService.research(payload.sessionId, socket.user.id, payload.queryText);
      
      if ((result as any).wasDeclined) {
        socket.emit('ai:request_declined', result);
      } else {
        io.to(`session:${payload.sessionId}`).emit('ai:research_result', result);
      }
      
      if (callback) callback({ success: true, data: result });
    } catch (error: any) {
      if (callback) callback({ success: false, error: error.message });
    }
  });
};
