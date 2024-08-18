import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, UserValidateType } from '../types/index';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

//   async validateUser(payload: JwtPayload): Promise<User | null> {
//     const user = await this.userModel.findOne({
//       _id: payload.userId,
//       email: payload.email,
//     });
//     if (user) {
//       return user;
//     }
//     return null;
//   }



  async validate(payload: JwtPayload): Promise<UserValidateType> {
    if (!payload) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
