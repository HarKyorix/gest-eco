import { Edit, Plus, Trash2, TrendingUp, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import type { Source } from "@/store/db/source"
import { EmptyState } from "@/components/EmptyState"
import { useState } from "react"
import { SearchAndSort } from "../SearchAndSort"
import { useSearchAndSort } from "@/hooks/useSearchAndSort"

interface SourcesSectionProps {
  display?: 'list' | 'grid';
  sources: Source[]
  onAdd: () => void
  onEdit: (source: Source) => void
  onDelete: (source: Source) => void
  onDeleteMultiple?: (sources: Source[]) => void
}

export function SourcesSection({ display = 'grid', sources, onAdd, onEdit, onDelete, onDeleteMultiple }: SourcesSectionProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const { filteredAndSorted, searchValue, setSearchValue, sortBy, sortOrder, setSortOrder } = useSearchAndSort(
    sources.map((source) => ({
      ...source,
      name: source.title || `Source ${source.id.slice(0, 8)}`,
    }))
  )
  const isAllSelected = selectedIds.size === filteredAndSorted.length && filteredAndSorted.length > 0
  const isPartialSelected = selectedIds.size > 0 && selectedIds.size < filteredAndSorted.length

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredAndSorted.map(s => s.id)))
    }
  }

  const handleDeleteSelected = () => {
    const selectedSources = filteredAndSorted.filter(s => selectedIds.has(s.id))
    if (onDeleteMultiple) {
      onDeleteMultiple(selectedSources)
    } else {
      selectedSources.forEach(source => onDelete(source))
    }
    setSelectedIds(new Set())
  }
  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h3 className="text-lg font-semibold">Sources</h3>
        <div className="flex gap-2 ml-auto flex-wrap">
          <SearchAndSort
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />

          {selectedIds.size > 0 && (
            <>
              <span className="text-sm text-gray-600 flex items-center">
                {selectedIds.size} sélectionnée{selectedIds.size > 1 ? 's' : ''}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="size-4 mr-2" />
                Supprimer ({selectedIds.size})
              </Button>
            </>
          )}
          <Button
            variant={isAllSelected || isPartialSelected ? 'default' : 'outline'}
            size="icon"
            onClick={toggleSelectAll}
            title={isAllSelected ? 'Désélectionner tout' : 'Sélectionner tout'}
          >
            <Check className="size-4" />
          </Button>
          <Button variant="outline" onClick={onAdd} size="icon">
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="Aucune source de revenu"
          description="Créez une source pour enregistrer vos revenus et budgets"
          actionLabel="Créer une source"
          onAction={onAdd}
        />
      ) : display === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredAndSorted.map((source) => (
            <Card 
              key={source.id} 
              className={`flex flex-col cursor-pointer transition-all ${
                selectedIds.has(source.id) 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => toggleSelect(source.id)}
            >
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{source.title}</CardTitle>
                  </div>
                  <Checkbox
                    checked={selectedIds.has(source.id)}
                    onCheckedChange={() => toggleSelect(source.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1"
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-0" onClick={(e) => e.stopPropagation()}>
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
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Titre</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <EmptyState
                    icon={TrendingUp}
                    title="Aucune source de revenu"
                    description="Créez une source pour enregistrer vos revenus et budgets"
                    actionLabel="Créer une source"
                    onAction={onAdd}
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSorted.map((source) => (
              <TableRow 
                key={source.id}
                className={`cursor-pointer transition-all ${
                  selectedIds.has(source.id) 
                    ? 'bg-blue-50 hover:bg-blue-100' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleSelect(source.id)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(source.id)}
                    onCheckedChange={() => toggleSelect(source.id)}
                  />
                </TableCell>
                <TableCell className="text-left">{source.title}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
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
            ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
