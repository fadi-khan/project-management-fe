import { Field, Label, Select } from '@headlessui/react'

interface SelectOption {
    value: string;
    label: string;
}

interface SelectDropDownProps {
    name: string;
    label: string;
    options: SelectOption[];
    onChange: (name: string, value: string) => void;
    onBlur: (name: string) => void;
    error?: string;
}

export function SelectDropDown({
    name,
    label,
    options,
    onChange,
    onBlur,
    error
}: SelectDropDownProps) {

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(name, e.target.value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
        onBlur(name);
    };

    return (
        <Field className={'w-full items-start my-2 text-blue-800 '}>
            <Label className="text-blue-900 text-sm/6 font-medium ">{label}</Label>
            <Select
                className={'cursor-pointer w-full px-3 py-1.5 mt-2 rounded-sm borde text-blue-900 border-blue-800 focus:outline-2'}
                onChange={handleChange}
                onBlur={handleBlur}
                name={name}>


                {
                    options.map((option, index) => (

                        <option className='rounded-lg hover:bg-blue-800 text-blue-900' key={index} value={option.value}>
                            {option.label}
                        </option>

                    ))
                }


            </Select>
            <Label className="text-sm/6 font-small  h-6 font-bold  text-red-500 ">
                {error && error}
            </Label>
        </Field>
    )
}