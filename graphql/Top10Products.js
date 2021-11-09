import gql from "graphql-tag";

export const GET_ALL_PRODUCTS = gql`
query GetAllProducts($index:Int){
	products(first: $index)  {
		edges{

      node {
        id
        title
        tags
      }
    }
	}
}
`;

export const UPDATE_PRODUCT_TAG = gql`
mutation productUpdate($input: ProductInput!) {
  productUpdate(input: $input) {
    userErrors {
      field
      message
    }
    product {
      id
      tags
    }
  }
}
`;
