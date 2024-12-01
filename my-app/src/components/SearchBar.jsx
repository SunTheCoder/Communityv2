import React from "react"
import { Field } from "./ui/field"
import { Input } from "@chakra-ui/react"


const SearchBar = () => {

    return (
        <Field
            // position="absolute" 
            // top={2} 
            // right={260}
            maxWidth="250px"
        >
            <Input
                variant='subtle'
                type="text"
                placeholder="Search for resource..."
            />

      </Field>
    )
}

export default SearchBar