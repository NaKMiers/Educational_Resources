// Auth -------------------------------------

// [POST]
export const registerApi = async (data: any) => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const forgotPasswordApi = async (data: any) => {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const resetPassword = async (token: string, newPassword: string) => {
  const res = await fetch(`/api/auth/reset-password?token=${token}`, {
    method: 'PATCH',
    body: JSON.stringify({ newPassword }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const verifyEmailApi = async (email: string, token: string = '') => {
  const res = await fetch('/api/auth/verify-email' + (token ? '?token=' + token : ''), {
    method: 'POST',
    body: JSON.stringify({ email }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const verifyPhoneApi = async (phone: string) => {
  const res = await fetch('/api/auth/verify-phone', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
