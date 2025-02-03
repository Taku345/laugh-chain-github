
export const undot = ($array) =>
{
    const $results = {};

    Object.keys($array).map(($key) => {
        set($results, $key, $array[$key]);
    })

    return $results;
}

export const set = ($array, $key, $value) =>
{
    if ($key == null || $key == undefined)
    {
        return $array = $value;
    }

    const $keys = $key.split('.')

    $keys.map(($key, $i) =>
    {
        if ($keys.filter((k)=>  k !== undefined).length === 1)
        {
            return
        }

        delete $keys[$i];

        // If the key doesn't exist at this depth, we will just create an empty array
        // to hold the next value, allowing us to create the arrays to hold final
        // values at the correct depth. Then we'll keep digging into the array.
        if ($key in $array || !Array.isArray($array[$key])) {
            $array[$key] = [];
        }

        $array = $array[$key];
    })

    $array[$keys.pop()] = $value;

    return $array;
}