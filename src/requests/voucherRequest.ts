// Voucher

// [GET]
export const getAllVouchersApi = async (query: string = '') => {
  // no cache
  const res = await fetch(`/api/admin/voucher/all${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getVoucherApi = async (code: string) => {
  // no cache
  const res = await fetch(`/api/admin/voucher/${code}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const addVoucherApi = async (data: any) => {
  const res = await fetch('/api/admin/voucher/add', {
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
export const activateVouchersApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/voucher/activate', {
    method: 'PATCH',
    body: JSON.stringify({ ids, value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const applyVoucherApi = async (code: string, email: string, subTotal: number) => {
  const res = await fetch(`/api/voucher/${code}/apply`, {
    method: 'POST',
    body: JSON.stringify({
      email: email,
      total: subTotal,
    }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]
export const updateVoucherApi = async (code: string, data: any) => {
  const res = await fetch(`/api/admin/voucher/${code}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deleteVouchersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/voucher/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
