import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DiversTotalsProps {
  diversTotals: Array<{ id: string; title: string; total: number }>
  currency: string
}

export default function DiversTotals({ diversTotals, currency }: DiversTotalsProps) {
  return (
    <>
      {diversTotals.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Divers</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diversTotals.map((item, index) => (
              <TableRow key={index} className="text-left">
                <TableCell className="text-left font-medium">{item.title}</TableCell>
                <TableCell className="text-right font-semibold">
                  {item.total} {currency}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2">
              <TableCell className="text-left font-bold">Total général</TableCell>
              <TableCell className="text-right font-bold">
                {diversTotals.reduce((sum, item) => sum + item.total, 0)} {currency}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground text-center py-4">
          Aucune donnée de divers enregistrée pour ce tableau.
        </p>
      )}
    </>
  )
}
