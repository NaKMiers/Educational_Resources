// Course -------------------------------------

// [GET]
export const getAllCoursesApi = async (
  query: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  // no-store to avoid cache
  const res = await fetch(`/api/admin/course/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getCoursesApi = async (query: string = '', option: RequestInit = { cache: 'no-store' }) => {
  // no-store to avoid cache
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/course${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getForceAllCoursesApi = async () => {
  // no-store to avoid cache
  const res = await fetch(`/api/admin/course/force-all`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getCourseApi = async (id: string) => {
  // no-cache
  const res = await fetch(`/api/admin/course/${id}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getMyCoursesApi = async () => {
  // no-cache
  const res = await fetch(`/api/course/my-courses`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getBestSellerCoursesApi = async () => {
  // revalidate every 1 hour
  const res = await fetch('/api/course/best-seller', { next: { revalidate: 0 } })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const searchCoursesApi = async (search: string) => {
  // no-cache
  const res = await fetch(`/api/course/search?search=${search}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const addCourseApi = async (data: FormData) => {
  const res = await fetch('/api/admin/course/add', {
    method: 'POST',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const activateCoursesApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/course/activate', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const removeApplyingFlashSalesApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/course/remove-flash-sales', {
    method: 'PATCH',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const updateCoursePropertyApi = async (id: string, field: string, value: any) => {
  const res = await fetch(`/api/admin/course/${id}/edit-property/${field}`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const syncCoursesApi = async (ids: string[], all: boolean = false) => {
  const res = await fetch(`/api/admin/course/sync`, {
    method: 'PATCH',
    body: JSON.stringify({ all, ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]
export const updateCourseApi = async (id: string, data: FormData) => {
  const res = await fetch(`/api/admin/course/${id}/edit`, {
    method: 'PUT',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deleteCoursesApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/course/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
