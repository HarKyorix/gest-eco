import { Edit, Plus, Trash2, Wallet, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import type { Caisse } from "@/store/db/caisse"
import { EmptyState } from "@/components/EmptyState"
import { useState } from "react"
import { useSearchAndSort } from "@/hooks/useSearchAndSort"
import { SearchAndSort } from '@/components/SearchAndSort';

interface CaissesSectionProps {
  display?: 'list' | 'grid';
  caisses: Caisse[]
  currency: string
  onAdd: () => void
  onEdit: (caisse: Caisse) => void
  onDelete: (caisse: Caisse) => void
  onDeleteMultiple?: (caisses: Caisse[]) => void
}

export function CaissesSection({ display = 'grid', caisses, currency, onAdd, onEdit, onDelete, onDeleteMultiple }: CaissesSectionProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const { filteredAndSorted, searchValue, setSearchValue, sortBy, setSortBy, sortOrder, setSortOrder } = useSearchAndSort(
      caisses.map((caisse) => ({
        ...caisse,
        title: caisse.title || `Caisse ${caisse.id.slice(0, 8)}`,
        amount: caisse.limit || 0,
      })
    )
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
      setSelectedIds(new Set(filteredAndSorted.map(c => c.id)))
    }
  }

  const handleDeleteSelected = () => {
    const selectedCaisses = filteredAndSorted.filter(c => selectedIds.has(c.id))
    if (onDeleteMultiple) {
      onDeleteMultiple(selectedCaisses)
    } else {
      selectedCaisses.forEach(caisse => onDelete(caisse))
    }
    setSelectedIds(new Set())
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h3 className="text-lg font-semibold">Caisses</h3>
        <div className="flex gap-2 ml-auto flex-wrap">
          <SearchAndSort
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            sortBy={sortBy}
            onSortChange={setSortBy}
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
          icon={Wallet}
          title="Aucune caisse"
          description="Créez une caisse pour gérer votre épargne et vos fonds disponibles"
          actionLabel="Créer une caisse"
          onAction={onAdd}
        />
      ) : display === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredAndSorted.map((caisse) => (
            <Card 
              key={caisse.id} 
              className={`flex flex-col cursor-pointer transition-all ${
                selectedIds.has(caisse.id) 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => toggleSelect(caisse.id)}
            >
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{caisse.title}</CardTitle>
                    <CardDescription>limite : {caisse?.limit} {currency}</CardDescription>
                  </div>
                  <Checkbox
                    checked={selectedIds.has(caisse.id)}
                    onCheckedChange={() => toggleSelect(caisse.id)}
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
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="text-left">Titre</TableHead>
              <TableHead className="text-center">Limite</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <EmptyState
                    icon={Wallet}
                    title="Aucune caisse"
                    description="Créez une caisse pour gérer votre épargne et vos fonds disponibles"
                    actionLabel="Créer une caisse"
                    onAction={onAdd}
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSorted.map((caisse) => (
              <TableRow 
                key={caisse.id}
                className={`cursor-pointer transition-all ${
                  selectedIds.has(caisse.id) 
                    ? 'bg-blue-50 hover:bg-blue-100' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleSelect(caisse.id)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(caisse.id)}
                    onCheckedChange={() => toggleSelect(caisse.id)}
                  />
                </TableCell>
                <TableCell className="text-left">{caisse.title}</TableCell>
                <TableCell className="text-center">{caisse?.limit} {currency}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
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
            ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
