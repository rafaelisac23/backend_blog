import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import z from "zod";
import {
  createPost,
  createPostSlug,
  deletePost,
  getAllPosts,
  getPostByslug,
  handleCover,
  updatePost,
} from "../services/post";
import { getUserById } from "../services/user";
import { coverToUrl } from "../utils/CoverToUrl";
import { error } from "console";
import { title } from "process";

export const getPosts = async (req: ExtendedRequest, res: Response) => {
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page as string);
    if (page <= 0) {
      res.json({ error: "Page not found" });
      return;
    }
  }

  let posts = await getAllPosts(page);

  const postsToReturn = posts.map((post) => ({
    id: post.id,
    status: post.status,
    title: post.title,
    createdAt: post.createdAt,
    cover: coverToUrl(post.cover),
    authorName: post.author?.name,
    tags: post.tags,
    slug: post.slug,
  }));

  res.json({ posts: postsToReturn, page });
};

export const addPost = async (req: ExtendedRequest, res: Response) => {
  if (!req.user) return false;

  const schema = z.object({
    title: z.string(),
    tags: z.string(),
    body: z.string(),
  });

  const data = schema.safeParse(req.body);

  if (!data.success) {
    res.json({ error: data.error.flatten().fieldErrors });
    return;
  }

  if (!req.file) {
    res.json({ error: "Sem arquivo" });
    return;
  }

  //Lidar com o arquivo

  const coverName = await handleCover(req.file);

  if (!coverName) {
    res.json({ error: "Imagem não enviada" });
    return;
  }

  //Criar o slug do post

  const slug = await createPostSlug(data.data.title);

  //Criar o post
  const newPost = await createPost({
    authorId: req.user.id,
    slug,
    title: data.data.title,
    tags: data.data.tags,
    body: data.data.body,
    cover: coverName,
  });
  //Pegar a informação do author
  const author = await getUserById(newPost.authorId);

  //Fazer retorno segundo o plano
  res.status(201).json({
    Post: {
      id: newPost.id,
      slug: newPost.slug,
      title: newPost.title,
      createdAt: newPost.createdAt,
      cover: coverToUrl(newPost.cover),
      tags: newPost.tags,
      authorName: author?.name,
    },
  });
};

// export const getPost = async (req, res) => {};

export const editPost = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;

  const schema = z.object({
    status: z.enum(["PUBLISHED", "DRAFT"]).optional(),
    title: z.string().optional(),
    tags: z.string().optional(),
    body: z.string().optional(),
  });

  const data = schema.safeParse(req.body);

  if (!data.success) {
    res.json({ error: data.error.flatten().fieldErrors });
    return;
  }

  const post = await getPostByslug(slug);

  console.log(post);

  if (!post) {
    res.json({ Error: "Post Inexistente" });
    return;
  }

  let coverName: string | false = false;

  if (req.file) {
    coverName = await handleCover(req.file);
  }

  const updatedPost = await updatePost(slug, {
    updatedAt: new Date(),
    status: data.data.status ?? undefined,
    title: data.data.title ?? undefined,
    tags: data.data.tags ?? undefined,
    body: data.data.body ?? undefined,
    cover: coverName ? coverName : undefined,
  });

  const author = await getUserById(updatedPost.authorId);

  res.json({
    post: {
      id: updatedPost.id,
      status: updatedPost.status,
      slug: updatedPost.slug,
      title: updatedPost.title,
      tags: updatedPost.tags,
      body: updatedPost.body,
      createdAt: updatedPost.createdAt,
      cover: coverToUrl(updatedPost.cover),
      author: author?.name,
    },
  });
};

export const removePost = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;

  const post = await getPostByslug(slug);
  if (!post) {
    res.json({ erro: "Post Inexistente" });
    return;
  }

  await deletePost(post.slug);
  res.json({ error: null });
};
