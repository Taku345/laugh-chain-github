import { FieldInputFormProps } from "blu/Components/types/Field"
import * as user_constants from "../../User/constants"
import IndexChoiceForm from "@/Components/Reference/IndexChoiceForm"
import Input from "blu/Components/Form/Field/Input"
import axios from 'axios'
import { useState } from "react"
import { toast } from "react-toastify"

declare var route

const customCallbacks = ({
    data,
}) => {

    const [ themes, setThemes ] = useState<string[]>([])
    const [ themeThinking, setThemeThinking ] = useState(false)


    const [ openingLines, setOpeningLines ] = useState<string[]>([])
    const [ openingLineThinking, setOpeningLineThinking ] = useState(false)

    const generate_theme = () =>
    {
        setThemeThinking(true)
        
        axios.get(route('admin.api.ai.generate_themes'))
            .then((res) =>
            {
                console.log('res', res)
                if (res.data && Array.isArray(res.data.themes))
                {
                    setThemes(res.data.themes)
                }
                else
                {
                    toast.error('AI のテーマの取得に失敗しました。もう一度考えさせてください。')
                    
                }
            })
            .finally(() =>
            {
                setThemeThinking(false)
            })
    }

    const generate_opening_line = () =>
    {
        setOpeningLineThinking(true)

        axios.get(route('admin.api.ai.generate_opening_lines', {theme: data.name}))
            .then((res) =>
            {
                console.log('res', res)
                if (res.data && Array.isArray(res.data.opening_lines))
                {
                    setOpeningLines(res.data.opening_lines)
                }
                else
                {
                    toast.error('一行目の取得に失敗しました。もう一度考えさせてください。')
                    
                }
            })
            .finally(() =>
            {
                setOpeningLineThinking(false)
            })
    }

    return {
        'name': (props: FieldInputFormProps) => {
            const { config, data, setData } = props
            return <div>
                <Input
                    {...props}
                />
                <button onClick={generate_theme} disabled={themeThinking}>AIにテーマを考えさせる</button>
                {themeThinking && (<>考え中...</>) || (
                <ul>
                    {themes.map((theme) => (<li>
                        <button onClick={() => {
                            const newData = {...data}
                            newData.name = theme
                            setData(newData)
                        }}>{theme}</button>
                    </li>))}
                    </ul>
                )}
            </div>
        },

        'opening_line': (props: FieldInputFormProps) => {
            const { config, data, setData } = props
            return <div>
                <Input
                    {...props}
                />
                {(data.name && data.name.length) > 0 && (<>
                    <button onClick={generate_opening_line} disabled={openingLineThinking}>AIに一行目を考えさせる</button>
                    {openingLineThinking && (<>考え中...</>) || (
                    <ul>
                        {openingLines.map((openingLine) => (<li>
                            <button onClick={() => {
                                const newData = {...data}
                                newData.opening_line = openingLine
                                setData(newData)
                            }}>{openingLine}</button>
                        </li>))}
                        </ul>
                    )}
                </>)}
            </div>
        },
    }
}

export default customCallbacks