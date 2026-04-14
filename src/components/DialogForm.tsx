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
}

interface DialogFormProps {
  title: string
  description?: string
  fields: Field[]
  onSubmit: (data: Record<string, string>) => void
  children: React.ReactNode
}

export function DialogForm({title, description, fields, onSubmit, children}: DialogFormProps) {
  return (
    <Dialog>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
          data[key] = value.toString();
        });
        onSubmit(data);
      }}>
        <DialogTrigger render={<Button variant="outline">{children}</Button>} />
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
            {fields.map((field, index) => (
              field.type === 'select' ? (
                <Field key={index}>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <select id={field.id} name={field.name}>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </Field>
              ) : (
              <Field key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input id={field.id} name={field.name} defaultValue={field.defaultValue} />
              </Field>
            )
            ))}
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
