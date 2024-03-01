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
  const [isFetching, setIsFetching] = useState<boolean>();

  useEffect(() => {
    async function getPosts() {
      setIsFetching(true);
      const data = await get(
        'https://jsonplaceholder.typicode.com/posts/',
        z.array(rawDataBlogPostSchema)
      );

      const blogPosts: BlogPost[] = data.map(({ id, title, body }) => ({
        id,
        title,
        text: body,
      }));
      setIsFetching(false);
      setFetchedPosts(blogPosts);
    }

    getPosts();
  }, []);

  let content: ReactNode;
  
  if(fetchedPosts){
    content = <BlogPosts posts={fetchedPosts} />
  }

  if(isFetching) {
    content = <p id="loading-fallback">Fetching posts...</p>
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
