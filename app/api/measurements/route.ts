import { NextResponse } from "next/server";
import { createId, fakeDb } from "@/lib/mockData";
import { uploadImage } from "@/lib/upload";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.clientId || !data.visitDate || !Array.isArray(data.rooms) || data.rooms.length === 0) {
      return NextResponse.json({ erro: "Dados de medição inválidos." }, { status: 400 });
    }

    const photos = await Promise.all((data.fotos || []).map((fileName: string) => uploadImage(fileName)));

    const measurement = {
      id: createId("measurement"),
      clientId: String(data.clientId),
      visitDate: new Date(data.visitDate).toISOString(),
      observacoes: data.observacoes ? String(data.observacoes) : undefined,
      rooms: data.rooms.map((room: Record<string, unknown>) => ({
        divisao: String(room.divisao),
        larguraCm: Number(room.larguraCm),
        alturaCm: Number(room.alturaCm),
        notasTecnicas: room.notasTecnicas ? String(room.notasTecnicas) : undefined
      })),
      fotos: photos.map((item) => item.fileUrl)
    };

    fakeDb.measurements.unshift(measurement);
    return NextResponse.json(measurement, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro ao criar medição." }, { status: 500 });
  }
}
