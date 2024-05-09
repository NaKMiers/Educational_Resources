// Comment -------------------------------------

// [POST]
export const addCommentApi = async (courseId: string, content: string) => {
  const res = await fetch(`/api/comment/add`, {
    method: 'POST',
    body: JSON.stringify({ courseId, content }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const replyCommentApi = async (id: string, content: string) => {
  const res = await fetch(`/api/comment/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const likeCommentApi = async (id: string, value: 'y' | 'n') => {
  const res = await fetch(`/api/comment/${id}/like`, {
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
export const hideCommentApi = async (id: string, value: 'y' | 'n') => {
  const res = await fetch(`/api/comment/${id}/hide`, {
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
export const deleteCommentApi = async (id: string) => {
  const res = await fetch(`/api/comment/${id}/delete`)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
