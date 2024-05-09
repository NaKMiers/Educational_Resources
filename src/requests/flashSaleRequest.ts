// Flashsale

// [GET]
export const getAllFlashSalesApi = async (query: string) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/flash-sale/all${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getFlashSaleApi = async (id: string) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/flash-sale/${id}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const addFlashSaleApi = async (data: any) => {
  const res = await fetch('/api/admin/flash-sale/add', {
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
export const updateFlashSaleApi = async (id: string, data: any, appliedCourses: string[]) => {
  const res = await fetch(`/api/admin/flash-sale/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify({
      ...data,
      appliedCourses,
    }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deleteFlashSalesApi = async (ids: string[], courseIds: string[]) => {
  const res = await fetch('/api/admin/flash-sale/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids, courseIds }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
