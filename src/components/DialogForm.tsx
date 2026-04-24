/* eslint-disable react-hooks/set-state-in-effect */
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useRef, useState } from "react"
import { useToast } from "@/store/toast.store"

export interface Option {
  label: string;
  value: string;
}

export interface Field {
  id: string
  name: string
  label: string
  defaultValue?: string
  type: 'text' | 'number' | 'select' | 'textarea'
  options?: Option[] // Only for select type
  multiple?: boolean // For select type
  max?: string // For number type
  min?: string // For number type
  getDynamicMax?: (formValues: Record<string, string>) => string // For dynamic max calculation
  placeholder?: string // For select type
  showWhen?: (formValues: Record<string, string>) => boolean // Conditional field visibility
}

interface DialogFormProps {
  open: boolean
  title: string
  description?: string
  fields: Field[]
  close: () => void
  submit: (data: Record<string, string | string[] | number>) => void
  initialData?: Record<string, string | string[] | number>
}

export function DialogForm({ open, title, description, fields, close, submit, initialData }: DialogFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [selectValues, setSelectValues] = useState<Record<string, string>>(() => {
    // Initialize with default values and initial data for select fields
    const initial: Record<string, string> = {};
    fields.forEach(field => {
      if (field.type === 'select') {
        const value = initialData?.[field.name] as string || field.defaultValue;
        if (value) {
          initial[field.name] = value;
        }
      }
    });
    return initial;
  })
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const toast = useToast()

  // Reset selectValues when fields change (new form opened)
  useEffect(() => {
    const initial: Record<string, string> = {};
    fields.forEach(field => {
      if (field.type === 'select') {
        const value = initialData?.[field.name] as string || field.defaultValue;
        if (value) {
          initial[field.name] = value;
        }
      }
    });
    setSelectValues(initial);
  }, [fields, initialData])

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && close()}>
      <DialogContent className="sm:max-w-sm">
        <form ref={formRef} onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          
          // Validate positive amounts for number fields
          const numberFields = fields.filter(f => f.type === 'number');
          for (const field of numberFields) {
            const value = formData.get(field.name);
            const numValue = value ? parseFloat(value.toString()) : 0;
            if (numValue <= 0) {
              toast.error(`Erreur`, `${field.label} doit être supérieur à 0`);
              return;
            }
          }
          
          const data: Record<string, string | string[]> = {};
          
          // Add select values
          Object.entries(selectValues).forEach(([key, value]) => {
            if (value) data[key] = value;
          });
          
          // Add form data (excluding select fields)
          const selectFieldNames = new Set(fields.filter(f => f.type === 'select').map(f => f.name));
          formData.forEach((value, key) => {
            if (selectFieldNames.has(key)) return; // Skip select fields
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
          setSelectValues({});
          setFormValues({});
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
              // Check if field should be visible
              if (field.showWhen && !field.showWhen({ ...selectValues, ...formValues })) {
                return null;
              }
              switch (field.type) {
                case 'select':
                  { const selectedOption = field.options?.find((o) => o.value === selectValues[field.name]) || 
                                         field.options?.find((o) => o.value === fieldValue);
                  return (
                    <Field key={index}>
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Select 
                        value={selectValues[field.name] || (fieldValue as string) || ""}
                        onValueChange={(value: string | null) => value && setSelectValues(prev => ({ ...prev, [field.name]: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue>
                            {selectedOption?.label || field.placeholder || "Sélectionner une option..."}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  ); }
                case 'number':
                  { const dynamicMax = field.getDynamicMax ? field.getDynamicMax({ ...selectValues, ...formValues }) : field.max;
                  const maxAmount = dynamicMax ? parseFloat(dynamicMax) : undefined;
                  return (
                    <Field key={field.id}>
                      <Label htmlFor={field.id}>
                        {field.label}
                        {maxAmount !== undefined && (
                          <span className="text-xs text-muted-foreground ml-2">
                            (Max: {maxAmount} €)
                          </span>
                        )}
                      </Label>
                      <Input
                        id={field.id}
                        name={field.name}
                        type="number"
                        defaultValue={fieldValue}
                        placeholder="0"
                        max={dynamicMax}
                        min={field.min || "0"}
                        step="0.01"
                        onChange={(e) => setFormValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                        required
                      />
                    </Field>
                  ); }
                case 'textarea':
                  return (
                    <Field key={field.id}>
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Textarea 
                        id={field.id} 
                        name={field.name} 
                        defaultValue={fieldValue}
                      />
                    </Field>
                  );
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
