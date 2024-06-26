// User -------------------------------------

// [GET]
export const getAllCourseChaptersApi = async (courseId: string, query: string = '') => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/chapter/${courseId}/all${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getForceAllChaptersApi = async (courseId: string) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/chapter/${courseId}/force-all`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getLearningChaptersApi = async (courseId: string) => {
  // no-cache
  const res = await fetch(`/api/chapter/${courseId}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getChapterApi = async (id: string) => {
  // no-cache
  const res = await fetch(`/api/admin/chapter/get-chapter/${id}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const addNewChapterApi = async (courseId: string, data: any) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/chapter/${courseId}/add`, {
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
export const updateChapterApi = async (id: string, data: any) => {
  const res = await fetch('/api/admin/chapter/edit', {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deleteChaptersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/chapter/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
