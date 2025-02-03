import { useState, useEffect, useRef } from 'react'
import Moveable from 'react-moveable'
import Element from './Element';
import { Rnd } from 'react-rnd';
import { usePaperContext } from '.';

const CANVAS_SCALE = 10
const Renderer = ({
    elements,
    setElements,
    focusElement,
}) =>
{
    const { paper, mm2px, px2mm } = usePaperContext()

    const canvasRef = useRef()

    /*
    const [targets, setTargets] = useState([])

    useEffect(() => {
        console.log('query')
        const targets = document.querySelectorAll('.draggable')
        targets.forEach((elm) =>
        {
            console.log(elm)
            console.log(typeof elm)
        })
        setTargets(targets)

        // バウンティングボックスが変わらないので、
        // setTargets(null)
        // setTimeout(() => setTargets(targets), 1)
    }, [elements]);
    */

    const updateElement = (indexes, keyVal) =>
    {
        setElements((prev) => {
            const newElements = prev.slice()
        })
    }

    useEffect(() =>
    {
		var small = 1;
		var medium = 2.5;
		var large = 5;
		var canvas = canvasRef.current;

        if (!canvas) return;

		var ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)

		ctx.strokeStyle = "#ccc"
		ctx.lineWidth = small
		/* 横線 */
		for(var i=1; i<=canvas.height/10; i++) // TODO: gridsize に
		{
			ctx.beginPath()
			if(i%10 === 0)
			{
				ctx.lineWidth = large;
			}
			else if(i%10 === 5)
			{
				ctx.lineWidth = medium;
			}
            else
            {
			    ctx.lineWidth = small;
            }
			ctx.moveTo(0,            10*i*CANVAS_SCALE);
			ctx.lineTo(canvas.width, 10*i*CANVAS_SCALE);
			ctx.closePath();
			ctx.stroke();
		}
		/* 縦線 */
		for(i=1; i<=canvas.width/10; i++)
        {
			ctx.beginPath();
			if(i%10 === 0)
            {
			    ctx.lineWidth = large
			}
            else if(i%10 === 5)
            {
			    ctx.lineWidth = medium;
			}
            else
            {
            }
			ctx.moveTo(10*i*CANVAS_SCALE, 0);
			ctx.lineTo(10*i*CANVAS_SCALE, canvas.height);
			ctx.closePath();
			ctx.stroke();
			if((i%10 === 0)||(i%10 === 5)){
			ctx.lineWidth = small;
			}
		}

    }, [paper])

    const targets = document.querySelectorAll('.draggable')

    return (<div className='Renderer'>

        <div
            className='paper'
             style={{
                width: mm2px(paper.width),
                height: mm2px(paper.height),
                position: 'relative',
            }}
        >

            {elements.map((element, index) => (
                <Element
                    index={index}
                    element={element}
                    setElement={(elm) => {
                        setElements((perv) => {
                            const newElements = elements.slice()
                            newElements[index] = elm
                            return newElements
                        })
                    }}
                    focusElement={focusElement}
                />
            ))}

            <canvas
                ref={canvasRef}
                width={paper.width * 10}
                height={paper.height * 10}
                style={{
                    width: mm2px(paper.width),
                    height: mm2px(paper.height),
                    position: 'absolute',
                }}
            />

        {/*
            <Moveable
                target={targets}
                resizable={true}
                onResize={({
                    target, width, height,
                    dist, delta, direction,
                    clientX, clientY,
                }: OnResize) => {
                    console.log(target.dataset.index)
                    console.log("onResize", target);
                    // delta[0] && (target!.style.width = `${width}px`);
                    // delta[1] && (target!.style.height = `${height}px`);
                    delta[0] && (target!.style.width = `${width}px`);
                    delta[1] && (target!.style.height = `${height}px`);

                    setElements((prev) =>
                    {
                        const newElements = prev.slice()
                        newElements[target.dataset.index].width = px2mm(width)
                        newElements[target.dataset.index].height = px2mm(height)
                        return newElements
                    })

                }}

                throttleDrag={0}
                draggable={true}
                onDrag={({
                    target,
                    beforeDelta, beforeDist,
                    left, top,
                    right, bottom,
                    delta, dist,
                    transform,
                    clientX, clientY,
                }: OnDrag) => {
                    console.log("onDrag left, top", left, top);
                    target!.style.left = `${left}px`;
                    target!.style.top = `${top}px`;
                    console.log("onDrag translate", dist);
                    console.log("onDrag transform", transform);
                    // target!.style.transform = transform;
                }}
                origin={false}
            />
            {elements.map((element, index) => (
                <Element
                    index={index}
                    element={element}
                />
            ))}

            */}

        </div>

        // canvas で wrap


    </div>)
    
}

export default Renderer