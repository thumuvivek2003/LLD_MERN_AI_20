import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ListTree } from 'lucide-react';
import useObject from '../../../core/hooks/useObject.js';
import useFields from '../../../core/hooks/useFields.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import {
  emptyFieldDraft,
  toFieldPayload,
  validateFieldDraft,
} from '../../../shared/dto/field.dto.js';
import { FIELD_TYPE } from '../../../shared/enums/field-type.enum.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import WizardShell from '../components/WizardShell.jsx';
import FieldInfoStep from '../components/field/FieldInfoStep.jsx';
import FieldSettingsStep from '../components/field/FieldSettingsStep.jsx';
import FieldValidationStep from '../components/field/FieldValidationStep.jsx';
import FieldReviewStep from '../components/field/FieldReviewStep.jsx';

const STEPS = [
  { id: 'info', label: 'Field Information', hint: 'Label, API name, type' },
  { id: 'settings', label: 'Field Settings', hint: 'Behaviour and options' },
  { id: 'validation', label: 'Validation', hint: 'Rules and constraints' },
  { id: 'review', label: 'Review', hint: 'Confirm and create' },
];

/** Admin screen 7 — Add Field, 4-step wizard (Lookup builder appears for LOOKUP). */
export function FieldCreatePage() {
  const { oid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  const { object } = useObject(oid);
  const { create } = useFields(oid);

  const initialType = Object.values(FIELD_TYPE).includes(params.get('type'))
    ? params.get('type')
    : FIELD_TYPE.TEXT;

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(emptyFieldDraft(initialType));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const next = () => {
    const found = validateFieldDraft(draft);
    if (step === 0 && (found.label || found.apiName || found.type)) {
      setErrors(found);
      return;
    }
    if (step === 1 && (found.options || found.lookupObject || found.lookupDisplay)) {
      setErrors(found);
      return;
    }
    if (step === 2 && found.regex) {
      setErrors(found);
      return;
    }
    setErrors({});
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const finish = async () => {
    const found = validateFieldDraft(draft);
    if (Object.keys(found).length) {
      setErrors(found);
      setStep(found.label || found.apiName ? 0 : 1);
      return;
    }
    setSubmitting(true);
    try {
      await create(toFieldPayload(draft));
      toast.success('Field created', `${draft.label} added to ${object?.label ?? 'object'}`);
      navigate(`/admin/objects/${oid}?tab=fields`);
    } catch (err) {
      if (err.isValidation) setErrors(err.toFieldErrors());
      toast.fromError(err, 'Could not create field');
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Add New Field"
        subtitle="Define field properties"
        icon={ListTree}
        back={`/admin/objects/${oid}?tab=fields`}
        breadcrumbs={[
          { label: 'Objects', to: '/admin/objects' },
          { label: object?.label ?? oid, to: `/admin/objects/${oid}` },
          { label: 'Add field' },
        ]}
      />

      <WizardShell
        title="Add New Field"
        description="Define field properties"
        steps={STEPS}
        step={step}
        onStepChange={setStep}
        onCancel={() => navigate(`/admin/objects/${oid}?tab=fields`)}
        onBack={() => setStep((current) => current - 1)}
        onNext={next}
        onFinish={finish}
        finishLabel="Add Field"
        submitting={submitting}
      >
        {step === 0 && <FieldInfoStep draft={draft} onChange={setDraft} errors={errors} />}
        {step === 1 && (
          <FieldSettingsStep draft={draft} onChange={setDraft} errors={errors} objectId={oid} />
        )}
        {step === 2 && <FieldValidationStep draft={draft} onChange={setDraft} errors={errors} />}
        {step === 3 && <FieldReviewStep draft={draft} objectLabel={object?.label ?? oid} />}
      </WizardShell>
    </>
  );
}

export default FieldCreatePage;
