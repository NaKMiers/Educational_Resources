// Lesson -------------------------------------

// [GET]
export const getAllChapterLessonsApi = async (chapterId: string, query: string = '') => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/lesson/${chapterId}/all${query}`, {
    cache: 'no-store',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getLessonApi = async (id: string) => {
  // no-cache
  const res = await fetch(`/api/lesson/${id}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const addLessonApi = async (chapterId: string, data: FormData) => {
  const res = await fetch(`/api/admin/lesson/${chapterId}/add`, {
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
export const updateLessonApi = async (id: string, data: FormData) => {
  const res = await fetch(`/api/admin/lesson/${id}/edit`, {
    method: 'PUT',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const activateLessonsApi = async (ids: string[], value: boolean) => {
  const res = await fetch(`/api/admin/lesson/activate`, {
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
export const likeLessonApi = async (id: string, value: 'y' | 'n') => {
  const res = await fetch(`/api/lesson/${id}/like`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deleteLessonsApi = async (ids: string[]) => {
  const res = await fetch(`/api/admin/lesson/delete`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
