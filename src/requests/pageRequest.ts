// Page -------------------------------------

// [GET]
export const getHomeApi = async () => {
  // revalidate every 0.5 minute
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api`, { next: { revalidate: 30 } })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getProductPageApi = async (slug: string) => {
  // no cache
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/course/${slug}`, {
    cache: 'no-store',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getTagsPageApi = async (query: string = '') => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/tag${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getCategoriesPageApi = async (query: string = '') => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/category${query}`, {
    cache: 'no-store',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getFlashSalePageApi = async (query: string = '') => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/flash-sale${query}`, {
    cache: 'no-store',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getBestSellerPageApi = async (query: string = '') => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/best-seller${query}`, {
    cache: 'no-store',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]
export const getSearchPageApi = async (query: string = '') => {
  // no cache for filter
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/search${query}`, {
    cache: 'no-store',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
