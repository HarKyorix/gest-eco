import { Edit, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Caisse } from "@/store/caisse"

interface CaissesSectionProps {
  display?: 'list' | 'grid';
  caisses: Caisse[]
  onAdd: () => void
  onEdit: (caisse: Caisse) => void
  onDelete: (caisse: Caisse) => void
}

export function CaissesSection({ display = 'grid', caisses, onAdd, onEdit, onDelete }: CaissesSectionProps) {
  const containerClassName = display === 'grid'
    ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
    : 'space-y-4'

  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Caisses</h3>
        <Button variant="outline" onClick={onAdd} size="icon">
          <Plus className="size-4" />
        </Button>
      </div>

      {display === 'grid' ? (
        <div className={containerClassName}>
          {caisses.map((caisse) => (
            <Card key={caisse.id} className="flex flex-col">
              <CardHeader className="flex-1">
                <CardTitle className="text-lg">{caisse.title}</CardTitle>
                <CardDescription>Caisse d'épargne familiale</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEdit(caisse)}
                  >
                    <Edit className="size-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(caisse)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {caisses.map((caisse) => (
              <TableRow key={caisse.id}>
                <TableCell className="text-left">{caisse.title}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(caisse)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(caisse)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
