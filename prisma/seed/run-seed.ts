import { books, genre as genres } from "./books-seed";
import { users, roles } from "./user-seed";
import prisma from "../../lib/prisma";
import { hashPassword } from "../../lib/helpers";

async function main() {
  console.log(`Start seeding ...`);

  for (const genre of genres) {
    const { name } = genre;
    console.log(`Adding genre: ${name}`);
    await prisma.genre.create({
      data: {
        name,
      },
    });
  }

  for (const book of books) {
    const { title, author, publishedDate, photos, isbn, price, description } =
      book;

    // get i need to give every to one unique genre id
    const genreIds = await prisma.genre.findMany({
      select: {
        id: true,
      },
    });

    console.log(`Adding book: ${title}`);
    await prisma.book.create({
      data: {
        // title,
        // author,
        ...book,
        publishedDate: new Date(publishedDate),
        // photos,
        // isbn,
        // price,
        // description,
        genre: {
          connect: {
            id: genreIds[Math.floor(Math.random() * genreIds.length)].id,
          },
        },
      },
    });
  }

  for (const role of roles) {
    const { name, createdAt, updatedAt } = role;
    console.log(`Adding role: ${name}`);
    await prisma.role.create({
      data: {
        name,
        createdAt,
        updatedAt,
      },
    });
  }

  const adminRole = await prisma.role.findFirst({
    where: {
      name: "ADMIN",
    },
  });

  const subscriberRole = await prisma.role.findFirst({
    where: {
      name: "SUBSCRIBER",
    },
  });

  for (const user of users) {
    const { email, password, name, status, phone } = user;
    console.log(`Adding user: ${email}`);
    const hash = await hashPassword(password);
    await prisma.user.create({
      data: {
        email,
        password: hash,
        name,
        status,
        phone,
        role: {
          connect: {
            id:
              status === "ACTIVE" && !email.includes("test")
                ? adminRole?.id
                : subscriberRole?.id,
          },
        },
      },
    });
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
