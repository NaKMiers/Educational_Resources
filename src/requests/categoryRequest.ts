// Category -------------------------------------

// [GET]
export const getAllCagetoriesApi = async (query: string = '') => {
  // no cache
  const res = await fetch(`/api/admin/category/all${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getForceAllCagetoriesApi = async (option: RequestInit = { cache: 'no-store' }) => {
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
export const addCategoryApi = async (data: FormData) => {
  const res = await fetch('/api/admin/category/add', {
    method: 'POST',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]
export const updateCategoryApi = async (slug: string, data: FormData) => {
  const res = await fetch(`/api/admin/category/${slug}/edit`, {
    method: 'PUT',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]
// export const updateCategoriesApi = async (editingValues: EditingValues[]) => {
//   const res = await fetch('/api/admin/category/edit', {
//     method: 'PUT',
//     body: JSON.stringify({ editingValues }),
//   })

//   // check status
//   if (!res.ok) {
//     throw new Error((await res.json()).message)
//   }

//   return await res.json()
// }

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
