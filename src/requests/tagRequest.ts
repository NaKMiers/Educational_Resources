// Tag -------------------------------------

// [GET]
export const getAllTagsApi = async (query: string = '') => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/tag/all${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getForceAllTagsApi = async () => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/tag/force-all`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const addTagApi = async (data: any) => {
  const res = await fetch('/api/admin/tag/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const bootTagsApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/tag/boot', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]
export const updateTagsApi = async (editingValues: any[]) => {
  const res = await fetch('/api/admin/tag/edit', {
    method: 'PUT',
    body: JSON.stringify({ editingValues }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deleteTagsApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/tag/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
