import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; //10Mb

export async function POST(request: NextRequest) {
  let parser: PDFParse | undefined;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "PDF file is required." },
        { status: 400 }
      );
    }

    if (
      !file.name.toLowerCase().endsWith(".pdf") ||
      file.type !== "application/pdf"
    ) {
      return NextResponse.json(
        { message: "Only PDF files are supported." },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "File must be between 1 byte and 10 MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (buffer.subarray(0, 5).toString() !== "%PDF-") {
      return NextResponse.json(
        { message: "Invalid PDF file." },
        { status: 400 }
      );
    }

    parser = new PDFParse({ data: buffer });

    const result = await parser.getText();
    const text = result.text.trim();

    if (!text) {
      return NextResponse.json(
        { message: "No selectable text found. OCR may be required." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      message: "PDF text extracted successfully.",
      filename: file.name,
      text,
    });
  } catch (error) {
    console.error("PDF extraction failed:", error);

    return NextResponse.json(
      { message: "Failed to extract PDF text." },
      { status: 500 }
    );
  } finally {
    await parser?.destroy();
  }
}