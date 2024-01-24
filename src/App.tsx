import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AccountsTable } from './components/AccountsTable/AccountsTable'
import { ProfilesTable } from './components/ProfilesTable/ProfilesTable'

function App() {
  return (
    <Router>
      <main className="px-[30px] py-[60px]">
        <Routes>
          <Route path="/" element={<AccountsTable />} />
          <Route path="/profiles/:accountId" element={<ProfilesTable />}>
          </Route>
        </Routes>
      </main >
    </Router>
  )
}

export default App
