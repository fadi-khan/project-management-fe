import { useCreateTask } from '@/lib/hooks/useTaskQueries'
import { useFormValidation } from '@/lib/validations/hooks/useFormValidation'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Field, Label, Select, Textarea, Input } from '@headlessui/react'
import { TaskStatus } from '@/data/enums/TaskStatus'
import { TaskPriority } from '@/data/enums/TaskPriority'
import { ValidateInput } from '@/components/inputs/ValidateInput'
import { taskValidationSchema } from '@/lib/validations/schemas/taskValidations'

interface TaskWizardProps {
  projectId: number|null
  isTaskOpen: boolean
  toggleTask: () => void
  users?: any[],
  viewOnly?:boolean
  task?:any
}

export function TaskWizard({ projectId, isTaskOpen, toggleTask, users = [], viewOnly , task }: TaskWizardProps) {
  const createTask = useCreateTask()

  const { handleBlur, handleSubmit, handleChange, values: formData, getFieldError, hasFieldError } =
    useFormValidation(taskValidationSchema, {
      initialValues: {
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || TaskStatus.TODO,
        priority: task?.priority || TaskPriority.LOW,
        assignedToId: task?.assignedToId || '',
        dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      },
    })

  const onSubmit = async (data: any) => {
    const payload = {
      title: data.title,
      description: data.description,
      projectId: Number(projectId),
      status: data.status,
      priority: data.priority,
      ...(data.assignedToId ? { assignedToId: Number(data.assignedToId) } : {}),
      dueDate: data.dueDate,
    }
    await createTask.mutateAsync(payload)
    toggleTask()
  }

  return (
    <Dialog open={isTaskOpen} onClose={toggleTask} as="div">
      <DialogBackdrop
        onClick={toggleTask}
        transition
        className="fixed z-40 inset-0 bg-black/60 transition-opacity data-closed:opacity-0"
      />
      <DialogPanel className="w-full max-w-md lg:max-w-xl mx-4 sm:mx-auto p-4 sm:p-6 bg-white rounded-lg border-2 border-blue-900 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <DialogTitle className="text-xl sm:text-2xl font-bold text-blue-900 mb-8">
          {viewOnly=== true ? "View Task" : "Create New Task"}
        </DialogTitle>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit) }} className="space-y-4">
          <div className="flex  gap-4">
              <ValidateInput
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={hasFieldError('title') ? getFieldError('title') : undefined}
            name="title"
            label="Task Title *"
            disabled={viewOnly===true}
          />

           <Field className={'mt-4  w-full'}>
            <Label className="text-sm font-medium text-blue-900 block mb-1">Due Date *</Label>
            <Input
              type="date"
              disabled={viewOnly===true}
              value={formData.dueDate || ''}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              onBlur={() => handleBlur('dueDate')}
              name="dueDate"
              className="w-full px-3 py-1.5 border border-blue-800 rounded-md focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
            />
            {hasFieldError('dueDate') && <p className="font-bold text-red-500 text-sm ">{getFieldError('dueDate')}</p>}
          </Field>
          </div>

          <div className="flex  gap-4">
            <Field className={'lg:w-full w-1/2'}>
            <Label className="text-sm font-medium text-blue-900 block mb-1">Task Status</Label>
            <Select
              disabled={viewOnly===true}
              className="w-full px-3 py-2 border border-blue-800 rounded-md focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              {Object.values(TaskStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
            {hasFieldError('status') && <p className="text-red-500 text-sm mt-1">{getFieldError('status')}</p>}
          </Field>

          <Field className={'lg:w-full w-1/2'}>
            <Label className="text-sm font-medium text-blue-900 block mb-1">Task Priority</Label>
            <Select
              disabled={viewOnly===true}
              className="w-full px-3 py-2 border border-blue-800 rounded-md focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
            >
              {Object.values(TaskPriority).map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </Select>
            {hasFieldError('priority') && <p className="text-red-500 text-sm mt-1">{getFieldError('priority')}</p>}
          </Field>
          </div>

          <Field>
            <Label className="text-sm font-medium text-blue-900 block mb-1">Assigned To</Label>
            <Select
              className="w-full px-3 py-2 border border-blue-800 rounded-md focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
              value={formData.assignedToId}
              onChange={(e) => handleChange('assignedToId', e.target.value)}
              disabled={viewOnly===true}
            >
              <option value="">Unassigned</option>
              {users.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </Select>
            {hasFieldError('assignedToId') && <p className="text-red-500 text-sm mt-1">{getFieldError('assignedToId')}</p>}
          </Field>

          <Field>
            <Label className="text-sm font-medium text-blue-900 block mb-1">Task Description *</Label>
            <Textarea
              disabled={viewOnly===true}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              name="description"
              rows={4}
              className="w-full px-3 py-2 border max-h-[400px] border-blue-800 rounded-md focus:ring-2 focus:ring-blue-900 focus:border-blue-900 resize-none"
            />
            {hasFieldError('description') && <p className="font-bold text-red-500 text-sm ">{getFieldError('description')}</p>}
          </Field>

         

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={createTask.isPending}
              onClick={toggleTask}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${viewOnly===true ? 'hidden' : ''} px-4 py-2 text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-60`}
              disabled={createTask.isPending}
            >
              {createTask.isPending ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </DialogPanel>
    </Dialog>
  )
}
