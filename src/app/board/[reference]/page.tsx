    "use client";

    import React, { useEffect, useRef, useState } from "react";
    import { io, Socket } from "socket.io-client";
    import {Rnd} from "react-rnd";
    import CodeMirror from "@uiw/react-codemirror";
    import { javascript } from "@codemirror/lang-javascript";

    import { TbRectangle } from "react-icons/tb";
    import { FaRegCircle } from "react-icons/fa";
    import { FaCode } from "react-icons/fa6";

    interface Point {
        x: number;
        y: number;
    }

    interface DrawLine {
        from: Point;
        to: Point;
        color: string;
        size: number
    }

    interface CodeBlock {
        id: number;
        code: string;
    }

    interface Circle {
        id: number;
        x: number;
        y: number;
        width: number;
        height: number;
        color: string;
    }

    interface Shape {
        id: number;
        x: number;
        y: number;
        width: number;
        height: number;
        color: string;
        type: "circle" | "rect";
    }

    export default function DrawPage() {

        const [shapes, setShapes] = useState<Shape[]>([]);
        const [circles, setCircles] = useState<Circle[]>([])

        function randomColor() {
            return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        }

        const addRect = () => {
            setShapes((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    x: 150,
                    y: 150,
                    width: 200,
                    height: 120,
                    color: randomColor(),
                    type: "rect",
                },
            ]);
        };

        const updateShape = (id: number, x: number, y: number, width: number, height: number) => {
            setShapes((prev) =>
                prev.map((s) =>
                    s.id === id ? { ...s, x, y, width, height } : s
                )
            );
        };

        const addCircle = () => {
            const radius = 100;
            const colorRandom = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            setCircles((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    x: 100,
                    y: 100,
                    width: radius,
                    height: radius,
                    color: colorRandom,
                },
            ]);
        };

        const updateCircle = (id: number, x: number, y: number, width: number, height: number) => {
            setCircles((prev) =>
                prev.map((c) =>
                    c.id === id ? { ...c, x, y, width, height } : c
                )
            );
        };


        const [blocks, setBlocks] = useState<CodeBlock[]>([]);

        const addBlock = () => {
            setBlocks((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    code: ``,
                },
            ]);
        };

        const updateCode = (id: number, newCode: string) => {
            setBlocks((prev) =>
                prev.map((block) => (block.id === id ? { ...block, code: newCode } : block))
            );
        };

        const [color, setColor] = useState('#6DD9B5');
        const [size, setSize] = useState(10);
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const socketRef = useRef<Socket | null>(null);

        const [drawing, setDrawing] = useState(false);
        const lastPos = useRef<Point | null>(null);

        useEffect(() => {
            const socket = io(process.env.NEXT_PUBLIC_BASE_URL);
            socketRef.current = socket;

            const handleDrawLine = (data: DrawLine) => {
                drawLine(data);
            };

            socket.on("draw-line", handleDrawLine);

            return () => {
                socket.off("draw-line", handleDrawLine);
                socket.disconnect();
            };
        }, []);

        // Draw line on canvas
        const drawLine = ({ from, to, color, size }: DrawLine) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";

            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        };

        // Get mouse position
        const getPos = (e: React.MouseEvent): Point => {
            const rect = canvasRef.current!.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleMouseDown = (e: React.MouseEvent) => {
            setDrawing(true);
            lastPos.current = getPos(e);
        };

        const handleMouseMove = (e: React.MouseEvent) => {
            if (!drawing) return;

            const newPos = getPos(e);

            const line: DrawLine = {
                from: lastPos.current!,
                to: newPos,
                color: color,
                size: size
            };

            drawLine(line); // draw locally
            socketRef.current?.emit("draw-line", line); // send to server

            lastPos.current = newPos;
        };

        const handleMouseUp = () => {
            setDrawing(false);
            lastPos.current = null;
        };

        return (
            <div style={{ textAlign: "center" }}>
                <div className="z-50 absolute bg-stone-200 grid grid-cols-2">
                    <div>
                        <input type='color' defaultValue='#6DD9B5' onChange={(e: any) => setColor(e.target.value)}/>
                    </div>
                    <div>
                        <input className='w-16' min='1' max='250' defaultValue='10' type='number' onChange={(e: any) => setSize(e.target.value)}/>
                    </div>
                    <div
                        onClick={addBlock}
                        style={{ margin: 10, padding: "8px 16px", fontSize: 16 }}
                    >
                        <FaCode />
                    </div>
                    <div onClick={addRect} style={{ margin: 10, padding: "8px 16px" }}>
                        <TbRectangle />
                    </div>
                    <div onClick={addCircle} style={{ margin: 10, padding: "8px 16px" }}>
                        <FaRegCircle />
                    </div>
                </div>
                <canvas
                    ref={canvasRef}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    style={{ cursor: "crosshair" }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                />
                {blocks.map((block) => (
                    <Rnd
                        key={block.id}
                        default={{
                            x: 50,
                            y: 50,
                            width: 400,
                            height: 200,
                        }}
                        minWidth={200}
                        minHeight={100}
                        bounds="window"
                    >
                        <CodeMirror
                            value={block.code}
                            className='text-left'
                            height="100%"
                            width="100%"
                            extensions={[javascript()]}
                            onChange={(value) => updateCode(block.id, value)}
                            theme="dark"
                        />
                    </Rnd>
                ))}

                {shapes.map((shape) => (
                    <Rnd
                        key={shape.id}
                        size={{ width: shape.width, height: shape.height }}
                        position={{ x: shape.x, y: shape.y }}
                        onDragStop={(e, d) =>
                            updateShape(shape.id, d.x, d.y, shape.width, shape.height)
                        }
                        onResizeStop={(e, direction, ref, delta, position) =>
                            updateShape(
                                shape.id,
                                position.x,
                                position.y,
                                ref.offsetWidth,
                                ref.offsetHeight
                            )
                        }
                        bounds="window"
                        lockAspectRatio={shape.type === "circle"}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: shape.color,
                                borderRadius: shape.type === "circle" ? "50%" : "0%",
                            }}
                        />
                    </Rnd>
                ))}

                {circles.map((circle) => (
                    <Rnd
                        key={circle.id}
                        size={{ width: circle.width, height: circle.height }}
                        position={{ x: circle.x, y: circle.y }}
                        onDragStop={(e, d) => updateCircle(circle.id, d.x, d.y, circle.width, circle.height)}
                        onResizeStop={(e, direction, ref, delta, position) =>
                            updateCircle(circle.id, position.x, position.y, ref.offsetWidth, ref.offsetHeight)
                        }
                        bounds="window"
                        lockAspectRatio={false}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                backgroundColor: circle.color,
                            }}
                        />
                    </Rnd>
                ))}
            </div>
        );
    }
