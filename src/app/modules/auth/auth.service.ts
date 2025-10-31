import  httpStatus  from 'http-status';
import  bcrypt  from 'bcryptjs';
import { UserStatus } from "@prisma/client"
import { prisma } from "../../shared/prisma"
import { Secret } from 'jsonwebtoken'
import config from '../../../config';
import { jwtHelper } from '../../helper/jwtHelper';
import APIError from '../../errors/APIError';
import emailSender from './emailSender';

const login = async(payload: {email:string, password:string})=>{
  const user = await prisma.user.findUniqueOrThrow({
    where:{
      email:payload.email,
      status:UserStatus.ACTIVE
    }
  })

  const isCorrectPassword = await bcrypt.compare(payload.password, user.password)
  if(!isCorrectPassword){
    throw new APIError(httpStatus.BAD_REQUEST,"Password is Incorrect")
  }

  const accessToken = jwtHelper.generateToken({email: user.email, role: user.role}, config.jwt_secret as string, "1h")

  const refreshToken = jwtHelper.generateToken({email: user.email, role: user.role}, config.jwt_secret as string, "90d")

  return {
    accessToken,
    refreshToken
  }
}

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelper.verifyToken(token, config.jwt_secret as Secret);
    }
    catch (err) {
        throw new Error("You are not authorized!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = jwtHelper.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt_secret as Secret,
        config.JWT_ACCESS as string
    );

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };

};

const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt));

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })

    return {
        message: "Password changed successfully!"
    }
};

const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const resetPassToken = jwtHelper.generateToken(
        { email: userData.email, role: userData.role },
        config.RESET_PASS_TOKEN as Secret,
        config.RESET_PASS_TOKEN_EXPIRES_IN as string
    )

    const resetPassLink = config.RESET_PASS_LINK + `?userId=${userData.id}&token=${resetPassToken}`

    await emailSender(
        userData.email,
        `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
    )
};

const resetPassword = async (token: string, payload: { id: string, password: string }) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    });

    const isValidToken = jwtHelper.verifyToken(token, config.RESET_PASS_TOKEN as Secret)

    if (!isValidToken) {
        throw new APIError(httpStatus.FORBIDDEN, "Forbidden!")
    }

    // hash password
    const password = await bcrypt.hash(payload.password, Number(config.bcrypt_salt));

    // update into database
    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    })
};

const getMe = async (session: any) => {
    const accessToken = session.accessToken;
    const decodedData = jwtHelper.verifyToken(accessToken, config.jwt_secret as Secret);

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    })

    const { id, email, role, needPasswordChange, status } = userData;

    return {
        id,
        email,
        role,
        needPasswordChange,
        status
    }

}

export const authService={
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  getMe
}
