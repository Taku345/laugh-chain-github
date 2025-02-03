import { FieldInputFormProps } from "blu/Components/types/Field"
import * as user_constants from "../../User/constants"
import IndexChoiceForm from "@/Components/Reference/IndexChoiceForm"

declare var route

const customCallbacks = ({
    item=null,
    userReferenceConfigs,
}) => {

    return {
        'candidate': (props: FieldInputFormProps) => {
            const { config, data, setData } = props
            return <IndexChoiceForm
                modalTitle='Candidate - 参照'
                apiUrl={route('admin.api.election.candidates')}
                fieldKey={'candidate'}
                config={config}
                data={data}
                setData={setData}
                referenceConfigs={userReferenceConfigs}
                index_preference_key={user_constants.INDEX_PREFERENCE_KEY}
                search_preference_key={user_constants.SEARCH_PREFERENCE_KEY}
            />
        },
    }
}

export default customCallbacks