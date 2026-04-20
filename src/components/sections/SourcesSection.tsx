import { Edit, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Source } from "@/store/source"

interface SourcesSectionProps {
  display?: 'list' | 'grid';
  sources: Source[]
  onAdd: () => void
  onEdit: (source: Source) => void
  onDelete: (source: Source) => void
}

export function SourcesSection({ display = 'grid', sources, onAdd, onEdit, onDelete }: SourcesSectionProps) {
  const containerClassName = display === 'grid'
    ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
    : 'space-y-4'

  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sources</h3>
        <Button variant="outline" onClick={onAdd} size="icon">
          <Plus className="size-4" />
        </Button>
      </div>

      {display === 'grid' ? (
        <div className={containerClassName}>
          {sources.map((source) => (
            <Card key={source.id} className="flex flex-col">
              <CardHeader className="flex-1">
                <CardTitle className="text-lg">{source.title}</CardTitle>
                <CardDescription>Source de revenus familiale</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEdit(source)}
                  >
                    <Edit className="size-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(source)}
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
            {sources.map((source) => (
              <TableRow key={source.id}>
                <TableCell className="text-left">{source.title}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(source)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(source)}
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
