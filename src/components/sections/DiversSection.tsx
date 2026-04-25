import { Edit, Plus, Trash2, Tag, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import type { Divers } from "@/store/db/divers"
import { EmptyState } from "@/components/EmptyState"
import { useState } from "react"
import { SearchAndSort } from '@/components/SearchAndSort';
import { useSearchAndSort } from "@/hooks/useSearchAndSort"

interface DiversSectionProps {
  display?: 'list' | 'grid';
  diversList: Divers[]
  onAdd: () => void
  onEdit: (divers: Divers) => void
  onDelete: (divers: Divers) => void
  onDeleteMultiple?: (divers: Divers[]) => void
}

export function DiversSection({ display = 'grid', diversList, onAdd, onEdit, onDelete, onDeleteMultiple }: DiversSectionProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const { filteredAndSorted, searchValue, setSearchValue, sortBy, sortOrder, setSortOrder } = useSearchAndSort(
    diversList.map((divers) => ({
      ...divers,
      name: divers.title || `Divers ${divers.id.slice(0, 8)}`,
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
      setSelectedIds(new Set(filteredAndSorted.map(d => d.id)))
    }
  }

  const handleDeleteSelected = () => {
    const selectedDivers = filteredAndSorted.filter(d => selectedIds.has(d.id))
    if (onDeleteMultiple) {
      onDeleteMultiple(selectedDivers)
    } else {
      selectedDivers.forEach(divers => onDelete(divers))
    }
    setSelectedIds(new Set())
  }
  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h3 className="text-lg font-semibold">Divers</h3>
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
          icon={Tag}
          title="Aucune catégorie"
          description="Créez une catégorie pour classifier vos dépenses et épargnes"
          actionLabel="Créer une catégorie"
          onAction={onAdd}
        />
      ) : display === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredAndSorted.map((divers) => (
            <Card 
              key={divers.id} 
              className={`flex flex-col cursor-pointer transition-all ${
                selectedIds.has(divers.id) 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => toggleSelect(divers.id)}
            >
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{divers.title}</CardTitle>
                  </div>
                  <Checkbox
                    checked={selectedIds.has(divers.id)}
                    onCheckedChange={() => toggleSelect(divers.id)}
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
                    icon={Tag}
                    title="Aucune catégorie"
                    description="Créez une catégorie pour classifier vos dépenses et épargnes"
                    actionLabel="Créer une catégorie"
                    onAction={onAdd}
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSorted.map((divers) => (
              <TableRow 
                key={divers.id}
                className={`cursor-pointer transition-all ${
                  selectedIds.has(divers.id) 
                    ? 'bg-blue-50 hover:bg-blue-100' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleSelect(divers.id)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(divers.id)}
                    onCheckedChange={() => toggleSelect(divers.id)}
                  />
                </TableCell>
                <TableCell className="text-left">{divers.title}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
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
            ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
