const is_json = (data) =>
{
    try {
        JSON.parse(data);
    } catch (error) {
        return false;
    }
    return true;
}

const isString = (value) =>
{
    if (typeof value === "string" || value instanceof String)
    {
        return true;
    }
    else
    {
        return false;
    }
}

const isObject = (value) =>
{
    return value !== null && typeof value === 'object'
}

const isNumberString = (n) =>
{
  return typeof n === "string" && n !== "" &&  !isNaN( n );
}

const toArr = (value) =>
{
    if (Array.isArray(value))
    {
        return value
    }
    else if (isString(value) || isNumberString(value))
    {
        return [ value ]
    }
    else if (isObject(value))
    {
        return value.values()
    }

    return [ value ]
}

const objectOnly = (obj, keys) =>
{
    const results = {};
    keys = toArr(keys)
    Object.keys(obj).map((key) => {
        if (keys.includes(key)) results[key] = obj[key]
    })

    return results
}

const urlHasPlaceholder = (url) =>
{
    const urlObj = new URL(url)
    return urlObj.pathname.indexOf('*') > -1
}

const dotNameToFieldName = (dotName) =>
{
    const names = dotName.split('.')

    let name = ''
    for (let i = 0; i < names.length; i++)
    {
        name += i == 0 ? names[i] : '[' + names[i] + ']'
    }

    return name
}

const stringBytes = function (str)
{
    var length = 0;
    for (var i = 0; i < str.length; i++)
    {
        var c = str.charCodeAt(i);
        if (
            (c >= 0x0 && c < 0x81) ||
            (c === 0xf8f0) ||
            (c >= 0xff61 && c < 0xffa0) ||
            (c >= 0xf8f1 && c < 0xf8f4)
        )
        {
            length += 1;
        }
        else
        {
            length += 2;
        }
    }

    return length;
};


const ArrGet = (array, key, defaultVal = null) =>
{
    if ( ! _isArray(array))
    {
        throw new TypeError('First parameter must be an array or ArrayAccess object.');
    }

    if (typeof key === 'undefined' || key === null)
    {
        return array;
    }

    if (_isArray(key)) {
        var ret = {};
        for (var i = 0, len = key.length; i < len; i++) {
            ret[key[i]] = ArrGet(array, key[i], defaultVal);
        }
        return ret;
    }

    if (array.hasOwnProperty(key)) {
        return array[key];
    }

    for (let i = 0, keys = (key).toString().split('.'), len = keys.length; i < len; i++)
    {
        if ((_isArray(array) && typeof array[keys[i]] !== 'undefined') === false)
        {
            if ( ! _isArray(array) || ! array.hasOwnProperty(keys[i]))
            {


                return _value(defaultVal || null);
            }
        }

        array = array[keys[i]];
    }

    return array;
}


const _value = (value) =>
{
    return typeof value === 'function' ? value() : value;
}
const _isArray = (value) =>
{
    return (Array.isArray ?
        Array.isArray(value)
        : Object.prototype.toString.call(value) === '[object Array]') ||
            Object.prototype.toString.call(value) === '[object Object]';
}


export
{
    is_json,
    isString,
    isObject,
    isNumberString,
    toArr,
    objectOnly,
    urlHasPlaceholder,
    dotNameToFieldName,
    stringBytes,
    ArrGet,
}