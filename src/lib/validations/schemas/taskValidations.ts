import { TaskStatus } from '@/data/enums/TaskStatus';
import { TaskPriority } from '@/data/enums/TaskPriority';
import * as yup from 'yup';

export const taskValidationSchema = yup.object().shape({
  title: yup
    .string()
    .required('Task title is required')
    .min(3, 'Task title must be at least 3 characters'),
  description: yup
    .string()
    .required('Task description is required')
    .min(5, 'Task description must be at least 5 characters')
    .max(500, 'Task description must be at most 500 characters'),
  status: yup
    .mixed<TaskStatus>()
    .oneOf(Object.values(TaskStatus))
    .required('Task status is required'),
  priority: yup
    .mixed<TaskPriority>()
    .oneOf(Object.values(TaskPriority))
    .required('Task priority is required'),
  assignedToId: yup
    .string()
    .optional(),
  dueDate: yup
    .date()
    .min(new Date(Date.now() + 24 * 60 * 60 * 1000), 'Due date must be in the future')
    .required('Due date is required')
  

});
