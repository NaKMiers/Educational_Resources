// Product -------------------------------------

// [GET]
export const getAllProductsApi = async (
  query: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  // no-store to avoid cache
  const res = await fetch(`/api/admin/product/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getForceAllProductsApi = async () => {
  // no-store to avoid cache
  const res = await fetch(`/api/admin/product/force-all`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getProductApi = async (id: string) => {
  // no-cache
  const res = await fetch(`/api/admin/product/${id}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getBestSellerProductsApi = async () => {
  // revalidate every 1 hour
  const res = await fetch('/api/product/best-seller', { next: { revalidate: 0 } })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const searchProductsApi = async (search: string) => {
  // no-cache
  const res = await fetch(`/api/product/search?search=${search}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]
export const addProductApi = async (data: FormData) => {
  const res = await fetch('/api/admin/product/add', {
    method: 'POST',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const activateProductsApi = async (ids: string[], value: boolean) => {
  const res = await fetch('/api/admin/product/activate', {
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
export const removeApplyingFlashSalesApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/product/remove-flash-sales', {
    method: 'PATCH',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const updateProductPropertyApi = async (id: string, field: string, value: any) => {
  const res = await fetch(`/api/admin/product/${id}/edit-property/${field}`, {
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
export const syncProductsApi = async (ids: string[], all: boolean = false) => {
  const res = await fetch(`/api/admin/product/sync`, {
    method: 'PATCH',
    body: JSON.stringify({ all, ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]
export const updateProductApi = async (id: string, data: FormData) => {
  const res = await fetch(`/api/admin/product/${id}/edit`, {
    method: 'PUT',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]
export const deleteProductsApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/product/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
