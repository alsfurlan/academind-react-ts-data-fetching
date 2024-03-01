import { ReactNode, useEffect, useState } from 'react';
import { get } from './util/http';
import BlogPosts, { BlogPost } from './components/BlogPosts';
import fetchImage from './assets/data-fetching.png';

type BlogPostDto = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();

  useEffect(() => {
    async function fecthPosts() {
      const data = await get<BlogPostDto[]>(
        'https://jsonplaceholder.typicode.com/posts/'
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
