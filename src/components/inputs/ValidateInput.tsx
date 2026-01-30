import { Description, Field, Input, Label } from "@headlessui/react"

interface ValidateInputProps {
    value: string;
    label: string;
    onChange: (name: string, value: string) => void;
    onBlur: (name: string) => void;
    name: string;
    error:string|undefined;
    disabled?:boolean

    
}
export const ValidateInput = ({ 
    value,
    onChange,
    onBlur,
    error,
    name,
    label,
    disabled


}:ValidateInputProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(name, e.target.value);
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        onBlur(name);
    };

    return (
        <div className="w-full flex  text-black mt-2">
            <Field className={'w-full'}>
                <Label className="text-sm/6 text-blue-900 font-medium ">{label}</Label>
                <Input 
                disabled={disabled}
                value={value}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                name={name} 
                className={'mt-2 block w-full border rounded-sm  border-blue-800  focus:outline-2!  px-3 py-1.5  text-sm/6  focus:outline-blue-900'} />
                <Label className="text-sm/6 font-small h-4 font-bold  text-red-500 ">
                {error && error}
                </Label>

            </Field>
        </div>
    )
}