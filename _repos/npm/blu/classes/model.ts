
/*

TODO: editValue を formData に変更する関数かクラス

TODO: config から デフォルト値を抽出して、editValue に設定するクラス
*/

export const defaultDataFromConfig = (config) =>
{
    const defaultData = {}

    for (const key in config)
    {
        /*
        // hasOne のみ対応する。hasMany は bulk の中で生成してるので。
        if (config[key].type == 'hasOne')
        {
            defaultData[key] = defaultDataFromConfig(config[key]['hasOne']['config'])
            continue;
        }
        */

        if (! ('default' in config[key])) continue

        switch (config[key].type)
        {
        default:
            defaultData[key] =  config[key].default
            break
        }
    }

    // hasMany は再起的に呼び出す。(そもそも初期時には値がないのでセットのしようがない?)

    return defaultData
}


export const configToRaw = (config) =>
{
    const rawConfig = {}

    for (const key in config)
    {
        rawConfig[key] =  config[key]

        // hasMany は再起的に呼び出す。
        switch (config[key].type)
        {
        case 'hasMany':
            rawConfig[key].hasMany.config = configToRaw(rawConfig[key].hasMany.config)
            break
        default:
            if (rawConfig[key].type !== false && rawConfig[key].type != 'hidden')
            {
                rawConfig[key].type = 'raw'
            }
        }
    }

    return rawConfig
}