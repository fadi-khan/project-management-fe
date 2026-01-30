import { useCreateProject } from '@/lib/hooks/useProjectQueries'
import { useUpdateProject } from '@/lib/hooks/useProjectQueries'
import { useFormValidation } from '@/lib/validations/hooks/useFormValidation'
import { projectValidationSchema } from '@/lib/validations/schemas/projectValidations'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Field, Label, Select, Textarea } from '@headlessui/react'
import { ProjectStatus } from '@/data/enums/ProjectStatus'
import { ValidateInput } from '@/components/inputs/ValidateInput'

export function ProjectWizard({
  project,
  isProjectOpen,
  toggleProject
}: {
  project?: any
  isProjectOpen: boolean
  toggleProject: () => void
}) {
  const updateProject = useUpdateProject()
  const createProject = useCreateProject()

  const isEditing = !!project;
  const { handleBlur, handleSubmit, handleChange, values: formData, getFieldError, hasFieldError } =
    useFormValidation(projectValidationSchema, {
      initialValues: {
        name: project?.name ?? '',
        description: project?.description ?? '',
        status: project?.status ?? ProjectStatus.ARCHIVED,
      },
    })

  const onSubmit = async (data: any) => {

    const payload = {
      name: data.name,
      description: data.description,
      ...(data.status ? { status: data.status } : {}),
    }
    if (isEditing) {

      await updateProject.mutateAsync({
        id: project.id,
        data: payload,
      })
      toggleProject()
    } else {
      await createProject.mutateAsync(payload)
      toggleProject()
    }
  }

  return (

    <Dialog

      open={isProjectOpen} onClose={toggleProject} as="div"   >
      <DialogBackdrop
        onClick={toggleProject}
        transition
        className=" fixed z-40! inset-0 bg-black/60 transition-opacity data-closed:opacity-0"
      />
      <DialogPanel className="w-full max-w-md mx-4 sm:mx-auto p-4 sm:p-6 bg-white rounded-lg border-2 border-blue-900 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <DialogTitle className="text-xl sm:text-2xl font-bold text-blue-900 mb-4">
          {isEditing ? 'Edit Project' : 'Create Project'}
        </DialogTitle>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit) }} className="space-y-4">
          <ValidateInput
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={hasFieldError('name') ? getFieldError('name') : undefined}
            name="name"
            label="Project Name *"
          />

          <Field>
            <Label className="text-sm font-medium text-blue-900 block mb-1">Project Status</Label>
            <Select
              className="w-full px-3 py-2 border border-blue-800 rounded-md focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              {Object.values(ProjectStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
            {hasFieldError('status') && <p className="text-red-500 text-sm mt-1">{getFieldError('status')}</p>}
          </Field>

          <Field>
            <Label className="text-sm font-medium text-blue-900 block mb-1">Project Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              name="description"
              rows={4}
              className="w-full px-3 py-2 border border-blue-800 rounded-md focus:ring-2 focus:ring-blue-900 focus:border-blue-900 resize-none"
            />
            {hasFieldError('description') && <p className="text-red-500 text-sm mt-1">{getFieldError('description')}</p>}
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={updateProject.isPending || createProject.isPending}
              onClick={toggleProject}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-60"
              disabled={updateProject.isPending || createProject.isPending}
            >
              {updateProject.isPending || createProject.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </DialogPanel>

    </Dialog>
  )
}