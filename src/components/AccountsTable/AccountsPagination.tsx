import React from 'react'
import { Button } from 'react-bootstrap'

type Props = {
  pages: number,
  currentPage: number,
  handlePageChange: (newpage: number) => void,
}

export const AccountsPagination: React.FC<Props> = ({
  pages,
  currentPage,
  handlePageChange,
}) => {
  return (
    pages > 1 && (
      <div className="flex items-center justify-center gap-[10px]">
        {Array.from({ length: pages }).map((_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? 'dark' : 'outline-dark'}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    )
  )
}