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
export const getUsersApi = async (id: string = '') => {
  // no-store to bypass cache
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/${id}`, { cache: 'no-store' })

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

// [POST]
export const checkAuthenticationApi = async (password: string) => {
  // no-store to bypass cache
  const res = await fetch('/api/user/check-authentication', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]
export const updatePersonalInfoApi = async (data: any) => {
  const res = await fetch('/api/user/update-personal-info', {
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
export const updatePrivateInfoApi = async (data: any) => {
  const res = await fetch('/api/user/update-private-info', {
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

// [PATCH]
export const blockCommentApi = async (userId: string, value: boolean) => {
  const res = await fetch(`/api/admin/user/${userId}/block-comment`, {
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
export const blockAddQuestionApi = async (userId: string, value: boolean) => {
  const res = await fetch(`/api/admin/user/${userId}/block-add-question`, {
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
export const changeNotificationSettingApi = async (type: string, value: boolean) => {
  const res = await fetch(`/api/user/change-notification-setting`, {
    method: 'PATCH',
    body: JSON.stringify({ type, value }),
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

// [DELETE]
export const removeNotificationApi = async (notificationId: string) => {
  const res = await fetch(`/api/user/remove-notification/${notificationId}`, {
    method: 'DELETE',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
