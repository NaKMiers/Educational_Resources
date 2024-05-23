// [GET]
export const getAllOrdersApi = async (
  query: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/order/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getOrderHistoryApi = async (query: string) => {
  // no-store to bypass cache
  const res = await fetch(`/api/user/order-history${query}`, {
    cache: 'no-store',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getOrderApi = async (code: string) => {
  // no-store to bypass cache
  const res = await fetch(`/api/order/${code}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const generateOrderCodeApi = async () => {
  // no cache
  const res = await fetch('/api/order/generate-order-code', {
    cache: 'no-store',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const createOrderApi = async ({
  code,
  email,
  total,
  voucherApplied,
  receivedUser,
  discount,
  item,
  paymentMethod,
}: {
  code: string
  email: string
  total: number
  receivedUser: string | undefined
  voucherApplied: string | undefined
  discount: number | undefined
  item: any
  paymentMethod: string
}) => {
  const res = await fetch('/api/order/create', {
    method: 'POST',
    body: JSON.stringify({
      code,
      email,
      total,
      receivedUser,
      voucherApplied,
      discount,
      item,
      paymentMethod,
    }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const deliverOrderApi = async (orderId: string, message: string = '') => {
  const res = await fetch(`/api/admin/order/${orderId}/deliver`, {
    method: 'PATCH',
    body: JSON.stringify({ message }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const reDeliverOrder = async (orderId: string, message: string = '') => {
  const res = await fetch(`/api/admin/order/${orderId}/re-deliver`, {
    method: 'PATCH',
    body: JSON.stringify({ message }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const cancelOrdersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/order/cancel', {
    method: 'PATCH',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deletedOrdersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/order/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
