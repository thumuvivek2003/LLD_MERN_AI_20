import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../shared/context/UserContext.jsx';
import { useToast } from '../../../shared/context/ToastContext.jsx';
import { MailService } from '../../../shared/services/MailService.js';
import ComposeForm from '../components/ComposeForm.jsx';

export default function ComposePage() {
  const { users, currentUser } = useUser();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);

  const handleSend = async ({ to, subject, body }) => {
    setSending(true);
    try {
      await MailService.send({
        senderId: currentUser.id,
        to,
        subject: subject || '(no subject)',
        body,
      });
      pushToast({
        variant: 'success',
        title: 'Message sent',
        message: `Delivered to ${to.length} recipient${
          to.length === 1 ? '' : 's'
        }.`,
      });
      navigate('/sent');
    } catch (e) {
      pushToast({
        variant: 'error',
        title: 'Failed to send',
        message: e.message || 'Please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
          Compose
        </h1>
        <p className="mt-0.5 text-sm text-slate-400">Create a new email</p>
      </div>

      <ComposeForm
        users={users}
        currentUserId={currentUser?.id}
        onSend={handleSend}
        onCancel={() => navigate(-1)}
        sending={sending}
      />
    </div>
  );
}
