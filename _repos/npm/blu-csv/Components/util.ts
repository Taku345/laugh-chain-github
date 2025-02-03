export const numToAlphabetColumn = (num : number) =>
{
    const RADIX = 26;
    const A = 'A'.charCodeAt(0);

    let n = num + 1 // 0 はじまりなので 1 始まりに
    let s = "";
    while (n >= 1)
    {
        n--
        s = String.fromCharCode(A + (n % RADIX)) + s;
        n = Math.floor(n / RADIX);
    }
    return s;
}