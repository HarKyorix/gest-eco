import { Edit, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Divers } from "@/store/db/divers"

interface DiversSectionProps {
  display?: 'list' | 'grid';
  diversList: Divers[]
  onAdd: () => void
  onEdit: (divers: Divers) => void
  onDelete: (divers: Divers) => void
}

export function DiversSection({ display = 'grid', diversList, onAdd, onEdit, onDelete }: DiversSectionProps) {
  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Divers</h3>
        <Button variant="outline" onClick={onAdd} size="icon">
          <Plus className="size-4" />
        </Button>
      </div>

      {display === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {diversList.map((divers) => (
            <Card key={divers.id} className="flex flex-col">
              <CardHeader className="flex-1">
                <CardTitle className="text-lg">{divers.title}</CardTitle>
                <CardDescription>Élément divers de gestion économique</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEdit(divers)}
                  >
                    <Edit className="size-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(divers)}
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
            {diversList.map((divers) => (
              <TableRow key={divers.id}>
                <TableCell className="text-left">{divers.title}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(divers)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(divers)}
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
