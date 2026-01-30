import { ProjectStatus } from '@/data/enums/ProjectStatus';
import * as yup from 'yup';

export const projectValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Project name is required')
    .min(3, 'Project name must be at least 3 characters'),
  description: yup
    .string()
    .required('Project description is required')
    .min(5, 'Project description must be at least 5 characters'),
  status: yup
    .mixed<ProjectStatus>()
    .oneOf(Object.values(ProjectStatus))
    .optional(),
});
