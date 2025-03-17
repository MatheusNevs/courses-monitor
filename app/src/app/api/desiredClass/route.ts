import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";

export async function POST(request: NextRequest) {
  console.log("entrou no post ");
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    console.log("unauthorized");
    return NextResponse.json({ message: "UNAUTHORIZED" });
  }

  const desiredClassJSON = z.object({
    department: z.string(),
    subject: z.string(),
    class: z.string(),
  });

  const body: z.infer<typeof desiredClassJSON> =
    (await request.json()) as z.infer<typeof desiredClassJSON>;
  console.log(body);
  const parsedResult = desiredClassJSON.safeParse(body);

  if (parsedResult.error) {
    console.log("invalid body");
    return NextResponse.json({ message: "INVALID BODY" });
  }

  const { data } = parsedResult;

  const existingSubject = await db.desiredSubject.findFirst({
    where: {
      AND: [
        {
          department: {
            userId: userId,
          },
        },
        {
          name: data.subject,
        },
      ],
    },
  });

  if (existingSubject) {
    await db.desiredClass.create({
      data: {
        number: data.class,
        subjectId: existingSubject.id,
      },
    });
    return NextResponse.json({ message: "SUCESS" });
  }

  const existingDepartment = await db.desiredDeparment.findFirst({
    where: {
      AND: [
        {
          userId: userId,
        },
        {
          name: data.department,
        },
      ],
    },
  });

  if (existingDepartment) {
    const createdSubject = await db.desiredSubject.create({
      data: {
        name: data.subject,
        departmentId: existingDepartment.id,
      },
    });

    await db.desiredClass.create({
      data: {
        number: data.class,
        subjectId: createdSubject.id,
      },
    });

    return NextResponse.json({ message: "SUCESS" });
  }

  const createdDepartment = await db.desiredDeparment.create({
    data: {
      name: data.department,
      userId: userId,
    },
  });

  const createdSubject = await db.desiredSubject.create({
    data: {
      name: data.subject,
      departmentId: createdDepartment.id,
    },
  });

  await db.desiredClass.create({
    data: {
      number: data.class,
      subjectId: createdSubject.id,
    },
  });

  return NextResponse.json({ message: "SUCESS" });
}
