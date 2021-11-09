import { Page, Layout, Card, Tag, Stack, TextField, Button, ResourceList } from "@shopify/polaris";
import {GET_ALL_PRODUCTS, UPDATE_PRODUCT_TAG} from '../graphql/Top10Products'
import { Query, useMutation } from 'react-apollo';
import { useCallback } from "react";
import { argsToArgsConfig } from "graphql/type/definition";

const Index = () => {

 const productsLayout = [];
 const productsLayoutTags = [];

 const [updateProductTag] = useMutation(UPDATE_PRODUCT_TAG);


 const submitHandler = useCallback(()=> {
  const runUpdate = (product) => {
    updateProductTag({
      variables:{
        id: product.id,
        tags: productsLayoutTags
      }
    }).then((data) => {
      console.log(data);
    })
  }
 });

  return (
    <Page title="Product Tags">

        <Query query={GET_ALL_PRODUCTS} variables={{ index: 4 , lastCursor: ''}}>
        {({ data, loading, error }) => {

          if (loading) return <div>Loading…</div>;
          if (error) return <div>{error.message}</div>;
          if (!data) return <div>No Products</div>;



          return (
            <Layout>
              {data.products.edges.map((element, index) => {
                return (
                  <Layout.Section oneHalf key={index}>
                    <Card title={element.node.title} sectioned>
                      <Card.Section>
                        <Stack>
                        {element.node.tags.map((tag, indexTag) => {
                          return <Tag onRemove={() => console.log('Removed')} key={indexTag}>{tag}</Tag>;
                        })}
                        </Stack>
                      </Card.Section>
                      <Card.Section>
                        <Stack distribution="equalSpacing">
                          <TextField />
                          <Button primary >Add Tag</Button>
                        </Stack>
                      </Card.Section>
                    </Card>
                  </Layout.Section>
                )
            })}
            </Layout>
          )

          }}
        </Query>

    </Page>
  )
}

export default Index;
