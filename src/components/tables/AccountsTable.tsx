import { useState } from 'react'
import { Table } from 'react-bootstrap'
import { FaSort } from 'react-icons/fa'
import { FaSortDown } from 'react-icons/fa'
import { FaSortUp } from 'react-icons/fa'

import { accountsData } from '../../data/accountsData'
import { accountTitles } from '../../constants/tableTitles'
import { Account } from '../../interfaces/accountInterface'
import { TableFilter } from '../TableFilter'
import { Pagination } from '../Pagination'
import { Link } from 'react-router-dom'

const ITEMS_PER_PAGE = 5

const getVisibleAccounts = (
  accounts: Account[],
  searchQuery: string,
  sortType: string,
  isReversed: boolean,
  currentPage: number,
) => {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  let visibleAccounts = [...accounts]

  visibleAccounts = visibleAccounts.slice(startIndex, endIndex)

  if (searchQuery) {
    const normalizedQuery = searchQuery.toLowerCase().trim()

    visibleAccounts = visibleAccounts.filter((account) =>
      account.email.toLowerCase().includes(normalizedQuery)
    )
  }

  if (sortType) {
    visibleAccounts.sort((a, b) => {
      switch (sortType) {
        case 'accountId':
          return (+a[sortType] - +b[sortType])

        case 'email':
        case 'authToken':
        case 'creationDate':
          return a[sortType].localeCompare(b[sortType])

        default:
          return 0
      }
    })
  }

  if (isReversed) {
    visibleAccounts.reverse()
  }

  return visibleAccounts
}

export const AccountsTable = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortType, setSortType] = useState('')
  const [isReversed, setIsReversed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const inputPlaceholder = 'email'

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

  const visibleAccounts = getVisibleAccounts(
    accountsData,
    searchQuery,
    sortType,
    isReversed,
    currentPage,
  )

  const totalPages = Math.ceil(accountsData.length / ITEMS_PER_PAGE)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <>
      <h1 className="text-2xl mb-[20px]">Accounts table</h1>

      <TableFilter
        setSearchQuery={setSearchQuery}
        inputPlaceholder={inputPlaceholder}
      />

      {visibleAccounts.length > 0
        ? <Table striped bordered hover>
          <thead>
            <tr>
              {accountTitles.map(title => (
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
            {visibleAccounts.map((account) => (
              <tr key={account.accountId}>
                <td>{account.accountId}</td>
                <td>{account.email}</td>
                <td>{account.authToken}</td>
                <td>{account.creationDate}</td>
                <td className="cursor-pointer hover:scale-125 duration-300 ease-in-out">
                  <Link
                    to={`/profiles/${account.accountId}`}
                    key={account.accountId}
                    className="no-underline text-blue-500"
                  >
                    Go to account №{account.accountId} profiles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table >
        : <p className="text-center">There are no accounts!</p>
      }

      {visibleAccounts.length > 0
        && <Pagination
          pages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />}
    </>
  )
}