// Account -------------------------------------

// [GET]
export const getAllAccountsApi = async (query: string = '') => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/account/all${query}`, {
    cache: 'no-store',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getAccountApi = async (id: string) => {
  // no-cache
  const res = await fetch(`/api/admin/account/${id}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const addAccountApi = async (data: any) => {
  const res = await fetch('/api/admin/account/add', {
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
export const updateAccountApi = async (id: string, data: any) => {
  const res = await fetch(`/api/admin/account/${id}/edit`, {
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
export const activateAccountsApi = async (ids: string[], value: boolean) => {
  const res = await fetch(`/api/admin/account/activate`, {
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
export const deleteAccountsApi = async (ids: string[]) => {
  const res = await fetch(`/api/admin/account/delete`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
