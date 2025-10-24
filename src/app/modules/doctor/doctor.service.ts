import { Doctor, Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../shared/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters; //destructured specialties

  const andCondition: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      //pushed the OR inside andCondition
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if(specialties && specialties.length > 0){
    andCondition.push({
      doctorSpecialties: {
        some: {
          specialties:{
            title: {
              contains: specialties,
              mode: "insensitive"
            }
          }
        }
      }
    })
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andCondition.push(...filterConditions);
  }

  const whereConditions: Prisma.DoctorWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      //add this meta on sendResponse in controller layer
      total,
      page,
      limit,
    },
    data: result,
  };
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IDoctorUpdateInput>
) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const { specialties, ...doctorData } = payload;

  return await prisma.$transaction(async (tax) => {
    if (specialties && specialties.length > 0) {
      const deleteSpecialtyIds = specialties.filter(
        (specialty) => specialty.isDeleted
      );
      for (const specialty of deleteSpecialtyIds) {
        await tax.doctorSpecialties.deleteMany({
          where: {
            doctorId: id,
            specialtiesId: specialty.specialtyId,
          },
        });
      }

      const createSpecialtyIds = specialties.filter(
        (specialty) => !specialty.isDeleted
      );
      for (const specialty of createSpecialtyIds) {
        await tax.doctorSpecialties.create({
          data: {
            doctorId: id,
            specialtiesId: specialty.specialtyId,
          },
        });
      }
    }

    const updatedData = await tax.doctor.update({
      where: {
        id: doctorInfo.id,
      },
      data: doctorData, //use doctorData instead of payload
      include: {
        doctorSpecialties: {
          include: {
            specialties: true,
          },
        },
      },
    });

    return updatedData;
  });
};

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true,
                },
            },
            doctorSchedules: {
                include: {
                    schedule: true
                }
            }
        },
    });
    return result;
};

const deleteFromDB = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async (transactionClient) => {
        const deleteDoctor = await transactionClient.doctor.delete({
            where: {
                id,
            },
        });

        await transactionClient.user.delete({
            where: {
                email: deleteDoctor.email,
            },
        });

        return deleteDoctor;
    });
};

export const DoctorService = {
  getAllFromDB,
  updateIntoDB,
  getByIdFromDB,
  deleteFromDB
};
