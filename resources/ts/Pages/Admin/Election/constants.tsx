export const TITLE = 'Election'
export const ROUTE_PREFIX = 'admin.election'
export const API_ROUTE_PREFIX = 'admin.api.election'
export const SOFT_DELETE = false

export const INDEX_PREFERENCE_KEY = `blu.${ROUTE_PREFIX}.index`
export const SEARCH_PREFERENCE_KEY = `blu.${ROUTE_PREFIX}.search`
export const FORM_PREFERENCE_KEY = `blu.${ROUTE_PREFIX}.form`

export const API_ROUTE    = `${API_ROUTE_PREFIX}.index`
export const STORE_ROUTE   = `${ROUTE_PREFIX}.store`
export const UPDATE_ROUTE   = `${ROUTE_PREFIX}.update`
export const SHOW_ROUTE   = `${ROUTE_PREFIX}.show`
export const EDIT_ROUTE   = `${ROUTE_PREFIX}.edit`
export const DELETE_ROUTE = SOFT_DELETE ? `${ROUTE_PREFIX}.dispose`: `${ROUTE_PREFIX}.destroy`
export const TRASH_ROUTE    = `${API_ROUTE_PREFIX}.trash`
export const RESTORE_ROUTE   = `${ROUTE_PREFIX}.restore`
export const ELIMINATE_ROUTE =  `${ROUTE_PREFIX}.eliminate`

export const DELETE_MESSAGE = SOFT_DELETE ? 'をゴミ箱に移動しますか？': 'を削除してもよろしいですか？\n(※この操作は取り消せません)'
export const ELIMINATE_MESSAGE = 'を完全に削除してもよろしいですか？\n(※この操作は取り消せません)'

export const CLASS_NAME = `${ROUTE_PREFIX.replace('.', '-')}`

export const TITLE_INDEX = `一覧`
export const TITLE_TRASH = `ゴミ箱`
export const TITLE_SHOW = `表示`
export const TITLE_CREATE = `新規作成`
export const TITLE_EDIT = `編集`

export const CONTROL_NAME = `操作`
export const CONTROL_SHOW_LABEL = `表示`
export const CONTROL_EDIT_LABEL = `編集`
export const CONTROL_DELETE_LABEL = `削除`
export const CONTROL_RESTORE_LABEL = `復活`
export const CONTROL_ELIMINATE_LABEL = `完全削除`

export const LABEL_STORE = `保存`
export const LABEL_UPDATE = `更新`