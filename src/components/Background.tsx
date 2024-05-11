import Image from 'next/image'

function Background() {
  return (
    <div className='fixed -z-10 top-0 left-0 bottom-0 right-0 w-screen h-screen flex items-center justify-center bg-primary '>
      <div className='max-w-[300px] max-h-[300px] w-full h-full'>
        <Image
          className='w-full h-full object-cover'
          src='/images/logo.png'
          width={600}
          height={600}
          alt='logo'
        />
      </div>
    </div>
  )
}

export default Background
