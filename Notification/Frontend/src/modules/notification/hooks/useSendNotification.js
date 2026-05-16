import { useState } from 'react';
import {
  sendNotification,
  sendGroupNotification,
} from '../services/notification.service.js';

export function useSendNotification() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function send(payload) {
    setSubmitting(true);
    setError(null);
    try {
      const data = await sendNotification(payload);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  async function sendGroup(payload) {
    setSubmitting(true);
    setError(null);
    try {
      const data = await sendGroupNotification(payload);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  return { send, sendGroup, submitting, result, error };
}
