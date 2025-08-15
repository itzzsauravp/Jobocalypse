import { faker } from '@faker-js/faker';
import { PrismaClient } from '../../generated/prisma';
import { hash } from 'bcryptjs';

class SeedDatabase {
  private readonly password = '7PHxOINJxdlrZy';
  constructor(private readonly prismaClient: PrismaClient) {}

  async main() {
    const totalRows =
      (await this.prismaClient.user.count()) +
      (await this.prismaClient.admin.count()) +
      (await this.prismaClient.vacancy.count());

    console.log('Deleting existing data...');
    await this.prismaClient.admin.deleteMany();
    await this.prismaClient.user.deleteMany();
    await this.prismaClient.vacancy.deleteMany();
    console.log(`Deleted ${totalRows} from the database.`);

    console.log('Seeding database now....');
    await this.prismaClient.admin.create({
      data: {
        email: 'admin@gmail.com',
        firstName: 'Saurav',
        lastName: 'Parajulee',
        password: await hash(this.password, 10),
        address: faker.location.city(),
        phoneNumber: faker.phone.number(),
      },
    });

    for (let i = 0; i < 50; i++) {
      await this.prismaClient.user.create({
        data: {
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          password: await hash(this.password, 10),
          address: faker.location.city(),
          phoneNumber: faker.phone.number(),
        },
      });
    }
  }
}

const prismaClientInstance = new PrismaClient();
const databaseSeedObject = new SeedDatabase(prismaClientInstance);
databaseSeedObject
  .main()
  .then(() => console.log('Seed completed!!!'))
  .catch((error) => console.log(error))
  .finally(() => {
    prismaClientInstance
      .$disconnect()
      .then(() => console.log('Database disconnected'))
      .catch((error) => console.log(error));
  });
