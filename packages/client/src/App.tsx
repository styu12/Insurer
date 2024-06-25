// import * as css from './App.css'
import Calendar from './components/calendar/Calendar'
import Container from './components/container/Container'
const App = () => {
  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50 flex h-16 border-b border-gray-900/10">
        <div className="mx-auto max-w-2xl text-base font-semibold leading-6 text-gray-900 lg:mx-0 lg:max-w-none">
          보장개시알림
        </div>
      </header>
      <main>
        <div className="relative isolate overflow-hidden pt-16">
          <Container>
            <Calendar />
          </Container>
        </div>
      </main>
    </div>
  )
}

export default App
