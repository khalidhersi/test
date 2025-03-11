import { database } from "./config"
import { ref, set, get, push, update, remove, query as fbQuery, orderByChild, equalTo } from "firebase/database"

export const databaseService = {
  create: async (collection: string, data: any) => {
    const collectionRef = ref(database, collection)
    const newItemRef = push(collectionRef)

    const timestamp = new Date().toISOString()
    await set(newItemRef, {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    })

    return {
      id: newItemRef.key,
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
  },

  getById: async (collection: string, id: string) => {
    const itemRef = ref(database, `${collection}/${id}`)
    const snapshot = await get(itemRef)

    if (!snapshot.exists()) {
      throw new Error(`Item not found in ${collection}`)
    }

    return {
      id,
      ...snapshot.val(),
    }
  },

  update: async (collection: string, id: string, data: any) => {
    const itemRef = ref(database, `${collection}/${id}`)

    // First check if the item exists
    const snapshot = await get(itemRef)
    if (!snapshot.exists()) {
      throw new Error(`Item not found in ${collection}`)
    }

    // Update with new data
    await update(itemRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    })
  },

  delete: async (collection: string, id: string) => {
    const itemRef = ref(database, `${collection}/${id}`)
    await remove(itemRef)
  },

  getAll: async (collection: string) => {
    const collectionRef = ref(database, collection)
    const snapshot = await get(collectionRef)

    if (!snapshot.exists()) {
      return []
    }

    return Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...(data as any),
    }))
  },

  query: async (
    collection: string,
    options: {
      orderBy?: string
      equalTo?: any
      limitTo?: number
    },
  ) => {
    const collectionRef = ref(database, collection)

    let queryRef = collectionRef

    if (options.orderBy) {
      queryRef = fbQuery(collectionRef, orderByChild(options.orderBy))

      if (options.equalTo !== undefined) {
        queryRef = fbQuery(queryRef, equalTo(options.equalTo))
      }
    }

    const snapshot = await get(queryRef)

    if (!snapshot.exists()) {
      return []
    }

    let results = Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...(data as any),
    }))

    if (options.limitTo) {
      results = results.slice(0, options.limitTo)
    }

    return results
  },
}

