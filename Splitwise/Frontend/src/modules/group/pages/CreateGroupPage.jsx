import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Sparkles } from 'lucide-react';
import { api } from '../../../shared/api.js';
import { useApp } from '../../../shared/context/AppContext.jsx';
import Button from '../../../shared/components/Button.jsx';
import Input from '../../../shared/components/Input.jsx';
import PageHeader from '../../../shared/components/PageHeader.jsx';

export default function CreateGroupPage() {
  const navigate = useNavigate();
  const { activeUser, success, error: errorToast } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const data = await api.createGroup({
        name: name.trim(),
        description: description.trim(),
        createdBy: activeUser.userId
      });
      success('Group created');
      navigate(`/groups/${data.group.groupId}`);
    } catch (err) {
      errorToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 max-w-xl mx-auto">
      <PageHeader title="New group" subtitle="Start splitting with friends" />

      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Group details</h2>
            <p className="text-xs text-slate-500">You'll be added as the creator.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Group name"
            placeholder="Goa Trip 2025"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={60}
          />
          <Input
            label="Description (optional)"
            placeholder="Beach holiday with college friends"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
          />
          <Button
            type="submit"
            disabled={submitting || !name.trim()}
            className="w-full"
            size="lg"
          >
            <Sparkles className="w-5 h-5" />
            {submitting ? 'Creating...' : 'Create group'}
          </Button>
        </form>
      </div>
    </div>
  );
}
