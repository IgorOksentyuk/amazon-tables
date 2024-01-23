import React, { useRef } from 'react'
import { Form } from 'react-bootstrap'
import { RxCross1 } from 'react-icons/rx'

type Props = {
  query: string,
  setQuery: (query: string) => void,
}

export const AccountsForm: React.FC<Props> = ({ query, setQuery }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const clearFilter = () => {
    setQuery('')

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <Form className="flex gap-[20px] mb-[30px]">
      <Form.Group
        controlId="formSearch"
        className="relative w-1/3"
      >
        <Form.Control
          className="relative"
          type="text"
          placeholder="Search by email..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          ref={inputRef}
        />

        {query !== "" && (
          <button
            type="button"
            className="absolute right-0 top-0 w-[26px] h-[26px]
              flex justify-center items-center
              border rounded-[50%] mt-[5px] mr-[5px]"
            onClick={clearFilter}
          >
            <RxCross1 />
          </button>
        )}
      </Form.Group>
    </Form>
  )
}