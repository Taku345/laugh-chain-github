import React from 'react'

const Button = (props) =>
{
    return <button props={{
        ...{onClick: (...args) => {
            args[0].preventDefault()
            return props.onClick(args)
        }},
        ...props
    }}/>

}

export default Button;