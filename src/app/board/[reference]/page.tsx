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
}

export default function DrawPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const socketRef = useRef<Socket | null>(null);

    const [drawing, setDrawing] = useState(false);
    const lastPos = useRef<Point | null>(null);

    // connect socket only on client
    useEffect(() => {
        const socket = io("https://back.drmonk.ir");
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
    const drawLine = ({ from, to }: DrawLine) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
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
        <div style={{ textAlign: "center", padding: 20 }}>
            <h1>Realtime Collaborative Drawing 🎨</h1>

            <canvas
                ref={canvasRef}
                width={800}
                height={500}
                style={{ border: "1px solid #ccc", cursor: "crosshair" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />
        </div>
    );
}
