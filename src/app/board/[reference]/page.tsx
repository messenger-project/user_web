    "use client";

    import React, { useEffect, useRef, useState } from "react";
    import { io, Socket } from "socket.io-client";

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

    export default function DrawPage() {

        const [color, setColor] = useState('black');
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
                <div className="z-50 flex absolute bg-stone-200">
                    <input type='color' onChange={(e: any) => setColor(e.target.value)}/>
                    <input className='w-16' min='1' max='250' type='number' onChange={(e: any) => setSize(e.target.value)}/>
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
            </div>
        );
    }
