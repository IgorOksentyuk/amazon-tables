import React, { useRef, useState } from 'react'
import { Form } from 'react-bootstrap'
import { RxCross1 } from 'react-icons/rx'
import debounce from 'lodash.debounce'

type Props = {
  setSearchQuery: (searchQuery: string) => void,
}

export const AccountsForm: React.FC<Props> = ({ setSearchQuery }) => {
  const [query, setQuery] = useState('')

  const inputRef = useRef<HTMLInputElement | null>(null)

  const clearFilter = () => {
    setQuery('')
    debouncedChange('')

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    debouncedChange(value)
    setQuery(value)
  }

  const debouncedChange = debounce((value: string) => setSearchQuery(value), 300)

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
          onChange={handleInputChange}
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