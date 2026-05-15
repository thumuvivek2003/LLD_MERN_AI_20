import EqualSplitForm from '../components/EqualSplitForm.jsx';
import ExactSplitForm from '../components/ExactSplitForm.jsx';
import PercentSplitForm from '../components/PercentSplitForm.jsx';

const REGISTRY = {
  EQUAL: EqualSplitForm,
  EXACT: ExactSplitForm,
  PERCENT: PercentSplitForm
};

export function getSplitFormComponent(splitType) {
  return REGISTRY[splitType] || EqualSplitForm;
}

export default { getSplitFormComponent };
