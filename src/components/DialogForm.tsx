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
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef } from "react"

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
  max?: string // For number type
  min?: string // For number type
}

interface DialogFormProps {
  open: boolean
  title: string
  description?: string
  fields: Field[]
  close: () => void
  submit: (data: Record<string, string | string[]>) => void
  initialData?: Record<string, any>
}

export function DialogForm({ open, title, description, fields, close, submit, initialData }: DialogFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && close()}>
      <DialogContent className="sm:max-w-sm">
        <form ref={formRef} onSubmit={(e) => {
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
          submit(data);
          formRef.current?.reset();
          close();
        }}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          <FieldGroup className="my-4">
            {fields.map((field, index) => {
              const fieldValue = initialData?.[field.name] || field.defaultValue;
              switch (field.type) {
                case 'select':
                  return (
                    <Field key={index}>
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <select id={field.id} name={field.name} multiple={field.multiple} defaultValue={fieldValue}>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </Field>
                  );
                case 'number':
                  return (
                    <Field key={field.id}>
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Input
                        id={field.id}
                        name={field.name}
                        type="number"
                        defaultValue={fieldValue}
                        placeholder="0"
                        max={field.max}
                        min={field.min || "0"}
                        step="0.01"
                        required
                      />
                    </Field>
                  );
                case 'text':
                default:
                  return (
                    <Field key={field.id}>
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Input id={field.id} name={field.name} defaultValue={fieldValue} />
                    </Field>
                  );
              }
            })}
          </FieldGroup>
          <DialogFooter>
            <DialogClose><span className="cursor-pointer rounded-lg border border-border bg-background px-3 py-2 text-sm transition hover:bg-muted">Cancel</span></DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
