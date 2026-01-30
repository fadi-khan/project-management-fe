"use client"
import { useState, useCallback, useRef } from 'react';

const validateField = async (schema: any, fieldName: string, value: any, allValues: any) => {
  try {
    const dataToValidate = { ...allValues, [fieldName]: value };
    await schema.validateAt(fieldName, dataToValidate);
    return { isValid: true, error: null };
  } catch (error: any) {
    return { isValid: false, error: error.message };
  }
};

const validateForm = async (schema: any, data: any) => {
  try {
    const validatedData = await schema.validate(data, { abortEarly: false });
    return { isValid: true, data: validatedData, errors: {} as Record<string, string> };
  } catch (error: any) {
    const errors: Record<string, string> = {};
    error.inner?.forEach((err: any) => {
      if (err.path) errors[err.path] = err.message;
    });
    return { isValid: false, data: null, errors };
  }
};

export const useFormValidation = (schema: any, options: any) => {
  const {
    initialValues = {},
    validateOnChange = true,
    validateOnBlur = true,
  } = options;

  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const valuesRef = useRef(values);
  const errorsRef = useRef(errors);
  
  valuesRef.current = values;
  errorsRef.current = errors;

  const handleChange = useCallback((fieldName: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldName]: value }));
    
    if (errorsRef.current[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }

    if (fieldName === 'password' && errorsRef.current['confirmPassword']) {
      setErrors(prev => {
        const { confirmPassword, ...rest } = prev;
        return rest;
      });
    }
  }, []);

  const handleBlur = useCallback(async (fieldName: string) => {
    if (!validateOnBlur) return;
    
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    const value = valuesRef.current[fieldName];
    const result = await validateField(schema, fieldName, value, valuesRef.current);
    
    if (!result.isValid) {
      setErrors(prev => ({ ...prev, [fieldName]: result.error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, [schema, validateOnBlur]);

  const handleSubmit = useCallback(async (onSubmit: (data: any) => void, onError?: (errors: any) => void) => {
    setIsSubmitting(true);
    try {
      const allFields = Object.keys(schema.fields || {});
      const newTouched: Record<string, boolean> = {};
      allFields.forEach(field => { newTouched[field] = true; });
      setTouched(newTouched);

      const result = await validateForm(schema, valuesRef.current);
      
      if (result.isValid) {
        if (onSubmit) await onSubmit(result.data);
        return { success: true, data: result.data };
      } else {
        setErrors(result.errors);
        if (onError) onError(result.errors);
        return { success: false, errors: result.errors };
      }
    } catch (error) {
      const errorMessage = 'Submission failed';
      if (onError) onError({ general: errorMessage });
      return { success: false, errors: { general: errorMessage } };
    } finally {
      setIsSubmitting(false);
    }
  }, [schema]);

  const isNestedFieldTouched = useCallback((fieldPath: string) => {
    if (touched[fieldPath]) return true;
    const arrayMatch = fieldPath.match(/^([^[]+)\[\d+\]\..+$/);
    if (arrayMatch) return touched[arrayMatch[1]];
    return false;
  }, [touched]);

  const hasFieldError = useCallback((fieldName: string) => {
    return !!(errorsRef.current[fieldName] && (touched[fieldName] || isNestedFieldTouched(fieldName)));
  }, [touched, isNestedFieldTouched]);

  const getFieldError = useCallback((fieldName: string) => {
    return errorsRef.current[fieldName] || '';
  }, []);

  const getNestedFieldError = useCallback((arrayFieldName: string, index: number, nestedFieldName: string) => {
    const errorPath = `${arrayFieldName}[${index}].${nestedFieldName}`;
    return errorsRef.current[errorPath] || '';
  }, []);

  const hasNestedFieldError = useCallback((arrayFieldName: string, index: number, nestedFieldName: string) => {
    const errorPath = `${arrayFieldName}[${index}].${nestedFieldName}`;
    return !!(errorsRef.current[errorPath] && (touched[arrayFieldName] || touched[errorPath]));
  }, [touched]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values, errors, touched, isSubmitting,
    handleChange, handleBlur, handleSubmit,
    hasFieldError, getFieldError, hasNestedFieldError,
    getNestedFieldError, resetForm,
  };
};
