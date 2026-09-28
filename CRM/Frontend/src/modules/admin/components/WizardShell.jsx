import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../../../core/components/ui/Card.jsx';
import { Stepper } from '../../../core/components/ui/Stepper.jsx';
import Button from '../../../core/components/ui/Button.jsx';

/**
 * Shared chrome for the Create Object (3 steps) and Add Field (4 steps) wizards:
 * a vertical stepper rail on the left, the step body on the right, Cancel / Back / Next.
 */
export function WizardShell({
  title,
  description,
  steps,
  step,
  onStepChange,
  onCancel,
  onBack,
  onNext,
  onFinish,
  finishLabel = 'Create',
  nextDisabled = false,
  submitting = false,
  children,
}) {
  const isLast = step === steps.length - 1;

  return (
    <Card>
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[210px_1fr]">
        <Stepper steps={steps} current={step} onSelect={onStepChange} />
        <div className="min-w-0 rounded-xl border border-slate-200 p-5">{children}</div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        {step > 0 && (
          <Button variant="secondary" icon={ChevronLeft} onClick={onBack} disabled={submitting}>
            Back
          </Button>
        )}
        {isLast ? (
          <Button onClick={onFinish} loading={submitting}>
            {finishLabel}
          </Button>
        ) : (
          <Button iconRight={ChevronRight} onClick={onNext} disabled={nextDisabled || submitting}>
            Next
          </Button>
        )}
      </div>
    </Card>
  );
}

export default WizardShell;
