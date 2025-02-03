import React, { useLayoutEffect, useState } from 'react';
import { Rnd } from "react-rnd"
import FieldWrap from "./EditElement/FieldWrap"

const useWindowSize = (): number[] => {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      const updateSize = (): void => {
        setSize([window.innerWidth, window.innerHeight]);
      };
  
      window.addEventListener('resize', updateSize);
      updateSize();
  
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  };

const Panel = ({
    title,
    className,
    focusPanel,
    setFocusPanel,
    children,

    width=300,
}) =>
{
    return (<div style={{
        position: 'absolute',
        right: width,
        top: 0
    }}>

        <Rnd
            className={`${className} Panel`}
            onClick={() => setFocusPanel(className)}
            style={{
                zIndex: focusPanel == className ? 10: 0,
            }}
            default={{
                width: width,
                x: 0,
                y: 100,
            }}
        >
        <header>
            <h1>{title}</h1>
            <nav>
                <button>min</button>
            </nav>
        </header>
        <div className='content'>
            {children}
        </div>
    
        </Rnd>
    </div>
    )

}

export default Panel