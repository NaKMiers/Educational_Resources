// Report -------------------------------------

// [GET]
export const getAllReportsApi = async (query: string = '') => {
  // no cache
  const res = await fetch(`/api/admin/report/all${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const addReportApi = async (data: any) => {
  const res = await fetch('/api/report/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deleteReportsApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/report/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
