

export const base64encode = (data) => 
{
    return window.btoa([...data].map(n => String.fromCharCode(n)).join(""));
}

export const  base64decode = (data) =>
{
    const arr = []
    for (const character of window.atob(data)) { arr.push(character.charCodeAt(0)) }
    return new Uint8Array(arr);
    // return new Uint8Array([...window.atob(data)].map(s => s.charCodeAt(0)));
}


// import { Buffer } from 'buffer'
/*
static _base64encode(data)
{
    return Buffer.from(data).toString('base64')
}

static _base64decode(data)
{
    return Buffer.from(data, 'base64').toString()
}
*/