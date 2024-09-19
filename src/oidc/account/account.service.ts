import { Injectable } from '@nestjs/common';
import { UserService } from '../../oauth/user/user.service';
import { FindAccount } from 'oidc-provider';
import * as CryptoJS from 'crypto-js';
import * as crypto from 'crypto';
import { AuthDataValidator, urlStrToAuthDataMap } from '@telegram-auth/server';

@Injectable()
export class AccountService {
  constructor(private userService: UserService) {}

  findAccount: FindAccount = async (ctx, id: string) => {
    const user = await this.userService.findOne(id);

    if (!user) {
      return undefined;
    }

    return {
      accountId: id,
      async claims() {
        return {
          sub: user.email,
          email: user.email,
          fullName: user.fullName,
        };
      },
    };
  };

  private hashHmacSHA256(plainText: string, secretKey: string): string {
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(plainText);
    const hashedString = hmac.digest('hex');
    return hashedString;
  }

  async authenticate(user: any) {
    // const { id, firstName, lastName, photoUrl, authDate, hash, username } =
    //   user;

    // const dataString = `auth_date=<${authDate}>\nfirst_name=<${firstName}>\nid=<${id}?\nusername=<${username}>`;

    // Tạo query string từ telegramData
    const queryParams = new URLSearchParams(user);

    // Tạo URL với domain là localhost
    const url = `http://localhost:4000?${queryParams.toString()}`;

    const data = urlStrToAuthDataMap(url);

    console.log('datadata', data);

    const validator = new AuthDataValidator({
      botToken: '7523821158:AAF962-Jsj_HzucAqmRVtqsNy0lDakjeF-c',
    });

    const usercc = await validator.validate(data);

    console.log('usercc', usercc);

    // const user = await this.userService.authenticate(email, password);

    return user.id;
  }
}
