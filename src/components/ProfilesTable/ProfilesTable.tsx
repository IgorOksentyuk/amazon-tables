import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
// import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { Table } from 'react-bootstrap'

import { profilesData } from '../../data/profilesData'
import { profileTitles } from '../../constants/tableTitles'
import { TableFilter } from '../TableFIlter'
import { Profile } from '../../interfaces/profileInterface'

export const ProfilesTable = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const inputPlaceholder = 'country'

  const { accountId } = useParams()
  const navigate = useNavigate()

  const getVisibleProfiles = (
    profiles: Profile[],
    searchQuery: string,
  ) => {
    let visibleProfiles = [...profiles].filter(profile => profile.accountId.toString() === accountId)

    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase().trim()

      visibleProfiles = visibleProfiles.filter((profile) =>
        profile.country.toLowerCase().includes(normalizedQuery)
      )
    }

    return visibleProfiles
  }

  useEffect(() => {
    if (!accountId) {
      navigate('/');
    }
  }, [accountId, navigate])

  const visibleProfiles = getVisibleProfiles(
    profilesData,
    searchQuery,
  )

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-2xl mb-[20px]">Profiles of {accountId} account</h2>
        <Link to="/" className="no-underline text-black font-bold
        hover:scale-125 duration-300 ease-in-out">
          Go to accounts
        </Link>
      </div>

      <TableFilter
        setSearchQuery={setSearchQuery}
        inputPlaceholder={inputPlaceholder}
      />


      {visibleProfiles.length > 0
        ? <Table striped bordered hover>
          <thead>
            <tr>
              {profileTitles.map(title => (
                <th
                  key={title}
                // onClick={() => sortBy(title)}
                >
                  <div className="flex items-center gap-[20px]">
                    <p className="m-[0]">
                      {title}
                    </p>

                    <div className="cursor-pointer transition-colors duration-300 hover:text-blue-500">
                      {/* {sortType !== title && <FaSort />}
                {sortType === title && isReversed && <FaSortDown />}
                {sortType === title && !isReversed && <FaSortUp />} */}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {visibleProfiles.map((profile) => (
              <tr key={profile.profileId}>
                <td>{profile.profileId}</td>
                <td>{profile.country}</td>
                <td>{profile.marketplace}</td>
                <td>{profile.accountId}</td>
                {/* <td>
            <Link to={`/profiles/${account.accountId}`} key={account.accountId}>
              Go to account №{account.accountId} profiles
            </Link>
          </td> */}
              </tr>
            ))}
          </tbody>
        </Table>
        : <p className="text-center">There are no profiles!</p>}
    </>
  )
}