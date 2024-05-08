// User -------------------------------------

// [GET]
export const getAllUsersApi = async (query: string = '') => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/user/all${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getRoleUsersApi = async () => {
  // no-store to bypass cache
  const res = await fetch('/api/admin/user/role-users', { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getRankUsersApi = async () => {
  // no-store to bypass cache
  const res = await fetch('/api/admin/user/rank-user', { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]
export const updateProfileApi = async (data: any) => {
  const res = await fetch('/api/user/update-profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]
export const changeAvatarApi = async (data: FormData) => {
  const res = await fetch('/api/user/change-avatar', {
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
export const changePasswordApi = async (data: any) => {
  const res = await fetch('/api/user/change-password', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const rechargeUserApi = async (id: string, amount: number) => {
  const res = await fetch(`/api/admin/user/${id}/recharge`, {
    method: 'PATCH',
    body: JSON.stringify({ amount }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const setCollaboratorApi = async (userId: string, type: string, value: string) => {
  const res = await fetch(`/api/admin/user/${userId}/set-collaborator`, {
    method: 'PATCH',
    body: JSON.stringify({ type, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const demoteCollaboratorApi = async (userId: string) => {
  const res = await fetch(`/api/admin/user/${userId}/demote-collaborator`, {
    method: 'PATCH',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deleteUsersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/user/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
