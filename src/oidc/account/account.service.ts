import { Injectable } from '@nestjs/common';
import { UserService } from '../../oauth/user/user.service';
import { FindAccount } from 'oidc-provider';
import crypto from 'crypto';

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

  async authenticate(user: any) {
    const { id, firstName, lastName, photoUrl, authDate, hash, username } =
      user;
    const dataString = `${id}\n${firstName}\n${lastName}\n${username}\n${photoUrl}\n${authDate}`;
    const secret = '7523821158:AAF962-Jsj_HzucAqmRVtqsNy0lDakjeF-c';

    const hashBE = crypto
      .createHmac('sha256', secret)
      .update(dataString)
      .digest('hex');

    const isValid = hash === hashBE;

    console.log('hash', hash);
    console.log('hashBE', hashBE);

    console.log('isValid', isValid);

    // const user = await this.userService.authenticate(email, password);

    return user.id;
  }
}
