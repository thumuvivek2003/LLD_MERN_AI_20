// hooks/useForm.js
import { useState } from 'react';

export const useForm = (initialValues = {}, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await onSubmit(values);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.response?.data?.message || 'An error occurred' });
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setLoading(false);
  };

  const setFieldValue = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const setFieldError = (name, error) => {
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  return {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    setValues,
  };
};