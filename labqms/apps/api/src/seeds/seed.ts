import 'reflect-metadata';
import { DataSource } from 'typeorm';
import configuration from '../config/configuration';
import { ENTITIES, Role, User, RegisterDefinition, RegisterEntry, Equipment } from '../common/entities';
import { HEMATOLOGY_REGISTERS } from '@labqms/schema';
import argon2 from 'argon2';

const config = configuration();

const dataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: ENTITIES,
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();
  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);
  const registerRepo = dataSource.getRepository(RegisterDefinition);
  const entryRepo = dataSource.getRepository(RegisterEntry);
  const equipmentRepo = dataSource.getRepository(Equipment);

  const roles = [
    { name: 'Admin' },
    { name: 'Quality Manager' },
    { name: 'Section Lead' },
    { name: 'Technologist' },
    { name: 'Assessor' },
  ];

  for (const role of roles) {
    const existing = await roleRepo.findOne({ where: { name: role.name } });
    if (!existing) {
      await roleRepo.save(roleRepo.create({ ...role, permissions: {} }));
    }
  }

  const adminRole = await roleRepo.findOne({ where: { name: 'Admin' } });
  if (adminRole) {
    const adminEmail = 'admin@aiimsbhopal.edu';
    const existingUser = await userRepo.findOne({ where: { email: adminEmail } });
    if (!existingUser) {
      const passwordHash = await argon2.hash('Labqms@123');
      const admin = userRepo.create({
        email: adminEmail,
        fullName: 'System Administrator',
        passwordHash,
        roleId: adminRole.id,
      });
      await userRepo.save(admin);
    }
  }

  for (const definition of HEMATOLOGY_REGISTERS) {
    const exists = await registerRepo.findOne({ where: { code: definition.code } });
    if (!exists) {
      const saved = await registerRepo.save(
        registerRepo.create({
          code: definition.code,
          name: definition.name,
          stack: definition.stack,
          schema: definition.schema,
          workflow: definition.workflow,
          retention: definition.retention,
          active: true,
        }),
      );
      for (const sample of definition.sampleEntries) {
        await entryRepo.save(
          entryRepo.create({
            definitionId: saved.id,
            data: sample,
            status: 'verified',
          }),
        );
      }
    }
  }

  const equipmentExists = await equipmentRepo.findOne({ where: { identifier: 'XN1000-001' } });
  if (!equipmentExists) {
    await equipmentRepo.save(
      equipmentRepo.create({
        name: 'Sysmex XN-1000',
        identifier: 'XN1000-001',
        commissionDate: '2022-01-01',
        metadata: { location: 'Hematology bench' },
      }),
    );
  }

  await dataSource.destroy();
  console.log('Seed completed');
}

seed().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});
