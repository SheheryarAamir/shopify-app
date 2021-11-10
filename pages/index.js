import { Page, Layout, Card, Tag, Stack, TextField, Button, ResourceList, Toast, Frame } from "@shopify/polaris";
import {GET_ALL_PRODUCTS, UPDATE_PRODUCT_TAG} from '../graphql/Top10Products'
import { Query, useMutation } from 'react-apollo';
import { useCallback, useState, useEffect } from "react";
import { argsToArgsConfig } from "graphql/type/definition";

const Index = () => {

 const productsLayout = [];
 const productsLayoutTags = [];

 const [updateProductTag] = useMutation(UPDATE_PRODUCT_TAG);
 const [showToast, setShowToast] = useState(false);
 const [txtValue, setTxtValue] = useState({tags:[]});




 const submitHandler = useCallback((productId, index)=> {

   console.log(productId);
   console.log(txtValue);
   setShowToast(true);
  /*const runUpdate = (product) => {
    updateProductTag({
      variables:{
        id: product.id,
        tags: productsLayoutTags
      }
    }).then((data) => {
      console.log(data);
    })
  }*/
 }, []);


 const toastMarkup = showToast ?
 <Toast
  content="Tag added successgully"
  onDismiss= {() => setShowToast(false)}
  duration={4000}
  /> : null ;

  const handleTextFieldChanges = (e, index) => {
    var change = {};
    change[index] = e;
    setTxtValue(change);
    console.log(e);
    console.log("e.target.value");
    console.log(index);

  };
  const handleAddClick = useCallback(() => {
    setTxtValue(prevState => ({ tags: [...prevState.tags, '']}))
  }, []);
  return (
    <Frame>
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
                          <TextField type="text" onChange={(e) => handleTextFieldChanges(e, index)} value={txtValue[index]} />
                          <Button primary id={'btn' +index} onClick={e => submitHandler(element.node.id, 'txt'+index)}>Add Tag</Button>
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
        {toastMarkup}
    </Frame>
  )
}

export default Index;
