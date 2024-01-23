import { useState } from 'react'
import { Table } from 'react-bootstrap'
import { FaSort } from "react-icons/fa"
import { FaSortDown } from "react-icons/fa"
import { FaSortUp } from "react-icons/fa"

import { accountsData } from '../../data/accountsData'
import { accountTitles } from '../../constants/tableTitles'
import { Account } from '../../interfaces/accountInterface'
import { AccountsForm } from './AccountsForm'

const getVisibleAccounts = (
  accounts: Account[],
  query: string,
  sortType: string,
  isReversed: boolean,
) => {
  let visibleAccounts = [...accounts]

  if (query) {
    const normalizedQuery = query.toLowerCase().trim()

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

  return visibleAccounts;
}

export const AccountsTable = () => {
  const [query, setQuery] = useState('')
  const [sortType, setSortType] = useState('')
  const [isReversed, setIsReversed] = useState(false)

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
    query,
    sortType,
    isReversed,
  )

  return (
    <>
      <AccountsForm query={query} setQuery={setQuery} />

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
              </tr>
            ))}
          </tbody>
        </Table>
        : <p className="text-center">There are no accounts!</p>
      }
    </>
  )
}