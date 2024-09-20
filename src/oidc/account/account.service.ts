import { Injectable } from '@nestjs/common';
import { UserService } from '../../oauth/user/user.service';
import { FindAccount } from 'oidc-provider';
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
          sub: user.idTelegram.toString(),
          photoUrl: user.photoUrl,
          idTelegram: user.idTelegram,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        };
      },
    };
  };

  async authenticate(user: any) {
    // const { id, firstName, lastName, photoUrl, authDate, hash, username } =
    //   user;

    const queryParams = new URLSearchParams(user);

    const url = `https://app2.skyvn.top?${queryParams.toString()}`;

    const data = urlStrToAuthDataMap(url);

    const validator = new AuthDataValidator({
      botToken: '7523821158:AAF962-Jsj_HzucAqmRVtqsNy0lDakjeF-c',
    });

    const userValidated = await validator.validate(data);

    console.log('userValidated', userValidated);

    const userAuth = await this.userService.authenticate(user);

    console.log(userAuth);

    return user.id;
  }
}
