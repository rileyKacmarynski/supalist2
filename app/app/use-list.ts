import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { ListItem, ListWithItems } from '@/app/app/schema'
import { useSupabase } from '@/app/supabase-provider'
import { useToast } from '@/hooks/use-toast'
import { PostgrestError } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import { boolean } from 'zod'

export const actionTypes = {
  ADD_ITEM: 'ADD_ITEM',
  DELTE_ITEM: 'DELETE_ITEM',
  TOGGLE_ITEM_COMPLETE: 'TOGGLE_ITEM_COMPLETE',
  UPDATE_ITEM: 'UPDATE_ITEM',
  SET_LIST: 'SET_LIST',
} as const

export type ActionType = typeof actionTypes

export type Action =
  | { type: ActionType['ADD_ITEM']; item: ListItem }
  | { type: ActionType['DELTE_ITEM']; itemId: string }
  | { type: ActionType['UPDATE_ITEM']; item: Partial<ListItem> }
  | { type: ActionType['SET_LIST']; list: ListWithItems }

export type State = ListWithItems & {
  loading: boolean
}

export function reducer(state: State, action: Action): State {
  function updateItem(item: Partial<ListItem>) {
    // there's gotta be an easier way to do this
    const index = state.list_items.findIndex((i) => i.id === item.id)
    const items = [...state.list_items].filter((i) => i.id !== item.id)
    items.splice(index, 0, {
      ...state.list_items[index],
      ...item,
    })

    return {
      ...state,
      list_items: items,
    }
  }
  switch (action.type) {
    case 'SET_LIST':
      return {
        loading: false,
        ...action.list,
      }
    case 'ADD_ITEM':
      return {
        ...state,
        list_items: [...state.list_items, action.item],
      }
    case 'DELETE_ITEM':
      return {
        ...state,
        list_items: [...state.list_items].filter((i) => i.id !== action.itemId),
      }
    case 'UPDATE_ITEM':
      return updateItem(action.item)
  }
}

export function useList(id: string) {
  const [list, dispatch] = useReducer(reducer, {
    id,
    list_items: [],
    loading: true,
  } as unknown as State)
  const { supabase } = useSupabase()
  const { toast } = useToast()

  useEffect(() => {
    const getList = async () => {
      const result = await supabase
        .from('lists')
        .select(
          `*,
      list_items (
        *
      )`
        )
        .match({ id })

      // @ts-ignore
      dispatch({ type: 'SET_LIST', list: result.data[0] })
    }
    getList()
  }, [id, supabase])

  useEffect(() => {
    console.log('subscribing to changes')
    const channel = supabase
      .channel('list-item-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'list_items',
          filter: `list_id=eq.${list.id}`,
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              const item = payload.new as ListItem
              if (!list.list_items.some((i) => i.id === item.id)) {
                dispatch({ type: 'ADD_ITEM', item })
              }

              break
            case 'DELETE':
              const { id } = payload.old as ListItem
              if (list.list_items.some((i) => i.id === id)) {
                dispatch({ type: 'DELETE_ITEM', itemId: id })
              }
              break
            case 'UPDATE':
              const newItem = payload.new as ListItem
              dispatch({ type: 'UPDATE_ITEM', item: newItem })

              break
            default:
              throw new Error('Unknown eventType')
          }

          console.log(payload)
        }
      )
      .subscribe()

    return () => void supabase.removeChannel(channel)
  }, [list, supabase])

  // could add error callbacks for all, but don't have the need right now
  const addItem = useCallback(
    async ({
      text,
      onError,
    }: {
      text: string
      onError: (e: PostgrestError) => void
    }) => {
      const newItem: ListItem = {
        id: uuidv4(),
        list_id: list.id,
        completed: false,
        text,
        updated_at: new Date().toUTCString(),
        created_at: new Date().toUTCString(),
      }

      dispatch({ type: 'ADD_ITEM', item: newItem })

      const { error } = await supabase.from('list_items').insert(newItem)

      if (error) {
        onError(error)
        dispatch({ type: 'DELETE_ITEM', itemId: newItem.id })

        toast({
          title: 'Error creating new item',
          description: error.message,
          variant: 'destructive',
        })
      }
    },
    [list.id, supabase, toast]
  )

  const deleteItem = useCallback(
    async (id: string) => {
      const itemToDelete = list.list_items.find((i) => i.id === id)
      if (!itemToDelete) return

      dispatch({ type: 'DELETE_ITEM', itemId: id })

      const { error } = await supabase.from('list_items').delete().match({ id })

      if (error) {
        // this won't add it back at the same spot in the list, but oh well
        dispatch({ type: 'ADD_ITEM', item: itemToDelete })

        toast({
          title: 'Error deleting item',
          description: error.message,
          variant: 'destructive',
        })
      }
    },
    [list]
  )

  const markItemComplete = useCallback(
    async (itemId: string) => {
      // I guess bad things could potentially happen
      // if two people complete an item at once
      const existingItem = list.list_items.find((i) => i.id === itemId)
      if (!existingItem) {
        toast({
          title: 'Item deleted',
          description: 'The item you are trying to modify has been deleted',
          variant: 'destructive',
        })

        return
      }

      const nextCompletedValue = !existingItem.completed

      // the update time will be updated when we get the postgres change event
      dispatch({
        type: 'UPDATE_ITEM',
        item: { ...existingItem, completed: nextCompletedValue },
      })

      const { error } = await supabase
        .from('list_items')
        .update({
          completed: nextCompletedValue,
          updated_at: new Date().toUTCString(),
        })
        .match({ id: itemId })

      if (error) {
        dispatch({
          type: 'UPDATE_ITEM',
          item: { ...existingItem },
        })

        toast({
          title: 'Error toggling completion status',
          description: error.message,
          variant: 'destructive',
        })
      }
    },
    [list]
  )

  return { list, markItemComplete, deleteItem, addItem }
}
