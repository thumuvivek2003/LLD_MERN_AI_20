import { useState } from 'react';
import { Input, Select } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import { USER_ROLES, ROLE_LABEL } from '../../../core/constants/roles.constants.js';
import { validateEmail, validatePassword } from '../../../core/utils/validation.util.js';

export const RegisterForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phoneNumber: '', address: '', role: USER_ROLES.CUSTOMER,
  });
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Name required';
    if (!validateEmail(form.email)) next.email = 'Valid email required';
    if (!validatePassword(form.password)) next.password = 'Min 6 characters';
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(form);
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <form onSubmit={submit}>
      <Input label="Name" value={form.name} onChange={set('name')} error={errors.name} />
      <Input label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} />
      <Input label="Password" type="password" value={form.password} onChange={set('password')} error={errors.password} />
      <Input label="Phone" value={form.phoneNumber} onChange={set('phoneNumber')} />
      <Input label="Address" value={form.address} onChange={set('address')} />
      <Select label="I am a" value={form.role} onChange={set('role')}>
        {Object.values(USER_ROLES).filter((r) => r !== USER_ROLES.SYSTEM_ADMIN).map((r) => (
          <option key={r} value={r}>{ROLE_LABEL[r]}</option>
        ))}
      </Select>
      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? 'Creating…' : 'Create account'}
      </Button>
    </form>
  );
};
