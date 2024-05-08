import { IFlashSale } from '@/models/FlashSaleModel'

export const formatPrice = (price: number = 0) => {
  return Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export const countPercent = (price: number, oldPrice: number) =>
  Math.ceil(((oldPrice - price) / oldPrice) * 100) + '%'

export const calcPercentage = (percentageString: string, number: number) => {
  const percentage = Number(percentageString.replace('%', ''))
  const result = (percentage / 100) * number
  return result
}

export const applyFlashSalePrice = (flashSale: IFlashSale, price: number): number => {
  const now = new Date()

  if (!flashSale) return price

  // check flashsale is valid
  let isValid = false

  if (now > new Date(flashSale.begin)) {
    if (flashSale.timeType === 'once') {
      if (flashSale.expire && now < new Date(flashSale.expire)) {
        isValid = true
      }
    } else if (flashSale.timeType === 'loop') {
      isValid = true
    }

    // if invalid flashsale
    if (!isValid) {
      return price
    }

    switch (flashSale.type) {
      case 'fixed-reduce':
        return price + +flashSale.value >= 0 ? price + +flashSale.value : 0
      case 'fixed':
        return +flashSale.value
      case 'percentage':
        return price + Math.floor((price * parseFloat(flashSale.value)) / 100)
    }
  }

  return price
}
