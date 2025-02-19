import { useEffect } from 'react';
import { json } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { PackClient } from '@pack/client'

const HOME_GENERAL_QUERY = `
    query pageByHandle($handle: String!) {
        pageByHandle(handle: $handle) {
        id
        title
        description
        }
    }
`;

export async function loader({ context, params }) {

    const { pack } = context;
    const homeGeneral = await pack.query(HOME_GENERAL_QUERY, { variables: { handle: '/' } });

    return json({
        token: context.env.PACK_SECRET_TOKEN,
        homeGeneral
    });
}

export const Index = () => {
    const { token, homeGeneral } = useLoaderData();
    const { data: { pageByHandle } } = homeGeneral;

    console.log('pageByHandle', pageByHandle)

    return (
        <div>
            <h1>{pageByHandle ? pageByHandle.title : null}</h1>
        </div>
    );
};

export default Index