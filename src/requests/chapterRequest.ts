// User -------------------------------------

// [GET]
export const getAllCourseChaptersApi = async (courseId: string, query: string = '') => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/chapter/${courseId}/all${query}`, { cache: 'no-store' })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
