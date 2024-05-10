export const handleQuery = (
  searchParams: { [key: string]: string[] | string } | undefined,
  prefix: string = ''
): string => {
  let query = prefix + '?'

  // remove empty value
  for (let key in searchParams) {
    if (!searchParams[key]) delete searchParams[key]
  }

  // validate search params
  for (let key in searchParams) {
    // the params that allow only 1 value
    if (
      [
        'search',
        'sort',
        'userId',
        'voucherApplied',
        'status',
        'paymentMethod',
        'from',
        'to',
        'active',
        'expire',
        'role',
        'flashSale',
        'booted',
        'type',
        'timesLeft',
        'beginFrom',
        'beginTo',
        'expireFrom',
        'expireTo',
        'timeType',
      ].includes(key)
    ) {
      if (Array.isArray(searchParams[key]) && searchParams[key].length > 1) {
        searchParams[key] = searchParams[key].slice(-1)
      }
    }
  }

  // build query
  for (let key in searchParams) {
    // check if key is an array
    if (Array.isArray(searchParams[key])) {
      for (let value of searchParams[key]) {
        query += `${key}=${value}&`
      }
    } else {
      query += `${key}=${searchParams[key]}&`
    }
  }

  // remove all spaces
  query = query.replace(/ /g, '')

  // remove final '&'
  query = query.slice(0, -1)

  return query
}

export const searchParamsToObject = (searchParams: URLSearchParams): { [key: string]: string[] } => {
  const params: { [key: string]: string[] } = {}
  for (let key of Array.from(searchParams.keys())) {
    params[key] = searchParams.getAll(key)
  }

  return params
}
