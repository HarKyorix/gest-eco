import { ArrowRight, Edit, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Board } from "@/store/board"

interface BoardsSectionProps {
  display?: 'list' | 'grid';
  boards: Board[]
  onAdd: () => void
  onNavigateList?: () => void
  onNavigate: (id: string) => void
  onEdit: (board: Board) => void
  onDelete: (board: Board) => void
}

export function BoardsSection({ display = 'grid', boards, onAdd, onNavigateList, onNavigate, onEdit, onDelete }: BoardsSectionProps) {
  const containerClassName = display === 'grid'
    ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
    : 'space-y-4'

  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tableaux</h3>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onAdd} size="icon">
            <Plus className="size-4" />
          </Button>
          {onNavigateList && (
          <Button
            variant="default"
            size="icon"
            onClick={() => onNavigateList()}
          >
            <ArrowRight className="size-4" />
          </Button>
          )}
        </div>
      </div>

      {display === 'grid' ? (
        <div className={containerClassName}>
          {boards.map((board) => (
            <Card key={board.id} className="flex flex-col">
              <CardHeader className="flex-1">
                <CardTitle className="text-lg">{board.title}</CardTitle>
                <CardDescription>Tableau de gestion économique familiale</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => onNavigate(board.id)}
                >
                  Voir le tableau
                  <ArrowRight className="size-4" />
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEdit(board)}
                  >
                    <Edit className="size-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(board)}
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
            {boards.map((board) => (
              <TableRow key={board.id}>
                <TableCell className="text-left">{board.title}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onNavigate(board.id)}
                    >
                      <ArrowRight className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(board)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(board)}
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
