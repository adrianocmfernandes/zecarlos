import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/upload";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.clientId || !data.visitDate || !Array.isArray(data.rooms) || data.rooms.length === 0) {
      return NextResponse.json({ erro: "Dados de medição inválidos." }, { status: 400 });
    }

    const photos = await Promise.all(
      (data.fotos || []).map(async (fileName: string) => {
        const result = await uploadImage(fileName);
        return result;
      })
    );

    const measurement = await prisma.measurement.create({
      data: {
        clientId: data.clientId,
        visitDate: new Date(data.visitDate),
        observacoes: data.observacoes || null,
        rooms: {
          create: data.rooms.map((room: Record<string, unknown>) => ({
            divisao: String(room.divisao),
            larguraCm: Number(room.larguraCm),
            alturaCm: Number(room.alturaCm),
            curtainTypeId: room.curtainTypeId ? String(room.curtainTypeId) : null,
            notasTecnicas: room.notasTecnicas ? String(room.notasTecnicas) : null
          }))
        },
        photos: {
          create: photos
        }
      },
      include: { rooms: true, photos: true }
    });

    return NextResponse.json(measurement, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Erro ao criar medição." }, { status: 500 });
  }
}
