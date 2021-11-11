import { Page, Layout, Card, Tag, Stack, TextField, Button, ResourceList, Toast, Frame } from "@shopify/polaris";
import {GET_ALL_PRODUCTS, UPDATE_PRODUCT_TAG} from '../graphql/Top10Products'
import { Query, useMutation } from 'react-apollo';
import { useCallback, useState, useEffect, useRef } from "react";
import { argsToArgsConfig } from "graphql/type/definition";

const Index = () => {

 const productsLayout = [];
 const productsLayoutTags = [];

 const [updateProductTag] = useMutation(UPDATE_PRODUCT_TAG);
 const [showToast, setShowToast] = useState(false);
 const [txtValue, setTxtValue] = useState([]);
 const txtValueRef = useRef(txtValue);



 const submitHandler = useCallback((product, index)=> {
  const runUpdate = (p) => {
    p.tags.push(txtValueRef.current[index]);
    const tagArray= p.tags.toString();
    updateProductTag({
      variables:{
        input:{
          id: p.id,
          tags: tagArray
        }
      }
    }).then((data) => {
      setShowToast(true);
      setTxtValue({})
    })
  }
  runUpdate(product);
 }, []);

 const removeHandler = useCallback((product, tags, removedTag)=> {
  console.log(tags);
  console.log(removedTag);
  const tagArray = tags.filter(t => {
    return t !== removedTag
  }).toString();

  const runUpdate = (p) => {
    updateProductTag({
      variables:{
        input:{
          id: p.id,
          tags: tagArray
        }
      }
    }).then((data) => {
      setShowToast(true);
      setTxtValue({})
    })
  }
  runUpdate(product);

 }, []);


 const toastMarkup = showToast ?
 <Toast
  content="Tags updated successfully"
  onDismiss= {() => setShowToast(false)}
  duration={4000}
  /> : null ;

  const handleTextFieldChanges = useCallback((e, index) => {
    var change = [];
    change[index] = e;
    setTxtValue(change);

  }, [txtValue, setTxtValue]);

  useEffect(
    () => {
      txtValueRef.current = txtValue;
    },
    [txtValue],
  );

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
                          return <Tag onRemove={e => removeHandler(element.node, element.node.tags, tag)} key={indexTag}>{tag}</Tag>;
                        })}
                        </Stack>
                      </Card.Section>
                      <Card.Section>
                        <Stack distribution="equalSpacing">
                          <TextField type="text" onChange={(e) => handleTextFieldChanges(e, index)} value={txtValue[index]} />
                          <Button primary id={'btn' +index} onClick={e => submitHandler(element.node, index)}>Add Tag</Button>
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
