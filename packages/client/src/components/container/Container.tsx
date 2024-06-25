import { ReactNode } from 'react'

const Container = (props: { children: ReactNode }) => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {props.children}
    </div>
  )
}
export default Container
