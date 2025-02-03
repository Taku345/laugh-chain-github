import {useEffect, useState} from 'react';

const useMouseCoordinate = () =>
{
    const [coords, setCoords] = useState({x: 0, y: 0});

    useEffect(() => {
        const handleWindowMouseMove = (event) =>
        {
            setCoords({
                x: event.pageX,
                y: event.pageY,
            });
        };
        window.addEventListener('mousemove', handleWindowMouseMove);

        return () =>
        {
            window.removeEventListener(
                'mousemove',
                handleWindowMouseMove,
            );
        };
    }, [])

    return coords
}

export default useMouseCoordinate