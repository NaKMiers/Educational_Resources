// import { FullyProduct } from '@/app/api/product/[slug]/route'
// import OrderModel from '@/models/OrderModel'
// import crypto from 'crypto'
import slugify from 'slugify'
import unidecode from 'unidecode'

// generate slug
export const generateSlug = (value: string): string => {
  const baseSlug: string = slugify(unidecode(value.trim()), {
    lower: true,
    remove: /[*+~.()'"!:@,]/g,
    strict: true,
  })

  const cleanSlug: string = baseSlug.replace(/[^a-zA-Z0-9]/g, '-')

  return encodeURIComponent(cleanSlug)
}

// // generate random code
// export const generateCode = (length: number): string => {
//   return crypto
//     .randomBytes(Math.ceil(length / 2))
//     .toString('hex')
//     .slice(0, length)
//     .toUpperCase()
// }

// // generate order code
// export const generateOrderCode = async (length: number) => {
//   let isUnique: boolean = false
//   let code: string = ''

//   while (!isUnique) {
//     code = generateCode(length)

//     const isCodeExists = await OrderModel.findOne({ code }).lean()

//     if (!isCodeExists) {
//       isUnique = true
//     }
//   }

//   return code
// }

// // make array becomes chaotic
// export const shuffleArray = (array: any[]): any[] => {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1))
//     ;[array[i], array[j]] = [array[j], array[i]]
//   }
//   return array
// }

// // create a unique random image name
// export const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

// // uppercase first letter
// export const uppercaseFirstLetter = (value: string): string => {
//   return value.charAt(0).toUpperCase() + value.slice(1)
// }
