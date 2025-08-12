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
      (await this.prismaClient.vacancy.count()) +
      (await this.prismaClient.firm.count());

    console.log('Deleting existing data...');
    await this.prismaClient.admin.deleteMany();
    await this.prismaClient.user.deleteMany();
    await this.prismaClient.vacancy.deleteMany();
    await this.prismaClient.firm.deleteMany();
    console.log(`Deleted ${totalRows} from the database.`);

    console.log('Seeding database now....');
    await this.prismaClient.admin.create({
      data: {
        email: 'social.saurav2003@gmail.com',
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
      const firm = await this.prismaClient.firm.create({
        data: {
          email: faker.internet.email(),
          establishedOn: faker.date.past(),
          location: faker.location.city(),
          name: faker.company.name(),
          password: await hash(this.password, 10),
          phoneNumber: faker.phone.number(),
          type: faker.company.buzzNoun(),
        },
      });
      await this.prismaClient.vacancy.create({
        data: {
          firmID: firm.id,
          deadline: faker.date.future(),
          description: faker.lorem.lines(),
          title: faker.company.buzzNoun(),
          type: i % 2 === 0 ? 'ON_SITE' : 'REMOTE',
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
