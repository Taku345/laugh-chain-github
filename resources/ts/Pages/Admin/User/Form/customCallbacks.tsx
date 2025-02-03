import { FieldInputFormProps } from "blu/Components/types/Field"
import * as terminal_constants from "../../Terminal/constants"
import IndexChoiceForm from "@/Components/Reference/IndexChoiceForm"

declare var route

const customCallbacks = ({
    item=null,
    terminalReferenceConfigs,
    latlngInit={lat: 0, lng: 0}
}) => {

    return {
        'candidate': (props: FieldInputFormProps) => {
            const { config, data, setData } = props
            return <IndexChoiceForm
                modalTitle='拠点 - 参照'
                apiUrl={item ? route('api.master.customer_terminal', {item: item.id}) :route('customer.terminal_choice')}
                fieldKey={'terminal'}
                config={config}
                data={data}
                setData={setData}
                referenceConfigs={terminalReferenceConfigs}
                index_preference_key={terminal_constants.INDEX_PREFERENCE_KEY}
                search_preference_key={terminal_constants.SEARCH_PREFERENCE_KEY}
            />
        },
    }
}

export default customCallbacks