// Report -------------------------------------

// [POST]
export const addReportApi = async (data: any) => {
  const res = await fetch('/api/report/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
