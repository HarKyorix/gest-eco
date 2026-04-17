import { useBoardStore, type Board } from "@/store/board"
import { useCaisseStore, type Caisse } from "@/store/caisse"
import { useDiversStore, type Divers } from "@/store/divers"
import { useSourceStore, type Source } from "@/store/source"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ArrowRight, Edit, Trash2 } from "lucide-react"
import { AlertDialogDestructive } from "@/components/AlertDialogDestructive"
import { DialogForm } from "@/components/DialogForm"

export default function HomePage() {
  const boardStore = useBoardStore()
  const caisseStore = useCaisseStore()
  const diversStore = useDiversStore()
  const sourceStore = useSourceStore()
  const navigate = useNavigate()

  const [editingBoard, setEditingBoard] = useState<Board | null>(null)
  const [editingCaisse, setEditingCaisse] = useState<Caisse | null>(null)
  const [editingDivers, setEditingDivers] = useState<Divers | null>(null)
  const [editingSource, setEditingSource] = useState<Source | null>(null)
  const location = useLocation()

  const activeTab = useMemo(() => {
    const path = location.pathname.toLowerCase()
    if (path === "/caisse") return "caisses"
    if (path === "/divers") return "divers"
    if (path === "/source") return "sources"
    return "boards"
  }, [location.pathname])

  useEffect(() => {
    if (!["/", "/caisse", "/divers", "/source"].includes(location.pathname)) {
      navigate("/")
    }
  }, [location.pathname, navigate])

  const onChangeTab = (value: string) => {
    if (value === "boards") {
      navigate("/")
      return
    }
    if (value === "caisses") {
      navigate("/caisse")
      return
    }
    if (value === "divers") {
      navigate("/divers")
      return
    }
    if (value === "sources") {
      navigate("/source")
      return
    }
  }

  const onAddBoard = () => {
    const newBoard = {
      title: "Nouveau tableau " + (boardStore.list.length + 1),
    }
    boardStore.add(newBoard)
  }

  const onAddCaisse = () => {
    caisseStore.add({ title: "Nouvelle caisse " + (caisseStore.list.length + 1) })
  }

  const onAddDivers = () => {
    diversStore.add({ title: "Nouveau divers " + (diversStore.list.length + 1) })
  }

  const onAddSource = () => {
    sourceStore.add({ title: "Nouvelle source " + (sourceStore.list.length + 1) })
  }

  useEffect(() => {
    boardStore.init()
    caisseStore.init()
    diversStore.init()
    sourceStore.init()
  }, [boardStore, caisseStore, diversStore, sourceStore])

  return (
    <div className="min-h-svh p-4 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Gestion Économique Familiale</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos tableaux, caisses, divers et sources en un seul endroit.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={onChangeTab}
          className="w-full flex flex-col"
        >
          <TabsList className="flex w-full gap-2 bg-transparent border-b rounded-none">
            <TabsTrigger value="boards">Tableaux</TabsTrigger>
            <TabsTrigger value="caisses">Caisses</TabsTrigger>
            <TabsTrigger value="divers">Divers</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="boards" className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Tableaux</h3>
              <Button onClick={onAddBoard} size="sm">
                <Plus className="size-4 mr-2" />
                Ajouter un tableau
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {boardStore.list.map((board) => (
                <Card key={board.id} className="flex flex-col">
                  <CardHeader className="flex-1">
                    <CardTitle className="text-lg">{board.title}</CardTitle>
                    <CardDescription>
                      Tableau de gestion économique familiale
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => navigate(`/board/${board.id}`)}
                    >
                      Voir le tableau
                      <ArrowRight className="size-4" />
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setEditingBoard(board)}
                      >
                        <Edit className="size-4 mr-2" />
                        Modifier
                      </Button>
                      <AlertDialogDestructive
                        title="Supprimer le tableau"
                        description={`Êtes-vous sûr de vouloir supprimer "${board.title}" ?`}
                        onConfirm={() => boardStore.remove(board.id)}
                      >
                        <Button variant="outline" size="sm">
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogDestructive>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="caisses" className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Caisses</h3>
              <Button onClick={onAddCaisse} size="sm">
                <Plus className="size-4 mr-2" />
                Ajouter une caisse
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {caisseStore.list.map((caisse) => (
                <Card key={caisse.id} className="flex flex-col">
                  <CardHeader className="flex-1">
                    <CardTitle className="text-lg">{caisse.title}</CardTitle>
                    <CardDescription>
                      Caisse d'épargne familiale
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setEditingCaisse(caisse)}
                      >
                        <Edit className="size-4 mr-2" />
                        Modifier
                      </Button>
                      <AlertDialogDestructive
                        title="Supprimer la caisse"
                        description={`Êtes-vous sûr de vouloir supprimer "${caisse.title}" ?`}
                        onConfirm={() => caisseStore.remove(caisse.id)}
                      >
                        <Button variant="outline" size="sm">
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogDestructive>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="divers" className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Divers</h3>
              <Button onClick={onAddDivers} size="sm">
                <Plus className="size-4 mr-2" />
                Ajouter un divers
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {diversStore.list.map((divers) => (
                <Card key={divers.id} className="flex flex-col">
                  <CardHeader className="flex-1">
                    <CardTitle className="text-lg">{divers.title}</CardTitle>
                    <CardDescription>
                      Élément divers de gestion économique
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setEditingDivers(divers)}
                      >
                        <Edit className="size-4 mr-2" />
                        Modifier
                      </Button>
                      <AlertDialogDestructive
                        title="Supprimer le divers"
                        description={`Êtes-vous sûr de vouloir supprimer "${divers.title}" ?`}
                        onConfirm={() => diversStore.remove(divers.id)}
                      >
                        <Button variant="outline" size="sm">
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogDestructive>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Sources</h3>
              <Button onClick={onAddSource} size="sm">
                <Plus className="size-4 mr-2" />
                Ajouter une source
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sourceStore.list.map((source) => (
                <Card key={source.id} className="flex flex-col">
                  <CardHeader className="flex-1">
                    <CardTitle className="text-lg">{source.title}</CardTitle>
                    <CardDescription>
                      Source de revenus familiale
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setEditingSource(source)}
                      >
                        <Edit className="size-4 mr-2" />
                        Modifier
                      </Button>
                      <AlertDialogDestructive
                        title="Supprimer la source"
                        description={`Êtes-vous sûr de vouloir supprimer "${source.title}" ?`}
                        onConfirm={() => sourceStore.remove(source.id)}
                      >
                        <Button variant="outline" size="sm">
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogDestructive>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs de modification */}
      {editingBoard && (
        <DialogForm
          open={!!editingBoard}
          onOpenChange={() => setEditingBoard(null)}
          title="Modifier le tableau"
          description="Modifiez les détails du tableau"
          fields={[{ id: "title", name: "title", label: "Titre", type: "text" }]}
          initialData={editingBoard}
          onSubmit={(data) => {
            boardStore.update(editingBoard.id, data)
            setEditingBoard(null)
          }}
        />
      )}

      {editingCaisse && (
        <DialogForm
          open={!!editingCaisse}
          onOpenChange={() => setEditingCaisse(null)}
          title="Modifier la caisse"
          description="Modifiez les détails de la caisse"
          fields={[{ id: "title", name: "title", label: "Titre", type: "text" }]}
          initialData={editingCaisse}
          onSubmit={(data) => {
            caisseStore.update(editingCaisse.id, data)
            setEditingCaisse(null)
          }}
        />
      )}

      {editingDivers && (
        <DialogForm
          open={!!editingDivers}
          onOpenChange={() => setEditingDivers(null)}
          title="Modifier le divers"
          description="Modifiez les détails du divers"
          fields={[{ id: "title", name: "title", label: "Titre", type: "text" }]}
          initialData={editingDivers}
          onSubmit={(data) => {
            diversStore.update(editingDivers.id, data)
            setEditingDivers(null)
          }}
        />
      )}

      {editingSource && (
        <DialogForm
          open={!!editingSource}
          onOpenChange={() => setEditingSource(null)}
          title="Modifier la source"
          description="Modifiez les détails de la source"
          fields={[{ id: "title", name: "title", label: "Titre", type: "text" }]}
          initialData={editingSource}
          onSubmit={(data) => {
            sourceStore.update(editingSource.id, data)
            setEditingSource(null)
          }}
        />
      )}
    </div>
  )
}