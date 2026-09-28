import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import objectsApi from '../../../core/api/objects.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { useMetadata } from '../../../core/context/MetadataContext.jsx';
import {
  emptyObjectDraft,
  toCreateObjectPayload,
  validateObjectDraft,
} from '../../../shared/dto/object.dto.js';
import { pluralise, toApiName } from '../../../core/utils/formatters.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import WizardShell from '../components/WizardShell.jsx';
import ObjectAppearance from '../components/ObjectAppearance.jsx';
import { Input, Textarea } from '../../../core/components/ui/Input.jsx';
import { Toggle } from '../../../core/components/ui/Toggle.jsx';
import ValidationMessage from '../../../core/components/form/ValidationMessage.jsx';
import ObjectReviewSummary from '../components/ObjectReviewSummary.jsx';

const STEPS = [
  { id: 'basic', label: 'Basic Information', hint: 'Name and description' },
  { id: 'settings', label: 'Object Settings', hint: 'Icon, colour, behaviour' },
  { id: 'review', label: 'Review & Publish', hint: 'Confirm and create' },
];

/** Admin screen 3 — Create Object, 3-step wizard. */
export function ObjectCreatePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { invalidate } = useMetadata();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({ ...emptyObjectDraft(), publishNow: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const patch = (changes) => setDraft((current) => ({ ...current, ...changes }));

  const onLabelChange = (label) =>
    patch({
      label,
      apiName: draft.apiNameTouched ? draft.apiName : toApiName(label),
      pluralLabel: draft.pluralTouched ? draft.pluralLabel : pluralise(label),
    });

  const next = () => {
    if (step === 0) {
      const found = validateObjectDraft(draft);
      setErrors(found);
      if (Object.keys(found).length) return;
    }
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const finish = async () => {
    const found = validateObjectDraft(draft);
    setErrors(found);
    if (Object.keys(found).length) {
      setStep(0);
      return;
    }
    setSubmitting(true);
    try {
      const created = await objectsApi.create(toCreateObjectPayload(draft));
      if (draft.publishNow) await objectsApi.publish(created.objectId);
      await invalidate();
      toast.success(
        'Object created',
        draft.publishNow ? `${created.label} is published` : `${created.label} saved as a draft`,
      );
      navigate(`/admin/objects/${created.objectId}`);
    } catch (err) {
      if (err.isValidation) setErrors(err.toFieldErrors());
      toast.fromError(err, 'Could not create object');
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Create New Object"
        subtitle="Define a new object to store your data"
        icon={LayoutGrid}
        back="/admin/objects"
        breadcrumbs={[{ label: 'Objects', to: '/admin/objects' }, { label: 'New object' }]}
      />

      <WizardShell
        title="Create New Object"
        description="Define a new object to store your data"
        steps={STEPS}
        step={step}
        onStepChange={setStep}
        onCancel={() => navigate('/admin/objects')}
        onBack={() => setStep((current) => current - 1)}
        onNext={next}
        onFinish={finish}
        finishLabel={draft.publishNow ? 'Create & Publish' : 'Create Object'}
        submitting={submitting}
      >
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="mf-label">
                Object Label <span className="text-rose-500">*</span>
              </label>
              <Input
                autoFocus
                value={draft.label}
                invalid={Boolean(errors.label)}
                placeholder="Customer"
                onChange={(event) => onLabelChange(event.target.value)}
              />
              <ValidationMessage message={errors.label} />
            </div>

            <div>
              <label className="mf-label">
                Object API Name <span className="text-rose-500">*</span>
              </label>
              <Input
                value={draft.apiName}
                invalid={Boolean(errors.apiName)}
                placeholder="customer"
                onChange={(event) => patch({ apiName: event.target.value, apiNameTouched: true })}
              />
              <ValidationMessage message={errors.apiName} />
            </div>

            <div>
              <label className="mf-label">Plural Label</label>
              <Input
                value={draft.pluralLabel}
                placeholder="Customers"
                onChange={(event) => patch({ pluralLabel: event.target.value, pluralTouched: true })}
              />
            </div>

            <div>
              <label className="mf-label">Description</label>
              <Textarea
                rows={3}
                value={draft.description}
                placeholder="Stores customer related information"
                onChange={(event) => patch({ description: event.target.value })}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <ObjectAppearance
              icon={draft.icon}
              color={draft.color}
              onIconChange={(icon) => patch({ icon })}
              onColorChange={(color) => patch({ color })}
            />
            <div className="flex items-start justify-between gap-4 rounded-lg bg-slate-50 px-3.5 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Publish immediately</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Leave off to keep the object as a draft while you add fields.
                </p>
              </div>
              <Toggle checked={draft.publishNow} onChange={(publishNow) => patch({ publishNow })} />
            </div>
          </div>
        )}

        {step === 2 && <ObjectReviewSummary draft={draft} />}
      </WizardShell>
    </>
  );
}

export default ObjectCreatePage;
