import fs from "fs/promises";
import slug from "slug";
import { v4 } from "uuid";
import { prisma } from "../libs/prisma";

export const getPostByslug = async (slug: string) => {
  return await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const handleCover = async (file: Express.Multer.File) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];

  if (allowed.includes(file.mimetype)) {
    const coverName = `${v4()}.jpg`;

    try {
      await fs.rename(file.path, `./public/images/covers/${coverName}`);
    } catch (err) {
      return false;
    }

    return coverName;
  }

  return false;
};

export const createPostSlug = async (title: string) => {
  let newSlug = slug(title);
  let keepTrying = true;
  let PostCount = 1;

  while (keepTrying) {
    const post = await getPostByslug(newSlug);

    if (!post) {
      keepTrying = false;
    } else {
      newSlug = slug(`${title} ${++PostCount}`);
    }
  }

  return newSlug;
};

type CreatePostProps = {
  authorId: number;
  slug: string;
  title: string;
  tags: string;
  body: string;
  cover: string;
};

export const createPost = async (data: CreatePostProps) => {
  return await prisma.post.create({ data });
};
