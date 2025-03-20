/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

type UserWithClass = {
  email: string;
  departments: {
    name: string;
    subjects: {
      name: string;
      classes: {
        number: string;
      }[];
    }[];
  }[];
};

export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  }

  const desiredClassJSON = z.object({
    department: z.string(),
    subject: z.string(),
    class: z.string(),
  });

  const body: z.infer<typeof desiredClassJSON> =
    (await request.json()) as z.infer<typeof desiredClassJSON>;
  const parsedResult = desiredClassJSON.safeParse(body);

  if (parsedResult.error) {
    return NextResponse.json({ message: "INVALID BODY" }, { status: 400 });
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
    return NextResponse.json({}, { status: 200 });
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

    return NextResponse.json({}, { status: 200 });
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

  return NextResponse.json({}, { status: 200 });
}

export async function GET(request: NextRequest) {
  const isAdmin = request.headers.get("x-admin");
  const userId = request.headers.get("x-user-id");

  if (!isAdmin && !userId) {
    return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  }

  let usersWithClasses;

  if (isAdmin) {
    usersWithClasses = await db.user.findMany({
      include: {
        DesiredDeparment: {
          include: {
            DesiredSubject: {
              include: {
                DesiredClass: true,
              },
            },
          },
        },
      },
    });
  } else {
    usersWithClasses = await db.user.findMany({
      where: {
        id: userId!,
      },
      include: {
        DesiredDeparment: {
          include: {
            DesiredSubject: {
              include: {
                DesiredClass: true,
              },
            },
          },
        },
      },
    });
  }
  const formattedUsersWithClasses: UserWithClass[] = usersWithClasses.map(
    (user) => ({
      email: user.email!,
      departments: user.DesiredDeparment.map((department) => ({
        name: department.name,
        subjects: department.DesiredSubject.map((subject) => ({
          name: subject.name,
          classes: subject.DesiredClass.map((classNumber) => ({
            number: classNumber.number,
          })),
        })),
      })),
    }),
  );

  return NextResponse.json(formattedUsersWithClasses, { status: 200 });
}
