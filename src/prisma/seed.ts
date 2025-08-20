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
      (await this.prismaClient.business.count()) +
      (await this.prismaClient.userAssets.count()) +
      (await this.prismaClient.adminAssets.count()) +
      (await this.prismaClient.vacancyAssets.count()) +
      (await this.prismaClient.businessAssets.count());

    console.log('Deleting existing data...');
    await this.prismaClient.vacancyAssets.deleteMany();
    await this.prismaClient.vacancy.deleteMany();
    await this.prismaClient.businessAssets.deleteMany();
    await this.prismaClient.business.deleteMany();
    await this.prismaClient.userAssets.deleteMany();
    await this.prismaClient.user.deleteMany();
    await this.prismaClient.adminAssets.deleteMany();
    await this.prismaClient.admin.deleteMany();
    console.log(`Deleted ${totalRows} rows from the database.`);

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

    for (let i = 0; i < 69; i++) {
      const user = await this.prismaClient.user.create({
        data: {
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          password: await hash(this.password, 10),
          address: faker.location.city(),
          phoneNumber: faker.phone.number(),
          isBusinessAccount: i % 2 === 0,
        },
      });
      if (i % 2 === 0) {
        const business = await this.prismaClient.business.create({
          data: {
            address: faker.location.city(),
            name: faker.company.name(),
            phoneNumber: faker.phone.number(),
            userID: user.id,
            description: faker.lorem.paragraph(),
            website: faker.internet.domainName(),
            status: 'APPROVED',
          },
        });
        await this.prismaClient.vacancy.create({
          data: {
            deadline: faker.date.future(),
            description: faker.lorem.paragraph(),
            title: faker.company.name(),
            type: 'HYBRID',
            level: ['FRESHER', 'JUNIOR', 'MID_LEVEL', 'SENIOR'],
            businessID: business.id,
          },
        });
      }
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
