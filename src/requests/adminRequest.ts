// Admin

// [GET] // get admin page
export const getFullDataApi = async () => {
  // no cache for filter
  const res = await fetch(`/api/admin`, {
    cache: 'no-store',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
