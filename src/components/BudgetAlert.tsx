import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

interface BudgetAlertProps {
  budgetTotal: number
  depenseTotal: number
  epargneTotal: number
  currency?: string
}

export function BudgetAlert({
  budgetTotal,
  depenseTotal,
  epargneTotal,
  currency,
}: BudgetAlertProps) {
  const totalAllocated = depenseTotal + epargneTotal
  const remaining = budgetTotal - totalAllocated
  const percentUsed = budgetTotal > 0 ? (totalAllocated / budgetTotal) * 100 : 0

  if (budgetTotal === 0) {
    return (
      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="size-4 text-amber-600" />
        <AlertTitle className="text-amber-900">Aucun budget défini</AlertTitle>
        <AlertDescription className="text-amber-800">
          Commencez par ajouter un budget pour cette période
        </AlertDescription>
      </Alert>
    )
  }

  if (remaining < 0) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="size-4 text-red-600" />
        <AlertTitle className="text-red-900">Dépassement budgétaire</AlertTitle>
        <AlertDescription className="text-red-800">
          Vous avez dépassé votre budget de{" "}
          <span className="font-semibold">
            {Math.abs(remaining)} {currency}
          </span>
          . ({percentUsed.toFixed(1)}% dépensé)
        </AlertDescription>
      </Alert>
    )
  }

  if (remaining === 0) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle2 className="size-4 text-green-600" />
        <AlertTitle className="text-green-900">Budget exact</AlertTitle>
        <AlertDescription className="text-green-800">
          Votre budget est entièrement alloué (dépenses + épargnes)
        </AlertDescription>
      </Alert>
    )
  }

  if (remaining <= budgetTotal * 0.1) {
    return (
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="size-4 text-orange-600" />
        <AlertTitle className="text-orange-900">Budget faible</AlertTitle>
        <AlertDescription className="text-orange-800">
          Il vous reste{" "}
          <span className="font-semibold">
            {remaining} {currency}
          </span>{" "}
          ({(100 - percentUsed).toFixed(1)}% restant). Attention aux nouveaux ajouts.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-blue-200 bg-blue-50">
      <CheckCircle2 className="size-4 text-blue-600" />
      <AlertTitle className="text-blue-900">Budget sain</AlertTitle>
      <AlertDescription className="text-blue-800">
        Il vous reste{" "}
        <span className="font-semibold">
          {remaining} {currency}
        </span>{" "}
        ({(100 - percentUsed).toFixed(1)}% restant)
      </AlertDescription>
    </Alert>
  )
}
