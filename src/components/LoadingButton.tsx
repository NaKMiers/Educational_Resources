import { RiDonutChartFill } from 'react-icons/ri'

interface LoadingButtonProps {
  text: string
  isLoading: boolean
  onClick?: (e?: any) => void
  className?: string
}

function LoadingButton({ text, isLoading, onClick, className = '' }: LoadingButtonProps) {
  return (
    <button
      className={`${isLoading ? 'pointer-events-none flex justify-center' : ''} ${className}`}
      disabled={isLoading}
      onClick={onClick}>
      {isLoading ? <RiDonutChartFill size={20} className='animate-spin' /> : text}
    </button>
  )
}

export default LoadingButton
