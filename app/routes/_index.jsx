import { useEffect } from 'react';
import {json} from '@shopify/remix-oxygen';
import { PackClient } from '@pack/client'


export async function loader({ context, params }) {
  return json({
    token: context.env.PACK_SECRET_TOKEN,
  });
}

import { useLoaderData } from '@remix-run/react';

export const Index = () => {
  const { token } = useLoaderData();

  // Initialize the client with the fetched token
  const packClient = new PackClient({
    apiUrl: 'https://app.packdigital.com/graphql', // defaults to our CDN API https://apicdn.packdigital.com/graphql
    token: token,
    contentEnvironment: 'content_environment_handle', // defaults to the primary content environment
  });

  // Make a query to fetch the site settings
  useEffect(() => {
    if (packClient) {
      const query = `
      query Page($handle: string!) {
        siteSettings(handle: $handle) {
          id
          title
          description
        }
      }
    `;
      const fetchData = async () => {
        const response = await packClient.fetch(query, {variables: { handle: '/' }});
        console.log('123231', response.data);
      };
      fetchData();
    }
  }, []);

   return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Index