import React, { useState, createContext, useContext, useRef, useEffect } from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const DropDownContext = createContext({
})

export const DropdownProvider: React.FC = ({ children }) =>
{
    const [open, setOpen] = useState(null);
    const [align, setAlign] = useState('');

    const toggleOpen = (openFor, ) =>
    {
        setOpen((previousState) => previousState == openFor ? null: openFor);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen, align, setAlign }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
}

export const Dropdown: React.FC = ({
    id='',
    label,
    children,
}) =>
{
    const { open, setOpen, toggleOpen, align, setAlign } = useContext(DropDownContext);

    const dropdownRef = useRef()
    const triggerRef = useRef()
    const contentRef = useRef()

    useEffect(() =>
    {
        if (open != (id ?? label) ) return

        const dropdownRect = triggerRef?.current?.getBoundingClientRect()
        const clientRect = contentRef?.current?.getBoundingClientRect()
        if (window.outerWidth && dropdownRect && clientRect)
        {
            if (window.outerWidth  - (clientRect.width + dropdownRect.left) < 0)
            {
                setAlign('right')
            }
            else
            {
                setAlign('left')
            }
        }
    }, [open])

    return (
        <div className='Dropdown' ref={dropdownRef} style={{ position: 'relative' }}>

           {children && (<>
                <div
                    className='label'
                    ref={triggerRef}
                    style={open ? { position: 'relative', zIndex: 99 } : {}}
                    onClick={() => toggleOpen(id ?? label)}
                >
                    <span>{label}<ArrowDropDownIcon /></span>
                </div>

                {(open == (id ?? label)) && (<>
                    <div
                        className="cover"
                        style={{ position: 'fixed', zIndex: 98, top: 0, left: 0, width: '100vw', height: '100vh'}}
                        onClick={() => setOpen(null)}>
                    </div>

                    <div
                        className={`content`}
                        style={{
                            position: 'absolute',
                            zIndex: 100,
                            left:  align == 'left'  ? 0 :'initial',
                            right: align == 'right' ? 0 :'initial',
                        }}
                        onClick={() => setOpen(null)}
                        ref={contentRef}
                    >
                        <div className={`children`}>
                            {children}
                        </div>
                    </div>
                </>)}


           </>) || (<>
                <div
                    className='label'
                    ref={triggerRef}
                    style={open ? { position: 'relative', zIndex: 99 } : {}}
                >{label}</div>
           </>)}

        </div>
    );

}



export const DropdownSide: React.FC = ({
    id='',
    label,
    children,
    width = 200,
}) =>
{
    const { open, setOpen, toggleOpen, align, setAlign } = useContext(DropDownContext);

    const [ bounds, setBounds ] = useState({
        top: 0,
        bottom: 0,
    })

    const dropdownRef = useRef()
    const triggerRef = useRef()
    const contentRef = useRef()

    const dropdownOpen = () =>
    {
        const dropdownRect = triggerRef?.current?.getBoundingClientRect()
        setBounds({
            top: window.scrollX + dropdownRect.top,
            bottom: window.scrollX + window.innerHeight - dropdownRect.bottom
        })

        toggleOpen(id ?? label)
    }

    useEffect(() =>
    {
        const dropdownRect = triggerRef?.current?.getBoundingClientRect()
        setBounds({
            top: window.scrollX + dropdownRect.top,
            bottom: window.scrollX + window.innerHeight - dropdownRect.bottom
        })

        if (open != (id ?? label) ) return
    }, [])

    useEffect(() =>
    {
        if (open != (id ?? label) ) return

        const dropdownRect = triggerRef?.current?.getBoundingClientRect()
        const clientRect = contentRef?.current?.getBoundingClientRect()
        if (window.outerHeight && dropdownRect && clientRect)
        {
            if ((window.innerHeight - (clientRect.height + dropdownRect.top)) >= 0)
            {
                setAlign('top')
            }
            else
            {
                setAlign('bottom')
            }
        }
    }, [open])


    return (
        <div className='Dropdown' ref={dropdownRef} style={{ position: 'relative' }}>

           {children && (<>
                <div
                    className='label'
                    ref={triggerRef}
                    style={open ? { position: 'relative', zIndex: 99 } : {}}
                    onClick={dropdownOpen}
                >
                    <span>{label}<ArrowRightIcon /></span>
                </div>

                {(open == (id ?? label)) && (<>
                    <div
                        className="cover"
                        style={{ position: 'fixed', zIndex: 98, top: 0, left: 0, width: '100vw', height: '100vh'}}
                        onClick={() => setOpen(null)}>
                    </div>

                    <div
                        className={`content`}
                        style={{
                            position: 'fixed',
                            left: width + 'px',
                            width: width + 'px',
                            zIndex: 100,
                            top:  align != 'bottom'  ? bounds.top :'initial',
                            bottom: align == 'bottom' ? bounds.bottom :'initial',
                        }}
                        onClick={() => setOpen(null)}
                        ref={contentRef}
                    >
                        <div className={`children`}>
                            {children}
                        </div>
                    </div>
                </>)}


           </>) || (<>
                <div
                    className='label'
                    ref={triggerRef}
                    style={open ? { position: 'relative', zIndex: 99 } : {}}
                >{label}</div>
           </>)}

        </div>
    );

}


