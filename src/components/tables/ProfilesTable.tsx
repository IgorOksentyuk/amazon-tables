import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { Table } from 'react-bootstrap'

import { profilesData } from '../../data/profilesData'
import { profileTitles } from '../../constants/tableTitles'
import { TableFilter } from '../TableFilter'
import { Profile } from '../../interfaces/profileInterface'
import { Pagination } from '../Pagination'

const ITEMS_PER_PAGE = 5

const getVisibleProfiles = (
  profiles: Profile[],
  searchQuery: string,
  currentPage: number,
  accountId: string,
  sortType: string,
  isReversed: boolean,
) => {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const filteredProfiles = [...profiles]
    .filter(profile => profile.accountId.toString() === accountId)

  const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE)
  let visibleProfiles = filteredProfiles.slice(startIndex, endIndex)

  if (searchQuery) {
    const normalizedQuery = searchQuery.toLowerCase().trim()

    visibleProfiles = visibleProfiles.filter((profile) =>
      profile.country.toLowerCase().includes(normalizedQuery)
    )
  }

  if (sortType) {
    visibleProfiles.sort((a, b) => {
      switch (sortType) {
        case 'accountId':
        case 'profileId':
          return (+a[sortType] - +b[sortType])

        case 'country':
        case 'marketplace':
          return a[sortType].localeCompare(b[sortType])

        default:
          return 0
      }
    })
  }

  if (isReversed) {
    visibleProfiles.reverse()
  }

  return { visibleProfiles, totalPages }
}

export const ProfilesTable = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortType, setSortType] = useState('')
  const [isReversed, setIsReversed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const inputPlaceholder = 'country'

  const { accountId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!accountId) {
      navigate('/');
    }
  }, [accountId, navigate])

  const sortBy = (newSortType: string) => {
    const firstClick = newSortType !== sortType
    const secondClick = newSortType === sortType && !isReversed
    const thirdClick = newSortType === sortType && isReversed

    if (firstClick) {
      setSortType(newSortType)
      setIsReversed(false)

      return
    }

    if (secondClick) {
      setSortType(newSortType)
      setIsReversed(true)

      return
    }

    if (thirdClick) {
      setSortType('')
      setIsReversed(false)

      return
    }
  }

  const { visibleProfiles, totalPages } = getVisibleProfiles(
    profilesData,
    searchQuery,
    currentPage,
    accountId || '',
    sortType,
    isReversed,
  )

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

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
                  onClick={() => sortBy(title)}
                >
                  <div className="flex items-center gap-[20px]">
                    <p className="m-[0]">
                      {title}
                    </p>

                    <div className="cursor-pointer transition-colors duration-300 hover:text-blue-500">
                      {sortType !== title && <FaSort />}
                      {sortType === title && isReversed && <FaSortDown />}
                      {sortType === title && !isReversed && <FaSortUp />}
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
                <td className="cursor-pointer hover:scale-125 duration-300 ease-in-out">
                  <Link
                    to={`/profiles/${accountId}/campaigns/${profile.profileId}`}
                    key={profile.profileId}
                    className="no-underline text-blue-500"
                  >
                    Go to profile №{profile.profileId} campaigns
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        : <p className="text-center">There are no profiles!</p>
      }

      {visibleProfiles.length > 0
        && <Pagination
          pages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />}
    </>
  )
}