import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AccountsTable } from './components/tables/AccountsTable'
import { ProfilesTable } from './components/tables/ProfilesTable'
import { CampaignsTable } from './components/tables/CampaignsTable'

function App() {
  return (
    <Router>
      <main className="px-[30px] py-[60px]">
        <Routes>
          <Route
            path="/"
            element={<AccountsTable />}
          />

          <Route
            path="/profiles/:accountId"
            element={<ProfilesTable />}
          />

          <Route
            path="/profiles/:accountId/campaigns/:profileId"
            element={<CampaignsTable />}
          />
        </Routes>
      </main >
    </Router>
  )
}

export default App
