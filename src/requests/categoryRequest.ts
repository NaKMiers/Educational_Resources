// Category -------------------------------------

import { EditingValues } from '@/app/(admin)/admin/category/all/page'

// [GET]
export const getAllCategoriesApi = async (query: string = '') => {
  // no cache
  const res = await fetch(`/api/admin/category/all${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getForceAllCategoriesApi = async (option: RequestInit = { cache: 'no-store' }) => {
  // no cache
  const res = await fetch('/api/admin/category/force-all', option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getCategoryApi = async (slug: string) => {
  // no cache
  const res = await fetch(`/api/admin/category/${slug}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const addCategoryApi = async (data: any) => {
  const res = await fetch('/api/admin/category/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]
export const updateCategoryApi = async (slug: string, data: any) => {
  const res = await fetch(`/api/admin/category/${slug}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]
export const updateCategoriesApi = async (editingValues: EditingValues[]) => {
  const res = await fetch('/api/admin/category/edit', {
    method: 'PUT',
    body: JSON.stringify({ editingValues }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const bootCategoriesApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/category/boot', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deleteCategoriesApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/category/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
