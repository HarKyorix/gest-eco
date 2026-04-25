import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Search } from "lucide-react"

interface SearchAndSortProps {
  searchValue: string
  onSearchChange: (value: string) => void
  sortBy: "name" | "amount"
  onSortChange?: (sort: "name" | "amount") => void
  sortOrder: "asc" | "desc"
  onSortOrderChange: (order: "asc" | "desc") => void
}

export function SearchAndSort({
  searchValue,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
}: SearchAndSortProps) {
  const toggleSortOrder = () => {
    onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
  }

  const toggleSortBy = () => {
    onSortChange?.(sortBy === "name" ? "amount" : "name")
  }

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      {onSortChange && (
      <Button
        variant="outline"
        size="sm"
        onClick={toggleSortBy}
        className="text-xs"
      >
        Tri: {sortBy === "name" ? "Nom" : "Montant"}
      </Button>
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSortOrder}
        className="size-9"
      >
        <ArrowUpDown
          className="size-4"
          style={{ transform: sortOrder === "desc" ? "scaleY(-1)" : "none" }}
        />
      </Button>
    </div>
  )
}
