import type { Option } from "@/components/DialogForm"

export const fields = {
  title: {
    id: 'title',
    name: 'title',
    label: 'Title',
    type: 'text',
    defaultValue: '',
  },
  amount: {
    id: 'amount',
    name: 'amount',
    label: 'Amount',
    type: 'number',
    defaultValue: 0,
  },
  sourceId: (options: Option[]) => {
    return ({
      id: 'sourceId',
      name: 'sourceId',
      label: 'Source',
      type: 'select',
      options: options,
    })
  },
  diversId: (options: Option[]) => {
    return ({
      id: 'diversId',
      name: 'diversId',
      label: 'Divers',
      type: 'select',
      options: options as Option[],
    })
  },
  caisseId: (options: Option[]) => {
    return ({
      id: 'caisseId',
      name: 'caisseId',
      label: 'Caisse',
      type: 'select',
      options: options as Option[],
    })
  },

  commentaire: {
    id: 'commentaire',
    name: 'commentaire',
    label: 'Commentaire',
    type: 'text',
    defaultValue: '',
  },
  position: {
    id: 'position',
    name: 'position',
    label: 'Position',
    type: 'number',
    defaultValue: 0,
  },
};