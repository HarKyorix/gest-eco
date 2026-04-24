import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SourceTotalsProps {
  sourceTotals: Array<{ sourceTitle: string; total: number }>
  currency: string
}

export default function SourceTotals({ sourceTotals, currency }: SourceTotalsProps) {
  return (
    <>
      {sourceTotals.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sourceTotals.map((item, index) => (
              <TableRow key={index} className="text-left">
                <TableCell className="text-left font-medium">{item.sourceTitle}</TableCell>
                <TableCell className="text-right font-semibold">
                  {item.total} {currency}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2">
              <TableCell className="text-left font-bold">Total général</TableCell>
              <TableCell className="text-right font-bold">
                {sourceTotals.reduce((sum, item) => sum + item.total, 0)} {currency}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground text-center py-4">
          Aucune donnée de source enregistrée pour ce tableau.
        </p>
      )}
    </>
  )
}
