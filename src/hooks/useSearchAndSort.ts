import { useMemo, useState } from "react"

export interface SearchableSortableItem {
  id: string
  title?: string
  amount?: number
  [key: string]: unknown
}

export function useSearchAndSort<T extends SearchableSortableItem>(
  items: T[],
) {
  const [searchValue, setSearchValue] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "amount">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const filteredAndSorted = useMemo(() => {
    const result = items.filter((item) => {
      const searchLower = searchValue.toLowerCase()
      const titleMatch = item.title?.toLowerCase().includes(searchLower) ?? false
      return searchLower === "" || titleMatch
    })

    result.sort((a, b) => {
      let compareValue = 0

      if (sortBy === "name") {
        const titleA = a.title?.toLowerCase() ?? ""
        const titleB = b.title?.toLowerCase() ?? ""
        compareValue = titleA.localeCompare(titleB)
      } else {
        const amountA = a.amount ?? 0
        const amountB = b.amount ?? 0
        compareValue = amountA - amountB
      }

      return sortOrder === "asc" ? compareValue : -compareValue
    })

    return result
  }, [items, searchValue, sortBy, sortOrder])

  return {
    filteredAndSorted,
    searchValue,
    setSearchValue,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  }
}
