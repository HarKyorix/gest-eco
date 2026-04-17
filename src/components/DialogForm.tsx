/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface Option {
  label: string;
  value: string;
}

export interface Field {
  id: string
  name: string
  label: string
  defaultValue?: string
  type: 'text' | 'number' | 'select'
  options?: Option[] // Only for select type
  multiple?: boolean // For select type
}

interface DialogFormProps {
  title: string
  description?: string
  fields: Field[]
  onSubmit: (data: Record<string, string | string[]>) => void
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialData?: Record<string, any>
}

export function DialogForm({title, description, fields, onSubmit, children, open, onOpenChange, initialData}: DialogFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: Record<string, string | string[]> = {};
        formData.forEach((value, key) => {
          if (data[key]) {
            if (Array.isArray(data[key])) {
              (data[key] as string[]).push(value.toString());
            } else {
              data[key] = [data[key] as string, value.toString()];
            }
          } else {
            data[key] = value.toString();
          }
        });
        onSubmit(data);
      }}>
        {children && <DialogTrigger>{children}</DialogTrigger>}
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          <FieldGroup>
            {fields.map((field, index) => {
              const fieldValue = initialData?.[field.name] || field.defaultValue;
              return field.type === 'select' ? (
                <Field key={index}>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <select id={field.id} name={field.name} multiple={field.multiple} defaultValue={fieldValue}>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </Field>
              ) : (
              <Field key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input id={field.id} name={field.name} defaultValue={fieldValue} />
              </Field>
            )
            })}
          </FieldGroup>
          <DialogFooter>
            <DialogClose><Button variant="outline">Cancel</Button></DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
