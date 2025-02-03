declare var route

export const menus = {
    'Elections': route('admin.election.index'),
    'Create New Election': route('admin.election.create'),
}

/*
export const contextMenus = {
    'collect': {
        '回収一覧': route('admin.collect.index'),
        '回収新規作成': route('admin.collect.create'),
    },
    'terminal': {
        '拠点一覧': route('admin.terminal.index'),
        '拠点新規作成': route('admin.terminal.create'),
    },
    'product': {
        '回収品目一覧': route('admin.product.index'),
        '回収品目新規作成': route('admin.product.create'),
    },
    'product-valuable': {
        '回収品目一覧': route('admin.product-valuable.index'),
        '回収品目新規作成': route('admin.product-valuable.create'),
    },
}
*/