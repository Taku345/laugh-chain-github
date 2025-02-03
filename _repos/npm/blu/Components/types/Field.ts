

type FieldPropsCore = {
    config?: any,
    preference?: [],
    data?: any,
    fieldKey?: string,
}
type FieldEditPropsCore = {
    setData?: (d: any) => void,
    errors?: [],
}
type FieldInputPropsVore = {
    fieldConfig: any,
    fieldData: any|undefined,
}
type FieldInputEditPropsCore = {
    setFieldData: (value: any) => void,
    fieldErrors: [],
}


export type FieldProps = FieldPropsCore & {
    namePrefix?: string,
}

export type FieldFormProps = FieldPropsCore & FieldEditPropsCore & {
    fields?: any,
    namePrefix?: string,
}

export type FieldInputProps = FieldPropsCore & FieldInputPropsVore & {
    name?: string,
}

export type FieldInputFormProps = FieldInputProps &
    FieldEditPropsCore &
    FieldInputEditPropsCore