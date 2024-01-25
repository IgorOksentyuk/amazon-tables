import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'

import { campaignsData } from '../../data/campaignsData'
import { Campaign } from '../../interfaces/campaignsInterface'
import { campaignTitles } from '../../constants/tableTitles'
import { TableFilter } from '../TableFilter'
import { Pagination } from '../Pagination'

const ITEMS_PER_PAGE = 3

const getVisibleCampaigns = (
  campaignsData: Campaign[],
  profileId: string,
  searchQuery: string,
  sortType: string,
  isReversed: boolean,
  currentPage: number,
) => {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const filteredCampaigns = [...campaignsData]
    .filter(campaign => campaign.profileId.toString() === profileId)

  const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE)
  let visibleCampaigns = filteredCampaigns.slice(startIndex, endIndex)

  if (searchQuery) {
    const normalizedQuery = searchQuery.toLowerCase().trim()

    visibleCampaigns = visibleCampaigns.filter(campaign =>
      campaign.date.toLocaleLowerCase().includes(normalizedQuery)
    )
  }

  if (sortType) {
    visibleCampaigns.sort((a, b) => {
      switch (sortType) {
        case 'campaignId':
        case 'clicks':
        case 'cost':
        case 'profileId':
          return (+a[sortType] - +b[sortType])

        case 'date':
          return a[sortType].localeCompare(b[sortType])

        default:
          return 0
      }
    })
  }

  if (isReversed) {
    visibleCampaigns.reverse()
  }

  return { visibleCampaigns, totalPages }
}

export const CampaignsTable = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortType, setSortType] = useState('')
  const [isReversed, setIsReversed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const { accountId } = useParams()
  const { profileId } = useParams()

  const inputPlaceholder = 'date'

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

  const { visibleCampaigns, totalPages } = getVisibleCampaigns(
    campaignsData,
    profileId || '',
    searchQuery,
    sortType,
    isReversed,
    currentPage,
  )

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-2xl mb-[20px]">Campaigns of {profileId} profile</h2>

        <Link to={`/profiles/${accountId}`} className="no-underline text-black font-bold
        hover:scale-125 duration-300 ease-in-out">
          Go to profiles
        </Link>
      </div>

      <TableFilter
        setSearchQuery={setSearchQuery}
        inputPlaceholder={inputPlaceholder}
      />

      {visibleCampaigns.length > 0
        ? <Table striped bordered hover>
          <thead>
            <tr>
              {campaignTitles.map(title => (
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
            {visibleCampaigns.map((campaign) => (
              <tr key={campaign.campaignId}>
                <td>{campaign.campaignId}</td>
                <td>{campaign.clicks}</td>
                <td>{campaign.cost}</td>
                <td>{campaign.date}</td>
                <td>{campaign.profileId}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        : <p className="text-center">There are no campaigns!</p>
      }

      <Pagination
        pages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </>
  )
}