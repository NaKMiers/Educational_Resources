// Question -------------------------------------

// [POST]
export const addQuestionApi = async (data: any) => {
  const res = await fetch('/api/question/add', {
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
export const updateQuestionsApi = async (id: string, data: any) => {
  const res = await fetch(`/api/question/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const closeQuestionsApi = async (id: string, value: 'close' | 'open') => {
  const res = await fetch(`/api/question/${id}/close`, {
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
export const likeQuestionsApi = async (id: string, value: boolean) => {
  const res = await fetch(`/api/question/${id}/like`, {
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
export const deleteQuestionsApi = async (ids: string[]) => {
  const res = await fetch('/api/question/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
