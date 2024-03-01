import { ReactNode, useEffect, useState } from 'react';
import { get } from './util/http';
import BlogPosts, { BlogPost } from './components/BlogPosts';
import fetchImage from './assets/data-fetching.png';
import { z } from 'zod';
import ErrorMessage from './components/ErrorMessage';

const rawDataBlogPostSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
});

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();
  const [isFetching, setIsFetching] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function getPosts() {
      try {
        setIsFetching(true);
        const data = await get(
          'https://jsonplaceholder.typicode.com/postss/',
          z.array(rawDataBlogPostSchema)
        );

        const blogPosts: BlogPost[] = data.map(({ id, title, body }) => ({
          id,
          title,
          text: body,
        }));
        setFetchedPosts(blogPosts);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setIsFetching(false);
      }
    }

    getPosts();
  }, []);

  let content: ReactNode;

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />;
  }

  if (isFetching) {
    content = <p id='loading-fallback'>Fetching posts...</p>;
  }

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  return (
    <main>
      <img
        src={fetchImage}
        alt='An abstract image depicting a data fetching process.'
      />
      {content}
    </main>
  );
}

export default App;
