import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Field, FieldLabel } from "../ui/field";
import { Progress } from "../ui/progress";

interface CaisseTotalsProps {
  caisseTotals: Array<{ caisseTitle: string; total: number; limit?: number }>
  currency: string
}

export default function CaisseTotals({ caisseTotals, currency }: CaisseTotalsProps) {
  return (
    <>
      {caisseTotals.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Caisse</TableHead>
              <TableHead className="text-center">Progress</TableHead>
              <TableHead className="text-right">Total épargné</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {caisseTotals.map((item, index) => (
              <TableRow key={index} className="text-left">
                <TableCell className="text-left font-medium">{item.caisseTitle}</TableCell>
                <TableCell className="text-center">
                  {item.limit && item.limit > 0 ? (
                    <Field className="w-full max-w-sm">
                      <FieldLabel htmlFor="progress-upload">
                        <span>Progression</span>
                        <span className="ml-auto">{(item.total / item.limit * 100).toFixed(0)}%</span>
                      </FieldLabel>
                      <Progress value={item.total / item.limit * 100} id="progress-upload" />
                    </Field>
                  ) : (
                    <span className="text-muted-foreground">Pas de limite</span>
                  )}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {item.total} {currency}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2">
              <TableCell className="text-left font-bold">Total général</TableCell>
              <TableCell className="text-center">
                {caisseTotals.some(item => item.limit && item.limit > 0) ? (
                  <Field className="w-full max-w-sm">
                    <FieldLabel htmlFor="progress-upload">
                      <span>Progression</span>
                      <span className="ml-auto">
                        {(() => {
                          const caissesWithLimits = caisseTotals.filter(item => Number(item.limit) > 0);
                          const totalSum = caissesWithLimits.reduce((sum, item) => sum + Number(item.total), 0);
                          const limitSum = caissesWithLimits.reduce((sum, item) => sum + Number(item.limit || 0), 0);
                          return limitSum > 0 ? (totalSum / limitSum * 100).toFixed(0) : '0';
                        })()}%
                      </span>
                    </FieldLabel>
                    <Progress 
                      value={(() => {
                        const caissesWithLimits = caisseTotals.filter(item => Number(item.limit) > 0);
                        const totalSum = caissesWithLimits.reduce((sum, item) => sum + Number(item.total), 0);
                        const limitSum = caissesWithLimits.reduce((sum, item) => sum + Number(item.limit || 0), 0);
                        return limitSum > 0 ? totalSum / limitSum * 100 : 0;
                      })()} 
                      id="progress-upload" 
                    />
                  </Field>
                ) : (
                  <span className="text-muted-foreground">Aucune limite définie</span>
                )}
              </TableCell>
              <TableCell className="text-right font-bold">
                {caisseTotals.reduce((sum, item) => sum + item.total, 0)} {currency}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground text-center py-4">
          Aucune épargne enregistrée dans les caisses pour ce tableau.
        </p>
      )}
    </>
  )
}
