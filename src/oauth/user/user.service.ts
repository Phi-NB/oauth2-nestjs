import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto, User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly HASH_ITERATIONS = 15000;
  private readonly KEY_LEN = 32;

  constructor(
    @InjectRepository(User) private readonly _repo: Repository<User>,
  ) {}

  findOne(id: string) {
    return this._repo.findOneOrFail(id);
  }

  async register(dto: RegisterUserDto) {
    // const salt = randomBytes(12).toString('base64');
    // const key = await new Promise<string>((resolve, reject) => {
    //   pbkdf2(
    //     dto.password,
    //     salt,
    //     this.HASH_ITERATIONS,
    //     this.KEY_LEN,
    //     'sha256',
    //     (err, result) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(result.toString('base64'));
    //       }
    //     },
    //   );
    // });

    // const hash = `pbkdf2_sha256$${this.HASH_ITERATIONS}$${salt}$${key}`;

    return await this._repo
      .save({
        // fullName: dto.fullName,
        // email: dto.email,
        // hash,
      })
      .then((user) => {
        // delete user.hash;
        return user;
      });
  }

  async authenticate(params: any) {
    const user = await this._repo.findOneOrFail(
      { idTelegram: params.id },
      {
        select: [
          'idTelegram',
          'firstName',
          'id',
          'lastName',
          'username',
          'photoUrl',
        ],
      },
    );

    if (!user) {
      try {
        await this._repo.save({
          idTelegram: params.idTelegram,
          firstName: params.firstName,
          lastName: params.lastName,
          username: params.username,
          photoUrl: params.photoUrl,
        });
      } catch (error) {
        throw new UnauthorizedException();
      }
    }
    return params;
  }
}
