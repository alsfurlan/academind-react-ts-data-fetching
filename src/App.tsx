import { ReactNode, useEffect, useState } from 'react';
import { get } from './util/http';
import BlogPosts, { BlogPost } from './components/BlogPosts';
import fetchImage from './assets/data-fetching.png';
import { z } from 'zod';

const rawDataBlogPostSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
})

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();

  useEffect(() => {
    async function fecthPosts() {
      const data = await get(
        'https://jsonplaceholder.typicode.com/posts/',
        z.array(rawDataBlogPostSchema)
      );

      const blogPosts: BlogPost[] = data.map(({ id, title, body }) => ({
        id,
        title,
        text: body,
      }));

      setFetchedPosts(blogPosts);
    }

    fecthPosts();
  }, []);

  let content: ReactNode = fetchedPosts ? (
    <BlogPosts posts={fetchedPosts} />
  ) : null;

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
