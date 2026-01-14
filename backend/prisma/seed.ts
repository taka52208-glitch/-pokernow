import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 既存データをクリア
  await prisma.seating.deleteMany();
  await prisma.event.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.table.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.player.deleteMany();

  // プレイヤー作成
  const players = await Promise.all([
    prisma.player.create({
      data: {
        pokerName: 'TestPlayer',
        displaySetting: 'public',
        authProvider: 'google',
        email: 'player@pokernow.local',
        role: 'player',
      },
    }),
    prisma.player.create({
      data: {
        pokerName: 'AdminUser',
        displaySetting: 'public',
        authProvider: 'google',
        email: 'admin@pokernow.local',
        role: 'admin',
      },
    }),
    prisma.player.create({
      data: {
        pokerName: 'Taka',
        displaySetting: 'public',
        authProvider: 'apple',
      },
    }),
    prisma.player.create({
      data: {
        pokerName: 'Yuki',
        displaySetting: 'masked',
        authProvider: 'google',
      },
    }),
    prisma.player.create({
      data: {
        pokerName: 'Ken',
        displaySetting: 'hidden',
        authProvider: 'phone',
      },
    }),
  ]);
  console.log(`✅ Created ${players.length} players`);

  // 店舗作成
  const shops = await Promise.all([
    prisma.shop.create({
      data: {
        name: 'Poker Club Tokyo',
        address: '東京都渋谷区道玄坂1-2-3 ポーカービル5F',
        imageUrl:
          'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800',
        latitude: 35.6595,
        longitude: 139.7004,
        openTime: '14:00',
        closeTime: '05:00',
      },
    }),
    prisma.shop.create({
      data: {
        name: 'Vegas Style Poker',
        address: '東京都新宿区歌舞伎町2-1-1',
        imageUrl:
          'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400',
        latitude: 35.6938,
        longitude: 139.7034,
        openTime: '18:00',
        closeTime: '06:00',
      },
    }),
    prisma.shop.create({
      data: {
        name: 'Royal Flush',
        address: '東京都港区六本木4-5-6',
        imageUrl:
          'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400',
        latitude: 35.6627,
        longitude: 139.7318,
        openTime: '15:00',
        closeTime: '04:00',
      },
    }),
  ]);
  console.log(`✅ Created ${shops.length} shops`);

  // 卓作成
  const tableData = [];
  for (const shop of shops) {
    const tableCount = shop.name === 'Poker Club Tokyo' ? 8 : 5;
    for (let i = 1; i <= tableCount; i++) {
      tableData.push({
        shopId: shop.id,
        name: `卓${i}`,
        qrCode: `pokernow://${shop.id}/table/${i}`,
        maxSeats: 9,
        isActive: i <= tableCount - 1, // 1つは非稼働
      });
    }
  }
  await prisma.table.createMany({ data: tableData });
  console.log(`✅ Created ${tableData.length} tables`);

  // イベント作成
  const today = new Date();
  const eventData = [
    {
      shopId: shops[0].id,
      title: '初心者講習会',
      description: 'ポーカーのルールを学ぼう！',
      startTime: '14:00',
      endTime: '16:00',
    },
    {
      shopId: shops[0].id,
      title: 'ナイトトーナメント',
      startTime: '20:00',
    },
    {
      shopId: shops[1].id,
      title: 'ウィークエンドスペシャル',
      startTime: '19:00',
      endTime: '23:00',
    },
  ];
  await prisma.event.createMany({ data: eventData });
  console.log(`✅ Created ${eventData.length} events`);

  // トーナメント作成
  const defaultStructure = [
    { level: 1, smallBlind: 25, bigBlind: 50, duration: 20, isBreak: false },
    { level: 2, smallBlind: 50, bigBlind: 100, duration: 20, isBreak: false },
    { level: 3, smallBlind: 75, bigBlind: 150, duration: 20, isBreak: false },
    { level: 0, smallBlind: 0, bigBlind: 0, duration: 10, isBreak: true },
    {
      level: 4,
      smallBlind: 100,
      bigBlind: 200,
      ante: 25,
      duration: 20,
      isBreak: false,
    },
    {
      level: 5,
      smallBlind: 150,
      bigBlind: 300,
      ante: 50,
      duration: 20,
      isBreak: false,
    },
  ];

  await prisma.tournament.create({
    data: {
      shopId: shops[0].id,
      name: 'サンデートーナメント',
      status: 'running',
      currentLevel: 3,
      remainingSeconds: 754,
      structure: JSON.stringify(defaultStructure),
      entryFee: 3000,
      startingStack: 10000,
      startedAt: new Date(today.getTime() - 2 * 60 * 60 * 1000),
    },
  });
  console.log('✅ Created 1 tournament');

  // 着席データ作成
  const tables = await prisma.table.findMany({ where: { shopId: shops[0].id } });
  const seatingsData = [];
  for (let i = 0; i < Math.min(3, tables.length); i++) {
    for (let j = 0; j < Math.min(players.length, 3); j++) {
      if (i === 0 || j < 2) {
        seatingsData.push({
          playerId: players[j + (i * 2) % players.length].id,
          shopId: shops[0].id,
          tableId: tables[i].id,
          seatNumber: j + 1,
        });
      }
    }
  }
  // 重複を避けるため一部だけ作成
  const uniqueSeatings = seatingsData.slice(0, 5);
  for (const seating of uniqueSeatings) {
    await prisma.seating.create({ data: seating });
  }
  console.log(`✅ Created ${uniqueSeatings.length} seatings`);

  console.log('');
  console.log('🎉 Database seeding completed!');
  console.log('');
  console.log('Test accounts:');
  console.log('  Player: player@pokernow.local');
  console.log('  Admin:  admin@pokernow.local');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
