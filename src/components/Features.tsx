import { features } from '@/constants'
import Image from 'next/image'
import Divider from './Divider'
import Heading from './Heading'

interface FeaturesProps {
  className?: string
}

function Features({ className = '' }: FeaturesProps) {
  return (
    <div className={`max-w-1200 mx-auto ${className}`}>
      <Heading title='My Features' space />

      <Divider size={8} />

      <div className='px-21/2 py-21 sm:px-0 grid grid-cols-1 md:grid-cols-3 justify-evenly gap-21'>
        {features.map(item => (
          <div className='px-21 h-full trans-300 trans-300 hover:-translate-y-2' key={item.image}>
            <div className='p-21 h-full rounded-small shadow-lg overflow-hidden bg-white'>
              <div className='max-w-[75px] max-h-[75px] w-full h-full aspect-square'>
                <Image
                  className='w-full h-full object-cover'
                  src={item.image}
                  width={75}
                  height={75}
                  alt={item.title}
                />
              </div>

              <Divider size={4} />

              <h3 className='font-body text-[22px] text-darker font-semibold text-left uppercase'>
                {item.title}
              </h3>

              <Divider size={8} />

              <p className='font-body tracking-wider text-sm'>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Features
