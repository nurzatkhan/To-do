import './App.css'
import { SnackbarProvider } from 'notistack'
import Test from './pages/Test'

function App() {
  return (
    <div className="App">
      <SnackbarProvider maxSnack={3}>
        <Test />
      </SnackbarProvider>
    </div>
  )
}

export default App
