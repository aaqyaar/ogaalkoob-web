import { Prisma } from "@prisma/client";

export const genre = [
  {
    name: "Fiction",
  },
  {
    name: "Nonfiction",
  },
  {
    name: "Fantasy",
  },
  {
    name: "Romance",
  },
  {
    name: "Children's",
  },
  {
    name: "Biography",
  },
  {
    name: "Self-Help",
  },
  {
    name: "History",
  },
  {
    name: "Travel",
  },
  {
    name: "Cooking",
  },
  {
    name: "Art",
  },
  {
    name: "Poetry",
  },
  {
    name: "Humor",
  },
  {
    name: "Religion",
  },
];

export const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publishedDate: "1925-04-10",
    photos: [
      "https://m.media-amazon.com/images/I/91GO13K08eL._AC_UF894,1000_QL80_.jpg",
    ],
    isbn: "978-0743273565",
    price: 9.99,
    description: "A classic novel set in the roaring 1920s.",
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    publishedDate: "1960-07-11",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-0061120084",
    price: 12.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description:
      "A powerful story about racism and justice in the American South.",
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    publishedDate: "1997-06-26",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-0439708180",
    price: 14.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description: "The first book in the magical Harry Potter series.",
  },
  {
    title: "1984",
    author: "George Orwell",
    publishedDate: "1949-06-08",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-0451524935",
    price: 10.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description: "A dystopian novel depicting a totalitarian society.",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    publishedDate: "1951-07-16",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-0316769174",
    price: 11.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description:
      "A coming-of-age novel featuring the rebellious Holden Caulfield.",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    publishedDate: "1813-01-28",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-0141439518",
    price: 8.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description: "A classic romance novel set in the early 19th century.",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    publishedDate: "1937-09-21",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-0618260300",
    price: 13.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description: "An epic fantasy adventure featuring Bilbo Baggins.",
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    publishedDate: "2003-03-18",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-0307474278",
    price: 9.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description: "A thrilling mystery involving art and religion.",
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    publishedDate: "1954-07-29",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-0618640157",
    price: 19.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description: "A classic high-fantasy trilogy.",
  },
  {
    title: "The Shining",
    author: "Stephen King",
    publishedDate: "1977-01-28",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-0307743657",
    price: 11.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description: "A horror novel set in a haunted hotel.",
  },
  {
    title: "The Hunger Games",
    author: "Suzanne Collins",
    publishedDate: "2008-09-14",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-0439023481",
    price: 12.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description: "A dystopian tale of survival and rebellion.",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    publishedDate: "1988-01-01",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-0061122415",
    price: 10.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description: "A philosophical novel about following one's dreams.",
  },
  {
    title: "The Girl on the Train",
    author: "Paula Hawkins",
    publishedDate: "2015-01-13",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-1594633669",
    price: 9.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description: "A psychological thriller centered around a missing woman.",
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    publishedDate: "1932-10-27",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-0060850524",
    price: 10.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description: "A classic dystopian novel depicting a future society.",
  },
  {
    title: "The Road",
    author: "Cormac McCarthy",
    publishedDate: "2006-09-26",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-0307265432",
    price: 11.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description: "A post-apocalyptic tale of survival and love.",
  },
  {
    title: "The Fault in Our Stars",
    author: "John Green",
    publishedDate: "2012-01-10",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-0142424179",
    price: 12.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description: "A heartfelt story of young love and cancer.",
  },
  {
    title: "A Song of Ice and Fire: A Game of Thrones",
    author: "George R.R. Martin",
    publishedDate: "1996-08-06",
    photos: [
      "https://cdn.kobo.com/book-images/3cb45de8-1e9d-4397-ace1-f6a0d5a6a863/353/569/90/False/atomic-habits-an-easy-and-proven-way-to-build-good-habits-and-break-bad-ones.jpg",
    ],
    isbn: "978-0553573404",
    price: 15.99,
    pdfUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/IJIEEB-V13-N5-5-1700753215560.pdf",
    audioUrl:
      "https://pub-c49d4c6084bd4825a730310681ab39d5.r2.dev/rnr280-final-1700751504800.mp3",
    description: "The epic fantasy series that inspired the TV show.",
  },
];
