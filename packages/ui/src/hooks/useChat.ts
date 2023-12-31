import { marked } from 'marked';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState } from 'react';
import { useUpdateEffect } from 'react-use';

import { socket } from '../socket';

export type Message = {
  $id: string;
  /** contains unparsed markdown string; used for bot only*/
  raw?: string;
  /** formatted html string parsed from markdown */
  text: string;
  sender: 'user' | 'bot';
};

export type Meta = {
  /** state of socket connection */
  connected: boolean;
  /** chatbot service healthy status; ie openai is down */
  healthy: boolean;
  /** latest received message timestamp */
  timestamp: Date;
};

export type Send = (text: string) => void;

export function useChat(bot: 'llama' | 'openapi'): [Message[], Meta, Send] {
  const [meta, setMeta] = useState<Meta>({
    connected: false,
    healthy: true,
    timestamp: undefined
  });

  const [messages, setMessages] = useState<Message[]>([]);

  const send = useCallback(
    (text: string) => {
      socket.emit(`ask::${bot}`, text);

      setMeta(prev => ({
        ...prev,
        timestamp: null
      }));

      setMessages(prev => {
        return [
          ...prev,
          { $id: nanoid(), sender: 'user', text },
          { $id: nanoid(), sender: 'bot', text: '' }
        ];
      });
    },
    [bot]
  );

  useEffect(() => {
    socket.connect();

    socket.on('health', msg => {
      setMeta(prev => ({
        ...prev,
        healthy: !!msg.status
      }));

      if (!msg.status) {
        console.debug(msg.description);
      }
    });

    socket.on('connect_error', e => {
      console.error('chatbot::connect_error', e.message);
      setMeta(prev => ({
        ...prev,
        connected: false
      }));
    });

    socket.on('connect', () => {
      setMeta(prev => ({
        ...prev,
        connected: true
      }));
    });

    socket.on('disconnect', () => {
      setMeta(prev => ({
        ...prev,
        connected: false
      }));
    });

    socket.on('references', e => {
      console.debug('chatbot::references', e.metadata);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('health');
      socket.off('references');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setMessages(() => []);

    socket.on(`answer::${bot}`, msg => {
      if (msg === '<END>') {
        setMessages(prev => [
          ...prev.slice(0, -1),
          {
            $id: prev[prev.length - 1].$id,
            raw: prev[prev.length - 1].raw,
            sender: 'bot',
            text: marked.parse(prev[prev.length - 1].raw) as string
          }
        ]);

        return setMeta(prev => ({
          ...prev,
          timestamp: new Date()
        }));
      }

      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          $id: prev[prev.length - 1].$id,
          raw: (prev[prev.length - 1].raw || '') + msg,
          sender: 'bot',
          text: marked.parse((prev[prev.length - 1].raw || '') + msg) as string
        }
      ]);
    });

    return () => {
      socket.off(`answer::${bot}`);
    };
  }, [bot]);

  useUpdateEffect(() => {
    /** only prompt the user with the initial message when */
    if (meta.connected && !messages.length) {
      setMessages(() => [
        {
          $id: nanoid(),
          raw: '',
          sender: 'bot',
          text: `Hi, how can we help you today?`
        }
      ]);
    }
  }, [meta.connected, bot]);

  return [messages, meta, send];
}
