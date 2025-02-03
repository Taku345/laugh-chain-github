import React, { createContext, useState, useContext, ReactNode, useRef } from 'react'
import { Rnd } from 'react-rnd';
import { Z_INDEX_PANEL_WRAPPER } from './zIndex'
import { router } from '@inertiajs/react'

const PanelsContext = createContext({
	panels: {},
	openPanel: ({id, component}: { id: string | number, component: ReactNode, width?: number | null, height?: number | null,  x?: number | null, y?: number | null, right?: boolean, permanent?: boolean }) => {},
	closePanel: (id?: string | number ) => {},
});


const PanelsContextProvider: React.VFC<{children: ReactNode}> = ({ children }) =>
{
	const [ panels, setPanels ] = useState({});

	const cleanUp = () =>
	{
		const newPanels = {}
		Object.keys(panels).map((k) => {
			if (panels[k].permanent)
			{
				newPanels[k] = panels[k]
			}
		})
		setPanels(newPanels)
	}
	window.addEventListener('popstate', cleanUp)
	document.addEventListener('inertia:before', cleanUp)


	const openPanel = ({
		id,
		component,
		width = null,
		height = null,
		x = null,
		y = null,
		right = false,
		permanent = false,
	}) =>
	{
		const padding = 20;
		const shift = 20;
		const offsetTop = panelsRef.current && 'offsetTop' in panelsRef.current ? panelsRef.current['offsetTop'] : 0;
		const offsetWidth = panelsRef.current && 'offsetWidth' in panelsRef.current ? panelsRef.current['offsetWidth'] : 0;

		const posTop = panelsRef.current.getBoundingClientRect().top + window.pageYOffset;
		const top = window.pageYOffset > posTop ? window.pageYOffset - posTop : 0;

		// const top = Math.max((window.pageYOffset - offsetTop), 0);
		if (!x)
		{
			x = 0;
			x = x + padding;
		}
		if (!y)
		{
			y = top;
			y = y + padding;
		}
		width = width ? Math.min(width, offsetWidth - padding*2) : offsetWidth - padding*2
		const innerHeight = window.innerHeight // window.pageYOffset > posTop ? window.innerHeight: window.innerHeight - posTop; fixed にしたので
		height = height ? Math.min(height, innerHeight - padding*2) : innerHeight - padding*2

		if (right)
		{
			x = offsetWidth - ( width + x );
		}


		// 全く同じ位置に来てしまったらずらす
		Object.keys(panels).map((key_id) =>
		{
			if (panels[key_id].x == x && panels[key_id].y && key_id != id)
			{
				x += shift;
				y += shift;
				// width -= shift;
				// height -= shift;
			}
		});

		if (!id) id = Object.keys(panels).length;
		const state = {}; // TODO:
		setPanels((prevPanels) =>
		{
			const newPanels = {...prevPanels};
			newPanels[id] =
			{
				component: component,
				x: 'x' in state ? state.x : x,
				y: 'y' in state ? state.y : y,
				width : 'width'  in state ? state.width  : width,
				height: 'height' in state ? state.height : height,
				zIndex: 'zIndex' in state ? state.zIndex : Object.keys(prevPanels).length + 1,
				permanent: permanent,
			};

			return setZIndexes(id, newPanels);
		});
		return id;
	}

	const closePanel = (id) =>
	{
		if (!id)
		{
			cleanUp()
		}
		else
		{
			setPanels((prevPanels) =>
			{
				const newPanels = { ...prevPanels };
				delete newPanels[id];
				return newPanels;
			});
		}
	}

	const getPanel = (id) =>
	{
		return id in panels ? panels[id] : false;
	}


	const onDragStop = (e, d, id) =>
	{
		setPanels((prevPanels) =>
		{
			const newPanels = {...prevPanels};
			newPanels[id].x = d.x;
			newPanels[id].y = d.y;
			return setZIndexes(id, newPanels);
		});
	}

	const onResizeStop = (e, ref, position, id) =>
	{
		setPanels((prevPanels) =>
		{
			const newPanels = {...prevPanels};
			newPanels[id].x = position.x;
			newPanels[id].y = position.y;
			newPanels[id].width = ref.style.width;
			newPanels[id].height = ref.style.height;
			return setZIndexes(id, newPanels);
		});
	}

	const onClick = (id) =>
	{
		setPanels((prevPanels) =>
		{
			const newPanels = {...prevPanels};
			return setZIndexes(id, newPanels);
		});
	}

	const setZIndexes = (id, newPanels) =>
	{
		const maxZIndex = Object.keys(newPanels).length;
		let currentZIndex = newPanels[id] && newPanels[id].zIndex ? newPanels[id].zIndex: 0;
		let currentMaxZIndex = 0;

		Object.keys(newPanels).map((key_id) =>
		{
			currentMaxZIndex = Math.max(currentMaxZIndex, newPanels[key_id].zIndex);
		});

		if (currentMaxZIndex >= currentZIndex)
		{
			Object.keys(newPanels).map((key_id, idx) =>
			{
				if (newPanels[key_id].zIndex > currentZIndex)
				{
					newPanels[key_id].zIndex = Math.min(maxZIndex - 1, Math.max(newPanels[key_id].zIndex-1, 0));
				}
			});

			if (newPanels[id]) newPanels[id].zIndex = maxZIndex;
		}

		return newPanels;
	}

	const panelsRef = useRef<HTMLDivElement>(null);


	return (
		<PanelsContext.Provider
			value={{
				panels,
				openPanel,
				closePanel,
			}}
		>
			{ children }

			<div
				className="Panel"
				ref={panelsRef}
				style={{ zIndex: Z_INDEX_PANEL_WRAPPER, position: 'fixed' }}
			>
			{Object.keys(panels).map((id) => (
				<Rnd
					className="panel"
					default={{
						x     : panels[id].x,
						y     : panels[id].y,
						width : panels[id].width,
						height: panels[id].height,
					}}
					size={{
						width: panels[id].width,
						height: panels[id].height,
					}}
					position={{
						x: panels[id].x,
						y: panels[id].y,
					}}
					onDragStop={(e, d) => onDragStop(e, d, id)}
					onResizeStop={(e, direction, ref, delta, position) => onResizeStop(e, ref, position, id)}
					dragHandleClassName='panel-drag'
					onClick={() => onClick(id)}
					onDragStart={() => onClick(id)}
					style={{
						zIndex: panels[id].zIndex,
					}}
				>
				<div className="panel-content">
					{panels[id].component}
				</div>
			</Rnd>
			))}
			</div>

		</PanelsContext.Provider>
	);
};

const usePanelsContext = () => useContext(PanelsContext);


export {
	PanelsContextProvider,
	usePanelsContext,
}
