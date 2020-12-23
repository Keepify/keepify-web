import { errorNotification } from 'helpers/notification';
import { useEffect } from 'react';
import { DeepMap, FieldError } from 'react-hook-form';

/**
 * Displays the form's input errors
 */
export const useFormError = (errors: DeepMap<any, FieldError>) => {
  useEffect(() => {
    console.log({ errors });
    const keys = Object.keys(errors);

    if (keys.length) {
      errorNotification('Error', errors[keys[0]].message);
    }
  }, [errors]);
};
